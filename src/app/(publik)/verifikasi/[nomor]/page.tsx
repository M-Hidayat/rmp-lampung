import type { Metadata } from "next"
import Link from "next/link"

import { JudulHalaman, LabelBagian } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verifikasiSertifikatPublik } from "@/lib/layanan/sertifikat"
import { formatTanggal } from "@/lib/uang"
import { skemaNomorSertifikat } from "@/lib/validasi"

export const metadata: Metadata = { title: "Hasil verifikasi sertifikat" }
export const dynamic = "force-dynamic"

type Props = { params: Promise<{ nomor: string }> }

function BarisData({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4 py-2.5">
			<dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
			<dd className="min-w-0 text-right text-sm font-semibold text-foreground">{children}</dd>
		</div>
	)
}

export default async function HalamanHasilVerifikasi({ params }: Props) {
	const { nomor } = await params
	const nomorDidekode = decodeURIComponent(nomor)
	const valid = skemaNomorSertifikat.safeParse(nomorDidekode)

	const hasil = valid.success
		? await verifikasiSertifikatPublik(valid.data)
		: ({ ditemukan: false } as const)

	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<JudulHalaman
				labels={<LabelBagian>Keaslian dokumen</LabelBagian>}
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
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between gap-3">
							<CardTitle>Data sertifikat</CardTitle>
							<Badge variant={hasil.status === "valid" ? "sukses" : "destructive"}>
								{hasil.status === "valid" ? "Valid" : "Dibatalkan"}
							</Badge>
						</div>
						<CardDescription>
							Data ini diambil langsung dari catatan penerbitan sertifikat.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<dl className="divide-y divide-border">
							<BarisData label="Nomor sertifikat">
								<span className="font-mono">{hasil.nomor}</span>
							</BarisData>
							<BarisData label="Nama peserta">{hasil.namaPeserta}</BarisData>
							<BarisData label="Kelas">{hasil.judulKelas}</BarisData>
							<BarisData label="Tanggal terbit">
								{formatTanggal(hasil.diterbitkanPada)}
							</BarisData>
							<BarisData label="Status keabsahan">
								<Badge variant={hasil.status === "valid" ? "sukses" : "destructive"}>
									{hasil.status === "valid" ? "Valid" : "Dibatalkan"}
								</Badge>
							</BarisData>
						</dl>
						<p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
							Data pembayaran, email, dan telepon peserta tidak ditampilkan pada
							halaman publik.
						</p>
					</CardContent>
				</Card>
			)}

			<Button asChild variant="outline" className="w-full">
				<Link href="/verifikasi">Periksa nomor lain</Link>
			</Button>
		</div>
	)
}