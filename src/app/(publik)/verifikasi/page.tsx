import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { JudulHalaman } from "@/components/kerangka"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = { title: "Verifikasi sertifikat" }

async function aksiVerifikasi(formData: FormData) {
	"use server"
	const nomor = String(formData.get("nomor") ?? "").trim()
	if (!nomor) redirect("/verifikasi")
	redirect(`/verifikasi/${encodeURIComponent(nomor)}`)
}

export default function HalamanVerifikasi() {
	return (
		<div className="mx-auto max-w-xl space-y-6">
			<JudulHalaman
				judul="Verifikasi sertifikat"
				keterangan="Masukkan nomor sertifikat untuk memeriksa keabsahannya."
			/>

			<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
				<CardHeader>
					<CardTitle className="text-base font-bold text-zinc-950 font-heading">
						Nomor sertifikat
					</CardTitle>
					<CardDescription className="text-xs text-zinc-500">
						Halaman ini hanya menampilkan data minimum: nomor, nama peserta,
						kelas, tanggal terbit, dan status.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={aksiVerifikasi} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="nomor" className="text-xs font-medium text-zinc-700">
								Nomor sertifikat
							</Label>
							<Input
								id="nomor"
								name="nomor"
								required
								placeholder="SRT/RMP/2026/000001"
								autoComplete="off"
								className="font-mono text-sm uppercase rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
							/>
						</div>
						<Button type="submit" variant="gold" className="w-full font-semibold rounded-xl shadow-xs">
							Periksa sertifikat
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
