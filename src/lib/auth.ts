// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { skemaMasuk } from "@/lib/validasi"
import type { Peran, SesiPengguna } from "@/lib/rbac"
import { bandingkanKataSandi } from "@/lib/kata-sandi"

/**
 * Auth.js dengan provider credentials dan sesi JWT.
 * Kata sandi tidak pernah dicatat ke log dan tidak pernah dikembalikan.
 */
export const konfigurasiAuth: NextAuthConfig = {
	secret: process.env.AUTH_SECRET,
	session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
	pages: {
		signIn: "/masuk",
		error: "/masuk",
	},
	trustHost: true,
	providers: [
		Credentials({
			name: "Kredensial",
			credentials: {
				email: { label: "Email", type: "email" },
				kataSandi: { label: "Kata sandi", type: "password" },
			},
			authorize: async (kredensial) => {
				const hasil = skemaMasuk.safeParse(kredensial)
				if (!hasil.success) return null

				const pengguna = await prisma.user.findUnique({
					where: { email: hasil.data.email },
					select: {
						id: true,
						nama: true,
						email: true,
						peran: true,
						aktif: true,
						passwordHash: true,
					},
				})
				if (!pengguna || !pengguna.aktif) return null

				const cocok = await bandingkanKataSandi(
					hasil.data.kataSandi,
					pengguna.passwordHash,
				)
				if (!cocok) return null

				return {
					id: pengguna.id,
					name: pengguna.nama,
					email: pengguna.email,
					peran: pengguna.peran,
				}
			},
		}),
	],
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.sub = user.id
				token.peran = (user as { peran?: Peran }).peran ?? "USER"
				token.name = user.name
				token.email = user.email
			}
			return token
		},
		session: ({ session, token }) => {
			if (session.user) {
				session.user.id = String(token.sub)
				session.user.peran = (token.peran as Peran) ?? "USER"
			}
			return session
		},
	},
}

export const { handlers, auth, signIn, signOut } = NextAuth(konfigurasiAuth)

/** Sesi pengguna dalam bentuk yang dipakai layanan domain dan RBAC. */
export async function sesiPengguna(): Promise<SesiPengguna | null> {
	const sesi = await auth()
	if (!sesi?.user?.id || !sesi.user.email) return null
	return {
		id: sesi.user.id,
		nama: sesi.user.name ?? "",
		email: sesi.user.email,
		peran: sesi.user.peran ?? "USER",
	}
}

export { hashKataSandi, bandingkanKataSandi } from "@/lib/kata-sandi"
