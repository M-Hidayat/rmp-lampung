import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { FormulirDaftar } from "./formulir-daftar"
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

export const metadata: Metadata = { title: "Daftar akun" }

export default async function HalamanDaftar() {
	const sesi = await sesiPengguna()
	if (sesi) redirect(berandaDashboard(sesi.peran))

	return (
		<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
			<CardHeader className="space-y-1">
				<CardTitle className="text-xl font-bold text-zinc-950 font-heading">Daftar akun peserta</CardTitle>
				<CardDescription className="text-xs text-zinc-500">
					Akun baru selalu dibuat sebagai peserta kursus kuliner.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormulirDaftar />
			</CardContent>
			<CardFooter className="border-t border-[#F5F3EF] pt-4 flex justify-center">
				<p className="text-xs text-zinc-500">
					Sudah punya akun?{" "}
					<Link className="font-semibold text-[#B47517] hover:text-[#854D0E] underline underline-offset-4" href="/masuk">
						Masuk di sini
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}
