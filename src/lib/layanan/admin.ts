import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibKemampuan, type SesiPengguna } from "@/lib/rbac"

export type DependensiAdmin = { db?: KlienDb }

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
