import { Prisma } from "@prisma/client"

import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibKemampuan, type SesiPengguna } from "@/lib/rbac"
import { detailZod, skemaWebhookPakasir } from "@/lib/validasi"
import {
	adapterPakasir,
	bersihkanPayload,
	petakanStatusPakasir,
	type AdapterPakasir,
} from "@/lib/integrasi/pakasir"
import { nominalSama } from "@/lib/uang"
import { bentukNomorInvoice } from "@/lib/layanan/nomor-dokumen"
import {
	statusPendaftaranDariPembayaran,
	transisiPembayaranSah,
	type StatusPembayaran,
} from "@/lib/layanan/status"

export type DependensiPembayaran = {
	db?: KlienDb
	pakasir?: AdapterPakasir
	sekarang?: () => Date
	nomorInvoice?: (tanggal: Date) => string
}

export type HasilWebhook = {
	diterima: true
	tindakan:
		| "pembayaran_dilunasi"
		| "status_diperbarui"
		| "idempoten_dilewati"
	status: StatusPembayaran
	paymentId: string
	invoiceId?: string
}

/**
 * Memproses webhook Pakasir.
 *
 * Urutan pemeriksaan mengikuti desain:
 * 1) verifikasi autentikasi webhook, 2) cari payment berdasarkan pakasirRef,
 * 3) cocokkan nominal, 4) petakan status eksternal secara eksplisit,
 * 5) jalankan perubahan dalam transaksi, 6) PAID hanya pada status sah,
 * 7) buat invoice secara idempoten memakai constraint unik.
 */
export async function prosesWebhookPakasir(
	masukan: { headers: Headers; body: unknown },
	dependensi: DependensiPembayaran = {},
): Promise<HasilWebhook> {
	const db = dependensi.db ?? prisma
	const pakasir = dependensi.pakasir ?? adapterPakasir()
	const sekarang = dependensi.sekarang ?? (() => new Date())
	const nomorInvoice = dependensi.nomorInvoice ?? bentukNomorInvoice

	const parsed = skemaWebhookPakasir.safeParse(masukan.body)
	if (!parsed.success) {
		throw kesalahanValidasi(
			"Payload webhook tidak valid.",
			detailZod(parsed.error),
		)
	}
	const payload = parsed.data

	// 1) Verifikasi autentikasi webhook sesuai kontrak adapter.
	const verifikasi = pakasir.verifikasiWebhook({
		headers: masukan.headers,
		body: { project: payload.project },
	})
	if (!verifikasi.valid) {
		throw new KesalahanDomain("TIDAK_BERWENANG", "Webhook tidak sah.", {
			alasan: verifikasi.alasan,
		})
	}

	// 2) Payment dicari berdasarkan referensi Pakasir yang unik.
	const payment = await db.payment.findUnique({
		where: { pakasirRef: payload.order_id },
		select: {
			id: true,
			status: true,
			nominal: true,
			enrollmentId: true,
			invoice: { select: { id: true } },
		},
	})
	if (!payment) {
		throw new KesalahanDomain(
			"TIDAK_DITEMUKAN",
			"Referensi pembayaran tidak dikenali.",
		)
	}

	// 3) Nominal wajib sama dengan nominal basis data.
	if (!nominalSama(payload.amount, payment.nominal.toString())) {
		throw new KesalahanDomain(
			"VALIDASI",
			"Nominal webhook tidak sesuai dengan nominal transaksi.",
		)
	}

	// 4) Pemetaan status eksternal secara eksplisit.
	let statusBaru = petakanStatusPakasir(payload.status)
	if (!statusBaru) {
		throw new KesalahanDomain(
			"VALIDASI",
			"Status pembayaran dari Pakasir tidak dikenali.",
		)
	}

	// Konfirmasi tambahan ke Pakasir pada mode produksi (dilewati jika mode sandbox atau payload is_sandbox).
	const isSandbox = Boolean((payload as Record<string, unknown>).is_sandbox)
	if (statusBaru === "PAID" && pakasir.mode === "produksi" && !isSandbox) {
		const konfirmasi = await pakasir.cekStatusTransaksi({
			orderId: payload.order_id,
			nominal: payment.nominal.toString(),
		})
		const statusKonfirmasi = konfirmasi.ditemukan
			? petakanStatusPakasir(konfirmasi.statusMentah)
			: null
		if (statusKonfirmasi !== "PAID") {
			throw new KesalahanDomain(
				"VALIDASI",
				"Status pembayaran tidak dapat dikonfirmasi ke penyedia pembayaran.",
			)
		}
		statusBaru = "PAID"
	}

	// Idempotensi: webhook PAID yang terkirim ulang tidak mengubah apa pun.
	if (payment.status === "PAID" && statusBaru === "PAID") {
		return {
			diterima: true,
			tindakan: "idempoten_dilewati",
			status: "PAID",
			paymentId: payment.id,
			invoiceId: payment.invoice?.id,
		}
	}

	if (!transisiPembayaranSah(payment.status, statusBaru)) {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Perubahan status pembayaran ini tidak diizinkan.",
		)
	}

	const waktu = sekarang()
	const dibayarPada = payload.completed_at
		? new Date(payload.completed_at)
		: waktu
	const payloadBersih = bersihkanPayload(
		payload as unknown as Record<string, unknown>,
	)

	// 5) Semua perubahan dijalankan dalam satu transaksi.
	const hasil = await db.$transaction(async (tx) => {
		const diperbarui = await tx.payment.update({
			where: { id: payment.id },
			data: {
				status: statusBaru,
				metode: payload.payment_method ?? null,
				dibayarPada: statusBaru === "PAID" ? dibayarPada : null,
				payloadMentah: payloadBersih as Prisma.InputJsonValue,
			},
			select: { id: true, nominal: true },
		})

		// 6) Enrollment mengikuti status pembayaran.
		await tx.enrollment.update({
			where: { id: payment.enrollmentId },
			data: { status: statusPendaftaranDariPembayaran(statusBaru) },
		})

		if (statusBaru !== "PAID") {
			return { invoiceId: undefined as string | undefined }
		}

		// 7) Invoice idempoten: satu invoice per payment (constraint unik).
		const enrollment = await tx.enrollment.findUniqueOrThrow({
			where: { id: payment.enrollmentId },
			include: {
				user: { select: { id: true, nama: true, email: true, telepon: true } },
				kelas: {
					select: {
						id: true,
						judul: true,
						slug: true,
						harga: true,
						lokasi: true,
						jadwalMulai: true,
					},
				},
			},
		})

		try {
			const invoice = await tx.invoice.create({
				data: {
					paymentId: diperbarui.id,
					nomor: nomorInvoice(dibayarPada),
					nominal: diperbarui.nominal,
					dibayarPada,
					snapshotPeserta: {
						userId: enrollment.user.id,
						nama: enrollment.user.nama,
						email: enrollment.user.email,
						telepon: enrollment.user.telepon,
					} as Prisma.InputJsonValue,
					snapshotKelas: {
						classId: enrollment.kelas.id,
						judul: enrollment.kelas.judul,
						slug: enrollment.kelas.slug,
						harga: enrollment.kelas.harga.toString(),
						lokasi: enrollment.kelas.lokasi,
						jadwalMulai: enrollment.kelas.jadwalMulai.toISOString(),
					} as Prisma.InputJsonValue,
				},
				select: { id: true },
			})
			return { invoiceId: invoice.id }
		} catch (kesalahan) {
			if (
				kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
				kesalahan.code === "P2002"
			) {
				const adaSebelumnya = await tx.invoice.findUnique({
					where: { paymentId: diperbarui.id },
					select: { id: true },
				})
				return { invoiceId: adaSebelumnya?.id }
			}
			throw kesalahan
		}
	})

	return {
		diterima: true,
		tindakan: statusBaru === "PAID" ? "pembayaran_dilunasi" : "status_diperbarui",
		status: statusBaru,
		paymentId: payment.id,
		invoiceId: hasil.invoiceId,
	}
}

/** Status pembayaran milik pengguna (dipakai halaman informasi redirect). */
export async function statusPembayaranSaya(
	sesi: SesiPengguna | null,
	orderId: string,
	dependensi: DependensiPembayaran = {},
) {
	if (!sesi) {
		throw new KesalahanDomain(
			"TIDAK_TERAUTENTIKASI",
			"Anda harus masuk terlebih dahulu untuk melanjutkan.",
		)
	}
	const db = dependensi.db ?? prisma

	return db.payment.findFirst({
		where: { pakasirRef: orderId, enrollment: { userId: sesi.id } },
		select: {
			id: true,
			status: true,
			nominal: true,
			pakasirRef: true,
			dibayarPada: true,
			invoice: { select: { id: true, nomor: true } },
			enrollment: {
				select: { id: true, kelas: { select: { judul: true } } },
			},
		},
	})
}

/** Daftar pembayaran untuk operasi admin. */
export async function daftarPembayaranOperasional(
	sesi: SesiPengguna | null,
	dependensi: DependensiPembayaran = {},
) {
	wajibKemampuan(sesi, "kelola_pembayaran")
	const db = dependensi.db ?? prisma

	return db.payment.findMany({
		orderBy: { createdAt: "desc" },
		take: 200,
		select: {
			id: true,
			pakasirRef: true,
			status: true,
			nominal: true,
			metode: true,
			dibayarPada: true,
			payloadMentah: true,
			createdAt: true,
			invoice: { select: { id: true, nomor: true } },
			enrollment: {
				select: {
					id: true,
					status: true,
					user: { select: { id: true, nama: true, email: true } },
					kelas: { select: { id: true, judul: true } },
				},
			},
		},
	})
}

/**
 * Membatalkan pendaftaran yang belum dibayar (transaksi tidak dihapus).
 * Payment menjadi FAILED dan enrollment menjadi CANCELLED.
 */
export async function batalkanPendaftaranBelumBayar(
	sesi: SesiPengguna | null,
	enrollmentId: string,
	dependensi: DependensiPembayaran = {},
) {
	wajibKemampuan(sesi, "kelola_pembayaran")
	return jalankanPembatalan(enrollmentId, undefined, dependensi)
}

/**
 * Peserta membatalkan pendaftarannya sendiri yang belum dibayar.
 * Kepemilikan difilter langsung pada kueri basis data, bukan hanya di UI.
 */
export async function batalkanPendaftaranSaya(
	sesi: SesiPengguna | null,
	enrollmentId: string,
	dependensi: DependensiPembayaran = {},
) {
	if (!sesi) {
		throw new KesalahanDomain(
			"TIDAK_TERAUTENTIKASI",
			"Anda harus masuk terlebih dahulu untuk melanjutkan.",
		)
	}
	return jalankanPembatalan(enrollmentId, sesi.id, dependensi)
}

/** Logika pembatalan bersama untuk peran operasional maupun peserta. */
async function jalankanPembatalan(
	enrollmentId: string,
	userId: string | undefined,
	dependensi: DependensiPembayaran = {},
) {
	const db = dependensi.db ?? prisma

	return db.$transaction(async (tx) => {
		const enrollment = await tx.enrollment.findFirst({
			where: userId ? { id: enrollmentId, userId } : { id: enrollmentId },
			include: { payment: { select: { id: true, status: true } } },
		})
		if (!enrollment) {
			throw new KesalahanDomain(
				"TIDAK_DITEMUKAN",
				"Pendaftaran tidak ditemukan.",
			)
		}
		if (enrollment.status === "PAID" || enrollment.payment?.status === "PAID") {
			throw new KesalahanDomain(
				"TRANSISI_TIDAK_SAH",
				"Pendaftaran yang sudah lunas tidak dapat dibatalkan.",
			)
		}

		if (enrollment.payment) {
			await tx.payment.update({
				where: { id: enrollment.payment.id },
				data: { status: "FAILED" },
			})
		}

		return tx.enrollment.update({
			where: { id: enrollmentId },
			data: { status: "CANCELLED" },
			select: { id: true, status: true },
		})
	})
}
