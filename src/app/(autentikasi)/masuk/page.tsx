import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { FormulirMasuk } from "./formulir-masuk"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
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
		<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
			<CardHeader className="space-y-1">
				<CardTitle className="text-xl font-bold text-zinc-950 font-heading">Masuk ke akun</CardTitle>
				<CardDescription className="text-xs text-zinc-500">
					Gunakan email dan kata sandi akun Anda untuk mengakses dashboard.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormulirMasuk lanjut={tujuan} />
			</CardContent>
			<CardFooter className="border-t border-[#F5F3EF] pt-4 flex justify-center">
				<p className="text-xs text-zinc-500">
					Belum punya akun?{" "}
					<Link className="font-semibold text-[#B47517] hover:text-[#854D0E] underline underline-offset-4" href="/daftar">
						Daftar akun peserta
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}
