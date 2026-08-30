import { Prisma } from "@prisma/client"

import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibSesi, type SesiPengguna } from "@/lib/rbac"
import { detailZod, skemaPendaftaranKelas } from "@/lib/validasi"
import { adapterPakasir, type AdapterPakasir } from "@/lib/integrasi/pakasir"
import { bentukOrderIdPakasir } from "@/lib/layanan/nomor-dokumen"
import { statusPendaftaranMemakaiKuota } from "@/lib/layanan/status"
import { konfigurasi } from "@/lib/konfigurasi"

export type DependensiPendaftaran = {
	db?: KlienDb
	pakasir?: AdapterPakasir
	sekarang?: () => Date
	appUrl?: string
}

export type HasilPendaftaran = {
	enrollmentId: string
	paymentId: string
	orderId: string
	urlPembayaran: string
}

/**
 * Pendaftaran kelas.
 * Seluruh pemeriksaan (kelas aktif, jadwal, pendaftaran ganda, kuota) dan
 * pembuatan Enrollment(PENDING) + Payment(PENDING) dijalankan dalam satu
 * transaksi basis data. URL pembayaran dihasilkan adapter Pakasir.
 */
export async function daftarKelas(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiPendaftaran = {},
): Promise<HasilPendaftaran> {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma
	const pakasir = dependensi.pakasir ?? adapterPakasir()
	const sekarang = dependensi.sekarang ?? (() => new Date())
	const appUrl = dependensi.appUrl ?? konfigurasi().APP_URL

	const hasil = skemaPendaftaranKelas.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Kelas yang dipilih tidak valid.",
			detailZod(hasil.error),
		)
	}

	const waktu = sekarang()

	try {
		const dibuat = await db.$transaction(async (tx) => {
			const kelas = await tx.courseClass.findUnique({
				where: { slug: hasil.data.slugKelas },
				select: {
					id: true,
					judul: true,
					harga: true,
					kuota: true,
					aktif: true,
					jadwalMulai: true,
				},
			})

			if (!kelas || !kelas.aktif) {
				throw new KesalahanDomain(
					"TIDAK_DITEMUKAN",
					"Kelas tidak tersedia untuk pendaftaran.",
				)
			}

			if (kelas.jadwalMulai.getTime() <= waktu.getTime()) {
				throw new KesalahanDomain(
					"TRANSISI_TIDAK_SAH",
					"Pendaftaran kelas ini sudah ditutup karena jadwal telah dimulai.",
				)
			}

			const pendaftaranLama = await tx.enrollment.findUnique({
				where: {
					userId_classId: { userId: pengguna.id, classId: kelas.id },
				},
				select: { id: true, status: true },
			})
			if (pendaftaranLama) {
				throw new KesalahanDomain(
					"KONFLIK",
					pendaftaranLama.status === "PAID"
						? "Anda sudah terdaftar dan lunas pada kelas ini."
						: "Anda sudah memiliki pendaftaran pada kelas ini. Silakan lanjutkan pembayaran dari halaman kelas saya.",
				)
			}

			const terpakai = await tx.enrollment.count({
				where: {
					classId: kelas.id,
					status: { in: statusPendaftaranMemakaiKuota },
				},
			})
			if (terpakai >= kelas.kuota) {
				throw new KesalahanDomain(
					"KONFLIK",
					"Kuota kelas ini sudah penuh. Silakan pilih kelas lain.",
				)
			}

			const enrollment = await tx.enrollment.create({
				data: {
					userId: pengguna.id,
					classId: kelas.id,
					status: "PENDING",
				},
				select: { id: true },
			})

			const orderId = bentukOrderIdPakasir(waktu)
			const payment = await tx.payment.create({
				data: {
					enrollmentId: enrollment.id,
					pakasirRef: orderId,
					nominal: kelas.harga,
					status: "PENDING",
				},
				select: { id: true, nominal: true },
			})

			return { enrollment, payment, orderId }
		})

		const urlKembali = new URL("/user/pembayaran", appUrl)
		urlKembali.searchParams.set("order_id", dibuat.orderId)

		const urlPembayaran = pakasir.buatUrlPembayaran({
			orderId: dibuat.orderId,
			nominal: dibuat.payment.nominal.toString(),
			urlKembali: urlKembali.toString(),
		})

		return {
			enrollmentId: dibuat.enrollment.id,
			paymentId: dibuat.payment.id,
			orderId: dibuat.orderId,
			urlPembayaran,
		}
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2002"
		) {
			throw new KesalahanDomain(
				"KONFLIK",
				"Anda sudah memiliki pendaftaran pada kelas ini.",
			)
		}
		throw kesalahan
	}
}

/** Kelas milik pengguna yang sedang masuk (query selalu difilter pemilik). */
export async function kelasSaya(
	sesi: SesiPengguna | null,
	dependensi: DependensiPendaftaran = {},
) {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma

	return db.enrollment.findMany({
		where: { userId: pengguna.id },
		orderBy: { createdAt: "desc" },
		include: {
			kelas: {
				select: {
					id: true,
					judul: true,
					slug: true,
					jadwalMulai: true,
					lokasi: true,
					harga: true,
				},
			},
			payment: {
				select: {
					id: true,
					status: true,
					nominal: true,
					pakasirRef: true,
					dibayarPada: true,
					invoice: { select: { id: true, nomor: true } },
				},
			},
			attendance: {
				select: {
					id: true,
					waktuScan: true,
					certificate: {
						select: { id: true, nomor: true, revokedAt: true },
					},
				},
			},
		},
	})
}

/**
 * Melanjutkan pembayaran untuk pendaftaran PENDING milik pengguna.
 * Tidak membuat pendaftaran baru dan tidak mengubah status pembayaran.
 */
export async function lanjutkanPembayaran(
	sesi: SesiPengguna | null,
	enrollmentId: string,
	dependensi: DependensiPendaftaran = {},
): Promise<{ urlPembayaran: string }> {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma
	const pakasir = dependensi.pakasir ?? adapterPakasir()
	const appUrl = dependensi.appUrl ?? konfigurasi().APP_URL

	const enrollment = await db.enrollment.findFirst({
		where: { id: enrollmentId, userId: pengguna.id },
		include: { payment: true },
	})
	if (!enrollment || !enrollment.payment) {
		throw new KesalahanDomain(
			"TIDAK_DITEMUKAN",
			"Pendaftaran tidak ditemukan pada akun Anda.",
		)
	}
	if (enrollment.payment.status !== "PENDING") {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Pembayaran ini tidak lagi menunggu penyelesaian.",
		)
	}

	const urlKembali = new URL("/user/pembayaran", appUrl)
	urlKembali.searchParams.set("order_id", enrollment.payment.pakasirRef)

	return {
		urlPembayaran: pakasir.buatUrlPembayaran({
			orderId: enrollment.payment.pakasirRef,
			nominal: enrollment.payment.nominal.toString(),
			urlKembali: urlKembali.toString(),
		}),
	}
}
