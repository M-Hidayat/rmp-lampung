import { Prisma } from "@prisma/client"

import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibKemampuan, wajibSesi, type SesiPengguna } from "@/lib/rbac"
import {
	detailZod,
	skemaAbsensiManual,
	skemaBuatSesiAbsensi,
	skemaScanAbsensi,
} from "@/lib/validasi"
import {
	buatTokenAbsensi,
	hashTokenAbsensi,
} from "@/lib/layanan/token-absensi"

export const BATAS_WAKTU_SENTINEL_ABSENSI = new Date("9999-12-31T23:59:59.999Z")

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
 * Riwayat sesi apa pun mencegah kelas yang sama membuka sesi lagi.
 */
export async function buatSesiAbsensi(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiAbsensi = {},
): Promise<SesiAbsensiAktif> {
	const petugas = wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma
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

	const token = buatToken()

	const dibuat = await db.$transaction(async (tx) => {
		await tx.$queryRaw<Array<{ terkunci: number }>>`
			SELECT 1 AS terkunci
			FROM pg_advisory_xact_lock(hashtextextended(${kelas.id}, 0))
		`

		const sudahAda = await tx.attendanceSession.findFirst({
			where: { classId: kelas.id },
			select: { id: true },
		})
		if (sudahAda) {
			throw new KesalahanDomain(
				"KONFLIK",
				"Sesi absensi untuk kelas ini sudah pernah dibuat dan tidak dapat dibuat ulang.",
			)
		}

		return tx.attendanceSession.create({
			data: {
				classId: kelas.id,
				tokenHash: hashTokenAbsensi(token),
				kedaluwarsaPada: BATAS_WAKTU_SENTINEL_ABSENSI,
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
 * Mengganti token sesi secara manual. Aturan satu kehadiran per enrollment tidak
 * berubah karena kehadiran terikat enrollment, bukan token.
 */
export async function perbaruiTokenSesi(
	sesi: SesiPengguna | null,
	sessionId: string,
	dependensi: DependensiAbsensi = {},
): Promise<SesiAbsensiAktif> {
	wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma
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
	try {
		const diperbarui = await db.attendanceSession.update({
			where: { id: sessionId, aktif: true },
			data: {
				tokenHash: hashTokenAbsensi(token),
				kedaluwarsaPada: BATAS_WAKTU_SENTINEL_ABSENSI,
			},
			select: { id: true, classId: true, kedaluwarsaPada: true },
		})

		return {
			sessionId: diperbarui.id,
			classId: diperbarui.classId,
			token,
			kedaluwarsaPada: diperbarui.kedaluwarsaPada,
		}
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2025"
		) {
			throw new KesalahanDomain(
				"TRANSISI_TIDAK_SAH",
				"Sesi absensi sudah ditutup.",
			)
		}
		throw kesalahan
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
 * Pemeriksaan: sesi login, token, sesi aktif, kecocokan kelas,
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

/**
 * Mencatat kehadiran peserta secara MANUAL oleh admin/petugas.
 *
 * Dipakai ketika peserta tidak dapat memindai QR (kamera bermasalah, perangkat
 * mati, atau QR terlewat). Aturan bisnis tetap dijaga sama seperti scan QR:
 * - hanya peran dengan kemampuan `kelola_absensi` yang boleh memanggil;
 * - kelas harus sudah memiliki sesi absensi yang AKTIF (Attendance.sessionId
 *   bersifat wajib), sehingga absensi manual tidak bisa menembus aturan
 *   satu sesi permanen per kelas;
 * - pendaftaran harus berstatus PAID;
 * - satu kehadiran per pendaftaran, dijaga oleh UNIQUE(enrollmentId) dan
 *   pemeriksaan eksplisit di dalam transaksi.
 */
export async function catatKehadiranManual(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiAbsensi = {},
): Promise<HasilKehadiran> {
	wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? (() => new Date())

	const hasil = skemaAbsensiManual.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data absensi manual tidak valid.",
			detailZod(hasil.error),
		)
	}

	const waktu = sekarang()

	try {
		return await db.$transaction(async (tx) => {
			const enrollment = await tx.enrollment.findUnique({
				where: { id: hasil.data.enrollmentId },
				select: {
					id: true,
					status: true,
					classId: true,
					attendance: { select: { id: true } },
					kelas: { select: { judul: true } },
				},
			})
			if (!enrollment) {
				throw new KesalahanDomain(
					"TIDAK_DITEMUKAN",
					"Pendaftaran peserta tidak ditemukan.",
				)
			}
			if (enrollment.status !== "PAID") {
				throw new KesalahanDomain(
					"TRANSISI_TIDAK_SAH",
					"Absensi hanya dapat dicatat setelah pembayaran lunas.",
				)
			}
			if (enrollment.attendance) {
				throw new KesalahanDomain(
					"KONFLIK",
					"Peserta sudah tercatat hadir pada kelas ini.",
				)
			}

			// Absensi wajib terikat pada sesi. Tanpa sesi aktif, admin harus
			// membuka/mengganti QR pada sesi kelas tersebut lebih dulu.
			const sesiAbsensi = await tx.attendanceSession.findFirst({
				where: { classId: enrollment.classId, aktif: true },
				orderBy: { createdAt: "desc" },
				select: { id: true },
			})
			if (!sesiAbsensi) {
				throw new KesalahanDomain(
					"TRANSISI_TIDAK_SAH",
					"Kelas ini belum memiliki sesi absensi aktif. Buka sesi absensi terlebih dahulu.",
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
				classId: enrollment.classId,
				judulKelas: enrollment.kelas.judul,
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
				"Peserta sudah tercatat hadir pada kelas ini.",
			)
		}
		throw kesalahan
	}
}

/**
 * Daftar pendaftaran berstatus PAID yang belum tercatat hadir, untuk keperluan
 * absensi manual admin. Dikelompokkan per kelas agar admin dapat memilih kelas
 * lebih dahulu lalu mencentang peserta yang hadir.
 */
export async function pesertaBelumHadir(
	sesi: SesiPengguna | null,
	dependensi: DependensiAbsensi = {},
) {
	wajibKemampuan(sesi, "kelola_absensi")
	const db = dependensi.db ?? prisma

	const daftar = await db.enrollment.findMany({
		where: { status: "PAID", attendance: { is: null } },
		orderBy: [{ kelas: { judul: "asc" } }, { user: { nama: "asc" } }],
		select: {
			id: true,
			classId: true,
			user: { select: { nama: true, email: true } },
			kelas: {
				select: {
					judul: true,
					// Kelas hanya dapat diabsen manual bila punya sesi aktif.
					sesiAbsensi: {
						where: { aktif: true },
						select: { id: true },
						take: 1,
					},
				},
			},
		},
	})

	return daftar.map((item) => ({
		enrollmentId: item.id,
		classId: item.classId,
		nama: item.user.nama,
		email: item.user.email,
		judulKelas: item.kelas.judul,
		punyaSesiAktif: item.kelas.sesiAbsensi.length > 0,
	}))
}

/** Sesi absensi aktif untuk kelas-kelas yang diikuti pengguna. */
export async function sesiAbsensiUntukPengguna(
	sesi: SesiPengguna | null,
	dependensi: DependensiAbsensi = {},
) {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma

	return db.attendanceSession.findMany({
		where: {
			aktif: true,
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
		orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
