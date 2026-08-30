import type { Metadata } from "next"
import Link from "next/link"

import { JudulHalaman } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { verifikasiSertifikatPublik } from "@/lib/layanan/sertifikat"
import { formatTanggal } from "@/lib/uang"
import { skemaNomorSertifikat } from "@/lib/validasi"

export const metadata: Metadata = { title: "Hasil verifikasi sertifikat" }
export const dynamic = "force-dynamic"

type Props = { params: Promise<{ nomor: string }> }

export default async function HalamanHasilVerifikasi({ params }: Props) {
	const { nomor } = await params
	const nomorDidekode = decodeURIComponent(nomor)
	const valid = skemaNomorSertifikat.safeParse(nomorDidekode)

	const hasil = valid.success
		? await verifikasiSertifikatPublik(valid.data)
		: ({ ditemukan: false } as const)

	return (
		<div className="mx-auto max-w-xl space-y-6">
			<JudulHalaman
				judul="Hasil verifikasi sertifikat"
				keterangan={`Nomor diperiksa: ${nomorDidekode}`}
			/>

			{!hasil.ditemukan ? (
				<Alert variant="gagal" judul="Sertifikat tidak ditemukan">
					<p>
						Nomor sertifikat tidak terdaftar pada sistem. Periksa kembali
						penulisan nomor atau hubungi penyelenggara.
					</p>
				</Alert>
			) : (
				<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
					<CardHeader className="border-b border-[#F5F3EF] pb-4">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-bold text-zinc-950 font-heading">Data sertifikat</CardTitle>
							<Badge variant={hasil.status === "valid" ? "sukses" : "destructive"}>
								{hasil.status === "valid" ? "Valid" : "Dibatalkan"}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-3 pt-4 text-sm">
						<dl className="divide-y divide-[#F5F3EF]">
							<div className="py-2.5 flex items-center justify-between">
								<dt className="text-zinc-500 text-xs font-medium">Nomor sertifikat</dt>
								<dd className="font-mono font-bold text-[#854D0E]">{hasil.nomor}</dd>
							</div>
							<div className="py-2.5 flex items-center justify-between">
								<dt className="text-zinc-500 text-xs font-medium">Nama peserta</dt>
								<dd className="font-semibold text-zinc-950">{hasil.namaPeserta}</dd>
							</div>
							<div className="py-2.5 flex items-center justify-between">
								<dt className="text-zinc-500 text-xs font-medium">Kelas</dt>
								<dd className="font-semibold text-zinc-950">{hasil.judulKelas}</dd>
							</div>
							<div className="py-2.5 flex items-center justify-between">
								<dt className="text-zinc-500 text-xs font-medium">Tanggal terbit</dt>
								<dd className="text-zinc-700 font-medium">{formatTanggal(hasil.diterbitkanPada)}</dd>
							</div>
							<div className="py-2.5 flex items-center justify-between">
								<dt className="text-zinc-500 text-xs font-medium">Status keabsahan</dt>
								<dd>
									<Badge
										variant={hasil.status === "valid" ? "sukses" : "destructive"}
									>
										{hasil.status === "valid"
											? "Valid"
											: "Dibatalkan"}
									</Badge>
								</dd>
							</div>
						</dl>
						<p className="text-xs text-zinc-400 border-t border-[#F5F3EF] pt-3">
							Data pembayaran, email, dan telepon peserta tidak ditampilkan pada
							halaman publik.
						</p>
					</CardContent>
				</Card>
			)}

			<Button asChild variant="outline" className="w-full bg-white border-[#EFECE6] rounded-xl hover:bg-[#FAF8F5]">
				<Link href="/verifikasi">Periksa nomor lain</Link>
			</Button>
		</div>
	)
}
