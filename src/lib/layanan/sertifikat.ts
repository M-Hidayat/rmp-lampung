import { Prisma } from "@prisma/client"

import { KesalahanDomain } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import {
	wajibKemampuan,
	wajibPemilikDokumenAtauOperasional,
	wajibSesi,
	type SesiPengguna,
} from "@/lib/rbac"
import { bentukNomorSertifikat } from "@/lib/layanan/nomor-dokumen"

export type DependensiSertifikat = {
	db?: KlienDb
	sekarang?: () => Date
	nomorSertifikat?: (tanggal: Date) => string
}

/**
 * Menerbitkan sertifikat.
 * Prasyarat: enrollment berstatus PAID dan memiliki attendance.
 * Idempoten melalui constraint unik attendanceId.
 */
export async function terbitkanSertifikat(
	sesi: SesiPengguna | null,
	attendanceId: string,
	dependensi: DependensiSertifikat = {},
) {
	wajibKemampuan(sesi, "kelola_sertifikat")
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? (() => new Date())
	const nomorSertifikat = dependensi.nomorSertifikat ?? bentukNomorSertifikat

	const attendance = await db.attendance.findUnique({
		where: { id: attendanceId },
		select: {
			id: true,
			certificate: { select: { id: true, nomor: true } },
			enrollment: { select: { id: true, status: true } },
		},
	})
	if (!attendance) {
		throw new KesalahanDomain(
			"TIDAK_DITEMUKAN",
			"Data kehadiran tidak ditemukan.",
		)
	}
	if (attendance.enrollment.status !== "PAID") {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Sertifikat hanya dapat diterbitkan untuk pendaftaran yang lunas.",
		)
	}
	if (attendance.certificate) {
		return attendance.certificate
	}

	try {
		return await db.certificate.create({
			data: {
				attendanceId: attendance.id,
				nomor: nomorSertifikat(sekarang()),
				diterbitkanPada: sekarang(),
			},
			select: { id: true, nomor: true },
		})
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2002"
		) {
			const adaSebelumnya = await db.certificate.findUnique({
				where: { attendanceId: attendance.id },
				select: { id: true, nomor: true },
			})
			if (adaSebelumnya) return adaSebelumnya
		}
		throw kesalahan
	}
}

/** Sertifikat dibatalkan (revokedAt), tidak dihapus. */
export async function batalkanSertifikat(
	sesi: SesiPengguna | null,
	certificateId: string,
	dependensi: DependensiSertifikat = {},
) {
	wajibKemampuan(sesi, "kelola_sertifikat")
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? (() => new Date())

	const sertifikat = await db.certificate.findUnique({
		where: { id: certificateId },
		select: { id: true, revokedAt: true },
	})
	if (!sertifikat) {
		throw new KesalahanDomain(
			"TIDAK_DITEMUKAN",
			"Sertifikat tidak ditemukan.",
		)
	}
	if (sertifikat.revokedAt) {
		return sertifikat
	}

	return db.certificate.update({
		where: { id: certificateId },
		data: { revokedAt: sekarang() },
		select: { id: true, revokedAt: true },
	})
}

/** Mengaktifkan kembali sertifikat yang dibatalkan (jejak audit tetap ada). */
export async function pulihkanSertifikat(
	sesi: SesiPengguna | null,
	certificateId: string,
	dependensi: DependensiSertifikat = {},
) {
	wajibKemampuan(sesi, "kelola_sertifikat")
	const db = dependensi.db ?? prisma

	return db.certificate.update({
		where: { id: certificateId },
		data: { revokedAt: null },
		select: { id: true, revokedAt: true },
	})
}

/** Sertifikat milik pengguna yang sedang masuk. */
export async function sertifikatSaya(
	sesi: SesiPengguna | null,
	dependensi: DependensiSertifikat = {},
) {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma

	return db.certificate.findMany({
		where: { attendance: { enrollment: { userId: pengguna.id } } },
		orderBy: { diterbitkanPada: "desc" },
		select: {
			id: true,
			nomor: true,
			diterbitkanPada: true,
			revokedAt: true,
			attendance: {
				select: {
					enrollment: { select: { kelas: { select: { judul: true } } } },
				},
			},
		},
	})
}

/** Data lengkap sertifikat untuk PDF; kepemilikan diperiksa di sini. */
export async function ambilSertifikatUntukDokumen(
	sesi: SesiPengguna | null,
	certificateId: string,
	dependensi: DependensiSertifikat = {},
) {
	const db = dependensi.db ?? prisma

	const sertifikat = await db.certificate.findUnique({
		where: { id: certificateId },
		select: {
			id: true,
			nomor: true,
			diterbitkanPada: true,
			revokedAt: true,
			attendance: {
				select: {
					waktuScan: true,
					enrollment: {
						select: {
							userId: true,
							user: { select: { nama: true } },
							kelas: {
								select: { judul: true, lokasi: true, jadwalMulai: true },
							},
						},
					},
				},
			},
		},
	})
	if (!sertifikat) {
		throw new KesalahanDomain(
			"TIDAK_DITEMUKAN",
			"Sertifikat tidak ditemukan.",
		)
	}

	wajibPemilikDokumenAtauOperasional(
		sesi,
		sertifikat.attendance.enrollment.userId,
	)

	if (sertifikat.revokedAt) {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Sertifikat ini telah dibatalkan sehingga tidak dapat diunduh.",
		)
	}

	return sertifikat
}

export type HasilVerifikasiPublik =
	| { ditemukan: false }
	| {
			ditemukan: true
			nomor: string
			namaPeserta: string
			judulKelas: string
			diterbitkanPada: Date
			status: "valid" | "dibatalkan"
	  }

/**
 * Verifikasi publik. Hanya data minimum yang dikembalikan: nomor, nama
 * peserta, kelas, tanggal terbit, dan status. Tidak ada email, telepon,
 * pembayaran, atau data transaksi.
 */
export async function verifikasiSertifikatPublik(
	nomor: string,
	dependensi: DependensiSertifikat = {},
): Promise<HasilVerifikasiPublik> {
	const db = dependensi.db ?? prisma

	const sertifikat = await db.certificate.findUnique({
		where: { nomor: nomor.trim() },
		select: {
			nomor: true,
			diterbitkanPada: true,
			revokedAt: true,
			attendance: {
				select: {
					enrollment: {
						select: {
							user: { select: { nama: true } },
							kelas: { select: { judul: true } },
						},
					},
				},
			},
		},
	})
	if (!sertifikat) return { ditemukan: false }

	return {
		ditemukan: true,
		nomor: sertifikat.nomor,
		namaPeserta: sertifikat.attendance.enrollment.user.nama,
		judulKelas: sertifikat.attendance.enrollment.kelas.judul,
		diterbitkanPada: sertifikat.diterbitkanPada,
		status: sertifikat.revokedAt ? "dibatalkan" : "valid",
	}
}

/** Audit sertifikat untuk pemilik. */
export async function auditSertifikat(
	sesi: SesiPengguna | null,
	dependensi: DependensiSertifikat = {},
) {
	wajibKemampuan(sesi, "audit_sertifikat")
	const db = dependensi.db ?? prisma

	return db.certificate.findMany({
		orderBy: { diterbitkanPada: "desc" },
		take: 200,
		select: {
			id: true,
			nomor: true,
			diterbitkanPada: true,
			revokedAt: true,
			updatedAt: true,
			attendance: {
				select: {
					waktuScan: true,
					enrollment: {
						select: {
							user: { select: { nama: true, email: true } },
							kelas: { select: { judul: true } },
						},
					},
				},
			},
		},
	})
}

/** Daftar sertifikat untuk operasi admin. */
export async function daftarSertifikatOperasional(
	sesi: SesiPengguna | null,
	dependensi: DependensiSertifikat = {},
) {
	wajibKemampuan(sesi, "kelola_sertifikat")
	const db = dependensi.db ?? prisma

	return db.certificate.findMany({
		orderBy: { diterbitkanPada: "desc" },
		take: 200,
		select: {
			id: true,
			nomor: true,
			diterbitkanPada: true,
			revokedAt: true,
			attendance: {
				select: {
					id: true,
					enrollment: {
						select: {
							user: { select: { nama: true, email: true } },
							kelas: { select: { judul: true } },
						},
					},
				},
			},
		},
	})
}

/** Kehadiran yang belum memiliki sertifikat (kandidat penerbitan). */
export async function kandidatSertifikat(
	sesi: SesiPengguna | null,
	dependensi: DependensiSertifikat = {},
) {
	wajibKemampuan(sesi, "kelola_sertifikat")
	const db = dependensi.db ?? prisma

	return db.attendance.findMany({
		where: {
			certificate: { is: null },
			enrollment: { status: "PAID" },
		},
		orderBy: { waktuScan: "desc" },
		take: 200,
		select: {
			id: true,
			waktuScan: true,
			enrollment: {
				select: {
					user: { select: { nama: true, email: true } },
					kelas: { select: { judul: true } },
				},
			},
		},
	})
}
