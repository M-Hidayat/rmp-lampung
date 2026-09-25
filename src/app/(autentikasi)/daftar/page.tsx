import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { FormulirDaftar } from "./formulir-daftar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { sesiPengguna } from "@/lib/auth"
import { berandaDashboard } from "@/lib/rbac"

export const metadata: Metadata = { title: "Daftar akun" }

export default async function HalamanDaftar() {
	const sesi = await sesiPengguna()
	if (sesi) redirect(berandaDashboard(sesi.peran))

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl">Daftar akun peserta</CardTitle>
				<CardDescription>
					Akun baru selalu dibuat sebagai peserta kursus kuliner.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormulirDaftar />
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-4">
				<Separator />
				<p className="text-center text-sm text-muted-foreground">
					Sudah punya akun?{" "}
					<Link
						className="font-semibold text-accent-foreground underline underline-offset-4 hover:text-foreground"
						href="/masuk"
					>
						Masuk di sini
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}