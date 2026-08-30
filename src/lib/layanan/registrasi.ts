import { Prisma } from "@prisma/client"

import { hashKataSandi } from "@/lib/kata-sandi"
import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { detailZod, skemaRegistrasi } from "@/lib/validasi"

export type DependensiRegistrasi = {
	db?: KlienDb
	hash?: (kataSandi: string) => Promise<string>
}

export type HasilRegistrasi = {
	id: string
	nama: string
	email: string
	peran: "USER"
}

/**
 * Registrasi publik. Peran selalu USER dan tidak pernah diterima dari input.
 * Kata sandi hanya disimpan sebagai hash dan tidak pernah dicatat ke log.
 */
export async function daftarPengguna(
	masukan: unknown,
	dependensi: DependensiRegistrasi = {},
): Promise<HasilRegistrasi> {
	const db = dependensi.db ?? prisma
	const hash = dependensi.hash ?? hashKataSandi

	const hasil = skemaRegistrasi.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data registrasi belum lengkap atau tidak valid.",
			detailZod(hasil.error),
		)
	}

	const { nama, email, telepon, kataSandi } = hasil.data
	const passwordHash = await hash(kataSandi)

	try {
		const pengguna = await db.user.create({
			data: {
				nama,
				email,
				telepon: telepon ?? null,
				passwordHash,
				peran: "USER",
				aktif: true,
			},
			select: { id: true, nama: true, email: true },
		})
		return { ...pengguna, peran: "USER" }
	} catch (kesalahan) {
		if (
			kesalahan instanceof Prisma.PrismaClientKnownRequestError &&
			kesalahan.code === "P2002"
		) {
			throw new KesalahanDomain(
				"KONFLIK",
				"Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.",
				{ email: "Email sudah terdaftar" },
			)
		}
		throw kesalahan
	}
}
