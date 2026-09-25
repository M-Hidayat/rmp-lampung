import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { FormulirMasuk } from "./formulir-masuk"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { sesiPengguna } from "@/lib/auth"
import { berandaDashboard } from "@/lib/rbac"

export const metadata: Metadata = { title: "Masuk" }

type Props = { searchParams: Promise<{ lanjut?: string }> }

export default async function HalamanMasuk({ searchParams }: Props) {
	const sesi = await sesiPengguna()
	if (sesi) redirect(berandaDashboard(sesi.peran))

	const { lanjut } = await searchParams
	const tujuan = lanjut?.startsWith("/") ? lanjut : undefined

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl">Masuk ke akun</CardTitle>
				<CardDescription>
					Gunakan email dan kata sandi akun Anda untuk mengakses dashboard.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormulirMasuk lanjut={tujuan} />
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-4">
				<Separator />
				<p className="text-center text-sm text-muted-foreground">
					Belum punya akun?{" "}
					<Link
						className="font-semibold text-accent-foreground underline underline-offset-4 hover:text-foreground"
						href="/daftar"
					>
						Daftar akun peserta
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}