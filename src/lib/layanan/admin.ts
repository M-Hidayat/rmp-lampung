import { Prisma } from "@prisma/client"

import { hashKataSandi } from "@/lib/kata-sandi"
import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibKemampuan, type SesiPengguna } from "@/lib/rbac"
import { detailZod, skemaBuatAdmin } from "@/lib/validasi"

export type DependensiAdmin = {
	db?: KlienDb
	hash?: (kataSandi: string) => Promise<string>
}

/** Daftar akun admin (khusus pemilik). */
export async function daftarAdmin(
	sesi: SesiPengguna | null,
	dependensi: DependensiAdmin = {},
) {
	wajibKemampuan(sesi, "kelola_admin")
	const db = dependensi.db ?? prisma

	return db.user.findMany({
		where: { peran: { in: ["ADMIN", "PEMILIK"] } },
		orderBy: [{ peran: "asc" }, { createdAt: "asc" }],
		select: {
			id: true,
			nama: true,
			email: true,
			peran: true,
			aktif: true,
			createdAt: true,
			updatedAt: true,
		},
	})
}

/** Membuat akun admin. Peran ditetapkan server, bukan dari input. */
export async function buatAdmin(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiAdmin = {},
) {
	wajibKemampuan(sesi, "kelola_admin")
	const db = dependensi.db ?? prisma
	const hash = dependensi.hash ?? hashKataSandi

	const hasil = skemaBuatAdmin.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data akun admin belum lengkap atau tidak valid.",
			detailZod(hasil.error),
		)
	}

	try {
		return await db.user.create({
			data: {
				nama: hasil.data.nama,
				email: hasil.data.email,
				passwordHash: await hash(hasil.data.kataSandi),
				peran: "ADMIN",
				aktif: true,
			},
			select: { id: true, nama: true, email: true, peran: true, aktif: true },
		})
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2002"
		) {
			throw new KesalahanDomain(
				"KONFLIK",
				"Email ini sudah dipakai akun lain.",
				{ email: "Email sudah dipakai" },
			)
		}
		throw kesalahan
	}
}

/** Akun admin dinonaktifkan, tidak dihapus. Akun pemilik tidak dapat diubah. */
export async function ubahStatusAktifAdmin(
	sesi: SesiPengguna | null,
	userId: string,
	aktif: boolean,
	dependensi: DependensiAdmin = {},
) {
	const pemilik = wajibKemampuan(sesi, "kelola_admin")
	const db = dependensi.db ?? prisma

	if (pemilik.id === userId) {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Anda tidak dapat mengubah status akun Anda sendiri.",
		)
	}

	const target = await db.user.findUnique({
		where: { id: userId },
		select: { id: true, peran: true },
	})
	if (!target) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Akun tidak ditemukan.")
	}
	if (target.peran !== "ADMIN") {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Hanya akun admin yang dapat diaktifkan atau dinonaktifkan di sini.",
		)
	}

	return db.user.update({
		where: { id: userId },
		data: { aktif },
		select: { id: true, aktif: true },
	})
}

/** Daftar peserta untuk operasi admin. */
export async function daftarPeserta(
	sesi: SesiPengguna | null,
	dependensi: DependensiAdmin = {},
) {
	wajibKemampuan(sesi, "kelola_peserta")
	const db = dependensi.db ?? prisma

	return db.user.findMany({
		where: { peran: "USER" },
		orderBy: { createdAt: "desc" },
		take: 200,
		select: {
			id: true,
			nama: true,
			email: true,
			telepon: true,
			createdAt: true,
			enrollments: {
				select: {
					id: true,
					status: true,
					kelas: { select: { judul: true } },
					attendance: { select: { id: true } },
				},
			},
		},
	})
}
