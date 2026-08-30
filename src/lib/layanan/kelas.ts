import { Prisma } from "@prisma/client"

import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibKemampuan, type SesiPengguna } from "@/lib/rbac"
import { detailZod, skemaKelas } from "@/lib/validasi"
import { statusPendaftaranMemakaiKuota } from "@/lib/layanan/status"

export type DependensiKelas = { db?: KlienDb }

/** Katalog publik: hanya kelas aktif dan data yang boleh dilihat umum. */
export async function daftarKelasPublik(dependensi: DependensiKelas = {}) {
	const db = dependensi.db ?? prisma
	return db.courseClass.findMany({
		where: { aktif: true },
		orderBy: { jadwalMulai: "asc" },
		select: {
			id: true,
			judul: true,
			slug: true,
			deskripsi: true,
			harga: true,
			kuota: true,
			jadwalMulai: true,
			jadwalSelesai: true,
			lokasi: true,
			gambarUrl: true,
			_count: {
				select: {
					enrollments: {
						where: { status: { in: statusPendaftaranMemakaiKuota } },
					},
				},
			},
		},
	})
}

export async function ambilKelasPublik(
	slug: string,
	dependensi: DependensiKelas = {},
) {
	const db = dependensi.db ?? prisma
	const kelas = await db.courseClass.findFirst({
		where: { slug, aktif: true },
		select: {
			id: true,
			judul: true,
			slug: true,
			deskripsi: true,
			harga: true,
			kuota: true,
			jadwalMulai: true,
			jadwalSelesai: true,
			lokasi: true,
			gambarUrl: true,
			_count: {
				select: {
					enrollments: {
						where: { status: { in: statusPendaftaranMemakaiKuota } },
					},
				},
			},
		},
	})
	if (!kelas) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Kelas tidak ditemukan.")
	}
	return kelas
}

/** Daftar kelas untuk operasi admin (termasuk kelas nonaktif). */
export async function daftarKelasOperasional(
	sesi: SesiPengguna | null,
	dependensi: DependensiKelas = {},
) {
	wajibKemampuan(sesi, "kelola_kelas")
	const db = dependensi.db ?? prisma
	return db.courseClass.findMany({
		orderBy: [{ aktif: "desc" }, { jadwalMulai: "asc" }],
		include: {
			_count: {
				select: {
					enrollments: {
						where: { status: { in: statusPendaftaranMemakaiKuota } },
					},
				},
			},
		},
	})
}

export async function buatKelas(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiKelas = {},
) {
	wajibKemampuan(sesi, "kelola_kelas")
	const db = dependensi.db ?? prisma

	const hasil = skemaKelas.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data kelas belum lengkap atau tidak valid.",
			detailZod(hasil.error),
		)
	}

	try {
		return await db.courseClass.create({
			data: {
				judul: hasil.data.judul,
				slug: hasil.data.slug,
				deskripsi: hasil.data.deskripsi,
				harga: new Prisma.Decimal(hasil.data.harga),
				kuota: hasil.data.kuota,
				jadwalMulai: hasil.data.jadwalMulai,
				jadwalSelesai: hasil.data.jadwalSelesai ?? null,
				lokasi: hasil.data.lokasi,
				gambarUrl: hasil.data.gambarUrl ?? null,
				aktif: hasil.data.aktif,
			},
		})
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2002"
		) {
			throw new KesalahanDomain(
				"KONFLIK",
				"Slug kelas sudah dipakai. Gunakan slug lain.",
				{ slug: "Slug sudah dipakai" },
			)
		}
		throw kesalahan
	}
}

export async function perbaruiKelas(
	sesi: SesiPengguna | null,
	classId: string,
	masukan: unknown,
	dependensi: DependensiKelas = {},
) {
	wajibKemampuan(sesi, "kelola_kelas")
	const db = dependensi.db ?? prisma

	const hasil = skemaKelas.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data kelas belum lengkap atau tidak valid.",
			detailZod(hasil.error),
		)
	}

	const kelas = await db.courseClass.findUnique({ where: { id: classId } })
	if (!kelas) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Kelas tidak ditemukan.")
	}

	const terpakai = await db.enrollment.count({
		where: { classId, status: { in: statusPendaftaranMemakaiKuota } },
	})
	if (hasil.data.kuota < terpakai) {
		throw new KesalahanDomain(
			"KONFLIK",
			`Kuota tidak boleh lebih kecil dari jumlah pendaftar aktif (${terpakai} peserta).`,
			{ kuota: "Kuota lebih kecil dari pendaftar aktif" },
		)
	}

	try {
		return await db.courseClass.update({
			where: { id: classId },
			data: {
				judul: hasil.data.judul,
				slug: hasil.data.slug,
				deskripsi: hasil.data.deskripsi,
				harga: new Prisma.Decimal(hasil.data.harga),
				kuota: hasil.data.kuota,
				jadwalMulai: hasil.data.jadwalMulai,
				jadwalSelesai: hasil.data.jadwalSelesai ?? null,
				lokasi: hasil.data.lokasi,
				gambarUrl: hasil.data.gambarUrl ?? null,
				aktif: hasil.data.aktif,
			},
		})
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2002"
		) {
			throw new KesalahanDomain(
				"KONFLIK",
				"Slug kelas sudah dipakai. Gunakan slug lain.",
				{ slug: "Slug sudah dipakai" },
			)
		}
		throw kesalahan
	}
}

/**
 * Kelas tidak dihapus, hanya dinonaktifkan atau diaktifkan kembali
 * (lihat kebijakan audit dan penghapusan).
 */
export async function ubahStatusAktifKelas(
	sesi: SesiPengguna | null,
	classId: string,
	aktif: boolean,
	dependensi: DependensiKelas = {},
) {
	wajibKemampuan(sesi, "kelola_kelas")
	const db = dependensi.db ?? prisma

	const kelas = await db.courseClass.findUnique({ where: { id: classId } })
	if (!kelas) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Kelas tidak ditemukan.")
	}

	return db.courseClass.update({ where: { id: classId }, data: { aktif } })
}

/** Sisa kuota berdasarkan enrollment yang relevan. */
export function sisaKuota(kuota: number, terpakai: number): number {
	return Math.max(kuota - terpakai, 0)
}
