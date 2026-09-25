import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { JudulHalaman, LabelBagian } from "@/components/kerangka"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<JudulHalaman
				labels={<LabelBagian>Keaslian dokumen</LabelBagian>}
				judul="Verifikasi sertifikat"
				keterangan="Masukkan nomor sertifikat untuk memeriksa keabsahannya."
			/>

			<Card>
				<CardHeader>
					<CardTitle>Nomor sertifikat</CardTitle>
					<CardDescription>
						Halaman ini hanya menampilkan data minimum: nomor, nama peserta,
						kelas, tanggal terbit, dan status.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={aksiVerifikasi} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="nomor">Nomor sertifikat</Label>
							<Input
								id="nomor"
								name="nomor"
								required
								placeholder="SRT/RMP/2026/000001"
								autoComplete="off"
								className="font-mono uppercase"
							/>
						</div>
						<Button type="submit" variant="gold" className="w-full">
							Periksa sertifikat
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}