import { Prisma } from "@prisma/client"

import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibKemampuan, wajibSesi, type SesiPengguna } from "@/lib/rbac"
import {
	detailZod,
	skemaBuatSesiAbsensi,
	skemaScanAbsensi,
} from "@/lib/validasi"
import {
	buatTokenAbsensi,
	hashTokenAbsensi,
	hitungKedaluwarsa,
	hitungKedaluwarsaDetik,
	tokenMasihBerlaku,
	GRACE_PERIOD_DETIK,
} from "@/lib/layanan/token-absensi"

export type DependensiAbsensi = {
	db?: KlienDb
	sekarang?: () => Date
	buatToken?: () => string
}

export type SesiAbsensiAktif = {
	sessionId: string
	classId: string
	token: string
	kedaluwarsaPada: Date
}

/**
 * Admin membuka sesi absensi untuk satu kelas.
 * Token acak kuat dibuat di server; hanya hash-nya disimpan.
 * Sesi lain pada kelas yang sama dinonaktifkan agar hanya ada satu QR aktif.
 */
export async function buatSesiAbsensi(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiAbsensi = {},
): Promise<SesiAbsensiAktif> {
	const petugas = wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? (() => new Date())
	const buatToken = dependensi.buatToken ?? buatTokenAbsensi

	const hasil = skemaBuatSesiAbsensi.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data sesi absensi tidak valid.",
			detailZod(hasil.error),
		)
	}

	const kelas = await db.courseClass.findUnique({
		where: { id: hasil.data.classId },
		select: { id: true },
	})
	if (!kelas) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Kelas tidak ditemukan.")
	}

	const waktu = sekarang()
	const token = buatToken()

	const dibuat = await db.$transaction(async (tx) => {
		await tx.attendanceSession.updateMany({
			where: { classId: kelas.id, aktif: true },
			data: { aktif: false },
		})

		return tx.attendanceSession.create({
			data: {
				classId: kelas.id,
				tokenHash: hashTokenAbsensi(token),
				kedaluwarsaPada: hitungKedaluwarsa(
					waktu,
					hasil.data.masaBerlakuMenit,
				),
				aktif: true,
				dibuatOlehId: petugas.id,
			},
			select: { id: true, classId: true, kedaluwarsaPada: true },
		})
	})

	return {
		sessionId: dibuat.id,
		classId: dibuat.classId,
		token,
		kedaluwarsaPada: dibuat.kedaluwarsaPada,
	}
}

/**
 * Memperbarui token sesi berkala. Aturan satu kehadiran per enrollment tidak
 * berubah karena kehadiran terikat enrollment, bukan token.
 */
export async function perbaruiTokenSesi(
	sesi: SesiPengguna | null,
	sessionId: string,
	masaBerlakuMenit = 10,
	dependensi: DependensiAbsensi = {},
): Promise<SesiAbsensiAktif> {
	wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? (() => new Date())
	const buatToken = dependensi.buatToken ?? buatTokenAbsensi

	const sesiAbsensi = await db.attendanceSession.findUnique({
		where: { id: sessionId },
		select: { id: true, aktif: true, classId: true },
	})
	if (!sesiAbsensi) {
		throw new KesalahanDomain(
			"TIDAK_DITEMUKAN",
			"Sesi absensi tidak ditemukan.",
		)
	}
	if (!sesiAbsensi.aktif) {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Sesi absensi sudah ditutup.",
		)
	}

	const token = buatToken()
	const diperbarui = await db.attendanceSession.update({
		where: { id: sessionId },
		data: {
			tokenHash: hashTokenAbsensi(token),
			kedaluwarsaPada: hitungKedaluwarsa(sekarang(), masaBerlakuMenit),
		},
		select: { id: true, classId: true, kedaluwarsaPada: true },
	})

	return {
		sessionId: diperbarui.id,
		classId: diperbarui.classId,
		token,
		kedaluwarsaPada: diperbarui.kedaluwarsaPada,
	}
}

export async function tutupSesiAbsensi(
	sesi: SesiPengguna | null,
	sessionId: string,
	dependensi: DependensiAbsensi = {},
) {
	wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma
	return db.attendanceSession.update({
		where: { id: sessionId },
		data: { aktif: false },
		select: { id: true, aktif: true },
	})
}

export type HasilKehadiran = {
	attendanceId: string
	classId: string
	judulKelas: string
	waktuScan: Date
}

/**
 * Mencatat kehadiran peserta dari hasil scan QR.
 * Pemeriksaan: sesi login, token dan kedaluwarsa, sesi aktif, kecocokan kelas,
 * kepemilikan enrollment, status PAID, serta ketiadaan attendance sebelumnya.
 * Constraint UNIQUE(enrollmentId) menjamin tidak ada absensi ganda.
 */
export async function catatKehadiran(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiAbsensi = {},
): Promise<HasilKehadiran> {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? (() => new Date())

	const hasil = skemaScanAbsensi.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Token absensi tidak valid.",
			detailZod(hasil.error),
		)
	}

	const waktu = sekarang()
	const tokenHash = hashTokenAbsensi(hasil.data.token)

	try {
		return await db.$transaction(async (tx) => {
			const sesiAbsensi = await tx.attendanceSession.findUnique({
				where: { tokenHash },
				select: {
					id: true,
					classId: true,
					aktif: true,
					kedaluwarsaPada: true,
					kelas: { select: { judul: true } },
				},
			})
			if (!sesiAbsensi) {
				throw new KesalahanDomain(
					"TIDAK_DITEMUKAN",
					"QR absensi tidak dikenali. Silakan pindai QR terbaru dari admin.",
				)
			}
			if (!sesiAbsensi.aktif) {
				throw new KesalahanDomain(
					"TRANSISI_TIDAK_SAH",
					"Sesi absensi sudah ditutup.",
				)
			}
			if (!tokenMasihBerlaku(sesiAbsensi.kedaluwarsaPada, waktu, GRACE_PERIOD_DETIK)) {
				throw new KesalahanDomain(
					"TRANSISI_TIDAK_SAH",
					"QR absensi sudah kedaluwarsa. Silakan pindai QR terbaru.",
				)
			}

			const enrollment = await tx.enrollment.findUnique({
				where: {
					userId_classId: {
						userId: pengguna.id,
						classId: sesiAbsensi.classId,
					},
				},
				select: {
					id: true,
					status: true,
					attendance: { select: { id: true } },
				},
			})
			if (!enrollment) {
				throw new KesalahanDomain(
					"TIDAK_BERWENANG",
					"Anda tidak terdaftar pada kelas yang sesuai dengan QR ini.",
				)
			}
			if (enrollment.status !== "PAID") {
				throw new KesalahanDomain(
					"TRANSISI_TIDAK_SAH",
					"Absensi hanya dapat dilakukan setelah pembayaran lunas.",
				)
			}
			if (enrollment.attendance) {
				throw new KesalahanDomain(
					"KONFLIK",
					"Anda sudah tercatat hadir pada kelas ini.",
				)
			}

			const attendance = await tx.attendance.create({
				data: {
					enrollmentId: enrollment.id,
					sessionId: sesiAbsensi.id,
					waktuScan: waktu,
				},
				select: { id: true, waktuScan: true },
			})

			return {
				attendanceId: attendance.id,
				classId: sesiAbsensi.classId,
				judulKelas: sesiAbsensi.kelas.judul,
				waktuScan: attendance.waktuScan,
			}
		})
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2002"
		) {
			// Dua permintaan bersamaan: constraint UNIQUE(enrollmentId) menang.
			throw new KesalahanDomain(
				"KONFLIK",
				"Anda sudah tercatat hadir pada kelas ini.",
			)
		}
		throw kesalahan
	}
}

/** Sesi absensi aktif untuk kelas-kelas yang diikuti pengguna. */
export async function sesiAbsensiUntukPengguna(
	sesi: SesiPengguna | null,
	dependensi: DependensiAbsensi = {},
) {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma
	const sekarang = (dependensi.sekarang ?? (() => new Date()))()

	return db.attendanceSession.findMany({
		where: {
			aktif: true,
			kedaluwarsaPada: { gt: sekarang },
			kelas: {
				enrollments: {
					some: {
						userId: pengguna.id,
						status: "PAID",
						attendance: { is: null },
					},
				},
			},
		},
		select: {
			id: true,
			kedaluwarsaPada: true,
			kelas: { select: { id: true, judul: true } },
		},
	})
}

/** Rekap kehadiran untuk operasi admin. */
export async function rekapKehadiran(
	sesi: SesiPengguna | null,
	classId?: string,
	dependensi: DependensiAbsensi = {},
) {
	wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma

	return db.attendance.findMany({
		where: classId ? { enrollment: { classId } } : undefined,
		orderBy: { waktuScan: "desc" },
		take: 200,
		select: {
			id: true,
			waktuScan: true,
			certificate: { select: { id: true, nomor: true, revokedAt: true } },
			enrollment: {
				select: {
					id: true,
					user: { select: { nama: true, email: true } },
					kelas: { select: { id: true, judul: true } },
				},
			},
		},
	})
}

/** Sesi absensi untuk panel admin. */
export async function daftarSesiAbsensi(
	sesi: SesiPengguna | null,
	dependensi: DependensiAbsensi = {},
) {
	wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma

	return db.attendanceSession.findMany({
		orderBy: { createdAt: "desc" },
		take: 50,
		select: {
			id: true,
			aktif: true,
			kedaluwarsaPada: true,
			createdAt: true,
			kelas: { select: { id: true, judul: true } },
			_count: { select: { attendances: true } },
		},
	})
}
