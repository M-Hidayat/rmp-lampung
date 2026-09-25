"use server"

import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"

import { signIn } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import { daftarPengguna } from "@/lib/layanan/registrasi"
import {
	mintaAturUlangSandi,
	pakaiTokenAturUlang,
} from "@/lib/layanan/atur-ulang-sandi"
import { berandaDashboard } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

export type StatusFormulir =
	| { pesan?: string; detail?: Record<string, string> }
	| undefined

/** Status formulir lupa kata sandi. */
export type StatusLupaSandi =
	| { pesan?: string; terkirim?: boolean; emailDimatikan?: boolean }
	| undefined

/** Status formulir atur ulang kata sandi. */
export type StatusAturUlang = {
	pesan?: string
	berhasil?: boolean
	detail?: Record<string, string>
}

/** Server action masuk. Pesan kesalahan tidak membocorkan detail internal. */
export async function aksiMasuk(
	_status: StatusFormulir,
	formData: FormData,
): Promise<StatusFormulir> {
	const email = String(formData.get("email") ?? "")
	const kataSandi = String(formData.get("kataSandi") ?? "")
	const lanjut = String(formData.get("lanjut") ?? "")

	try {
		let tujuan = lanjut
		if (!tujuan.startsWith("/")) {
			const pengguna = await prisma.user.findUnique({
				where: { email: email.trim().toLowerCase() },
				select: { peran: true },
			})
			tujuan = berandaDashboard(pengguna?.peran ?? "USER")
		}

		await signIn("credentials", { email, kataSandi, redirectTo: tujuan })
		return undefined
	} catch (kesalahan) {
		// Redirect Next.js dilempar sebagai error khusus dan harus diteruskan.
		if (isRedirectError(kesalahan)) throw kesalahan
		if (kesalahan instanceof AuthError) {
			return { pesan: "Email atau kata sandi tidak sesuai." }
		}
		console.error("[aksi-masuk]", kesalahan)
		return { pesan: "Terjadi kesalahan pada server. Silakan coba lagi." }
	}
}

/** Server action registrasi peserta. Peran selalu USER (ditetapkan server). */
export async function aksiDaftar(
	_status: StatusFormulir,
	formData: FormData,
): Promise<StatusFormulir> {
	const masukan = {
		nama: String(formData.get("nama") ?? ""),
		email: String(formData.get("email") ?? ""),
		telepon: String(formData.get("telepon") ?? ""),
		kataSandi: String(formData.get("kataSandi") ?? ""),
	}

	try {
		await daftarPengguna(masukan)
	} catch (kesalahan) {
		if (kesalahan instanceof KesalahanDomain) {
			return { pesan: kesalahan.message, detail: kesalahan.detail }
		}
		console.error("[aksi-daftar]", kesalahan)
		return { pesan: "Terjadi kesalahan pada server. Silakan coba lagi." }
	}

	try {
		await signIn("credentials", {
			email: masukan.email,
			kataSandi: masukan.kataSandi,
			redirectTo: "/user",
		})
		return undefined
	} catch (kesalahan) {
		if (isRedirectError(kesalahan)) throw kesalahan
		return {
			pesan:
				"Akun berhasil dibuat, namun proses masuk otomatis gagal. Silakan masuk secara manual.",
		}
	}
}

/**
 * Permintaan tautan atur ulang kata sandi.
 *
 * Jawaban tidak bergantung pada ada/tidaknya akun, supaya formulir ini tidak
 * bisa dipakai menebak email mana yang terdaftar.
 */
export async function aksiMintaAturUlang(
	_status: StatusLupaSandi,
	formData: FormData,
): Promise<StatusLupaSandi> {
	const email = String(formData.get("email") ?? "")

	try {
		const hasil = await mintaAturUlangSandi(email)
		return {
			terkirim: true,
			// Diberitahukan bila email benar-benar tidak terkirim, supaya admin
			// tahu SMTP belum siap alih-alih menunggu email yang tak kunjung datang.
			emailDimatikan: !hasil.emailTerkirim,
		}
	} catch (kesalahan) {
		console.error("[aksi-lupa-sandi]", kesalahan)
		return { pesan: "Terjadi kesalahan pada server. Silakan coba lagi." }
	}
}

/** Menyimpan kata sandi baru berdasarkan token dari tautan email. */
export async function aksiSimpanKataSandiBaru(
	_status: StatusAturUlang,
	formData: FormData,
): Promise<StatusAturUlang> {
	const masukan = {
		token: String(formData.get("token") ?? ""),
		kataSandi: String(formData.get("kataSandi") ?? ""),
		kataSandiUlang: String(formData.get("kataSandiUlang") ?? ""),
	}

	try {
		await pakaiTokenAturUlang(masukan)
	} catch (kesalahan) {
		if (kesalahan instanceof KesalahanDomain) {
			return { pesan: kesalahan.message, detail: kesalahan.detail }
		}
		console.error("[aksi-atur-ulang-sandi]", kesalahan)
		return { pesan: "Terjadi kesalahan pada server. Silakan coba lagi." }
	}

	// Token sudah terpakai; arahkan ke halaman masuk dengan penanda sukses.
	redirect("/masuk?atur-ulang=berhasil")
}
