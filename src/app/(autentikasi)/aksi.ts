"use server"

import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import { signIn } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import { daftarPengguna } from "@/lib/layanan/registrasi"
import { berandaDashboard } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

export type StatusFormulir =
	| { pesan?: string; detail?: Record<string, string> }
	| undefined

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
