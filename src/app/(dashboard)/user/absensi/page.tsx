import type { Metadata } from "next"

import { FormulirAbsensi } from "./formulir-absensi"
import { JudulHalaman } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"

export const metadata: Metadata = { title: "Absensi" }
export const dynamic = "force-dynamic"

type Props = { searchParams: Promise<{ token?: string }> }

export default async function HalamanAbsensiUser({ searchParams }: Props) {
	const { token } = await searchParams

	return (
		<div className="mx-auto max-w-xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
					Absensi
				</h1>
				<p className="text-xs text-zinc-500 mt-0.5">
					Kehadiran tercatat satu kali per pendaftaran yang sudah berstatus lunas.
				</p>
			</div>

			<Alert variant="info" judul="Instruksi Pemindaian QR">
				<p>
					Pindai QR code absensi yang ditampilkan instruktur di kelas fisik menggunakan kamera perangkat Anda, atau tempel token manual jika kamera tidak tersedia.
				</p>
			</Alert>

			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs">
				<FormulirAbsensi token={token} />
			</div>
		</div>
	)
}
