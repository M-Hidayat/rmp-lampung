import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { FormulirLupaSandi } from "./formulir-lupa-sandi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { sesiPengguna } from "@/lib/auth"
import { identitasRmp } from "@/lib/identitas-rmp"
import { berandaDashboard } from "@/lib/rbac"

export const metadata: Metadata = { title: "Lupa kata sandi" }

export default async function HalamanLupaSandi() {
	// Pengguna yang sudah masuk tidak perlu alur ini.
	const sesi = await sesiPengguna()
	if (sesi) redirect(berandaDashboard(sesi.peran))

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl">Lupa kata sandi</CardTitle>
				<CardDescription>
					Masukkan email akun Anda, lalu kami kirimkan tautan untuk membuat kata sandi
					baru.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormulirLupaSandi />
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-4">
				<Separator />
				<p className="text-center text-sm text-muted-foreground">
					Masih terkendala?{" "}
					<a
						className="font-semibold text-accent-foreground underline underline-offset-4 hover:text-foreground"
						href={identitasRmp.whatsapp.nilai}
						target="_blank"
						rel="noreferrer noopener"
					>
						Hubungi admin via WhatsApp
					</a>
				</p>
				<p className="text-center text-sm text-muted-foreground">
					Ingat kata sandi Anda?{" "}
					<Link
						className="font-semibold text-accent-foreground underline underline-offset-4 hover:text-foreground"
						href="/masuk"
					>
						Kembali ke halaman masuk
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}