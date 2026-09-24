import { z } from "zod"

import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { bandingkanKataSandi, hashKataSandi } from "@/lib/kata-sandi"
import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibSesi, type SesiPengguna } from "@/lib/rbac"
import {
	detailZod,
	skemaKataSandi,
	skemaNama,
} from "@/lib/validasi"

export type DependensiProfil = { db?: KlienDb }

/** Nama dan telepon dapat diubah sendiri oleh pemilik akun (USER maupun ADMIN). */
export const skemaPerbaruiProfil = z.object({
	nama: skemaNama,
	telepon: z
		.string()
		.trim()
		.max(30, "Nomor telepon maksimal 30 karakter")
		.optional()
		.or(z.literal("")),
})

export type DataProfil = {
	id: string
	nama: string
	email: string
	telepon: string | null
	peran: string
	dibuatPada: Date
}

/** Membaca profil pengguna yang sedang masuk, apa pun perannya. */
export async function profilSaya(
	sesi: SesiPengguna | null,
	dependensi: DependensiProfil = {},
): Promise<DataProfil> {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma

	const data = await db.user.findUnique({
		where: { id: pengguna.id },
		select: {
			id: true,
			nama: true,
			email: true,
			telepon: true,
			peran: true,
			createdAt: true,
		},
	})
	if (!data) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Akun tidak ditemukan.")
	}

	return {
		id: data.id,
		nama: data.nama,
		email: data.email,
		telepon: data.telepon,
		peran: data.peran,
		dibuatPada: data.createdAt,
	}
}

/** Memperbarui nama dan telepon milik pengguna yang sedang masuk. */
export async function perbaruiProfilSaya(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiProfil = {},
) {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma

	const hasil = skemaPerbaruiProfil.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi("Data profil tidak valid.", detailZod(hasil.error))
	}

	const telepon = hasil.data.telepon?.trim() ? hasil.data.telepon.trim() : null

	const diperbarui = await db.user.update({
		where: { id: pengguna.id },
		data: { nama: hasil.data.nama, telepon },
		select: { id: true, nama: true, telepon: true },
	})

	return diperbarui
}

export const skemaGantiKataSandi = z.object({
	kataSandiLama: z.string().min(1, "Kata sandi saat ini wajib diisi"),
	kataSandiBaru: skemaKataSandi,
})

/**
 * Mengganti kata sandi milik pengguna yang sedang masuk.
 * Kata sandi lama wajib benar, sehingga sesi yang dibajak tidak dapat langsung
 * mengunci pemilik akun.
 */
export async function gantiKataSandiSaya(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiProfil = {},
) {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma

	const hasil = skemaGantiKataSandi.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data kata sandi tidak valid.",
			detailZod(hasil.error),
		)
	}

	const akun = await db.user.findUnique({
		where: { id: pengguna.id },
		select: { id: true, passwordHash: true },
	})
	if (!akun) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Akun tidak ditemukan.")
	}

	const cocok = await bandingkanKataSandi(
		hasil.data.kataSandiLama,
		akun.passwordHash,
	)
	if (!cocok) {
		throw new KesalahanDomain(
			"TIDAK_BERWENANG",
			"Kata sandi saat ini tidak sesuai.",
		)
	}

	if (hasil.data.kataSandiLama === hasil.data.kataSandiBaru) {
		throw new KesalahanDomain(
			"VALIDASI",
			"Kata sandi baru harus berbeda dari kata sandi saat ini.",
		)
	}

	await db.user.update({
		where: { id: pengguna.id },
		data: { passwordHash: await hashKataSandi(hasil.data.kataSandiBaru) },
		select: { id: true },
	})

	return { id: pengguna.id }
}
