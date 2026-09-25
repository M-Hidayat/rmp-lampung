import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, CheckCircle2, MapPin } from "lucide-react"
import Link from "next/link"

import { FormulirPendaftaran } from "./formulir-pendaftaran"
import { JudulHalaman, LabelBagian } from "@/components/kerangka"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { KesalahanDomain } from "@/lib/kesalahan"
import { ambilKelasPublik, sisaKuota } from "@/lib/layanan/kelas"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

/** Fasilitas kelas. Satu sumber agar tidak ada dua daftar yang berbeda. */
const fasilitas = [
	"Praktik langsung dengan bahan disediakan",
	"Hasil praktik dapat dibawa pulang",
	"Modul resep komersial & formulasi HPP",
	"Sertifikat kelulusan resmi ber-QR",
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	try {
		const kelas = await ambilKelasPublik(slug)
		return { title: `${kelas.judul} — Kursus Kuliner Rumah Mama Pintar` }
	} catch {
		return { title: "Kelas tidak ditemukan" }
	}
}

export default async function HalamanDetailKelas({ params }: Props) {
	const { slug } = await params

	const kelas = await ambilKelasPublik(slug).catch((kesalahan) => {
		if (
			kesalahan instanceof KesalahanDomain &&
			kesalahan.kode === "TIDAK_DITEMUKAN"
		) {
			notFound()
		}
		throw kesalahan
	})

	const sisa = sisaKuota(kelas.kuota, kelas._count.enrollments)
	const sudahMulai = kelas.jadwalMulai.getTime() <= Date.now()
	const nonaktif = sisa === 0 || sudahMulai
	const alasanNonaktif = sudahMulai
		? "Pendaftaran kelas ini sudah ditutup karena jadwal telah dimulai."
		: sisa === 0
			? "Kuota kelas ini sudah penuh."
			: undefined

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4">
				<Button asChild variant="ghost" size="sm" className="-ml-3 self-start">
					<Link href="/kelas">
						<ArrowLeft aria-hidden="true" /> Kembali ke Katalog
					</Link>
				</Button>
				<JudulHalaman
					labels={<LabelBagian>Detail program</LabelBagian>}
					judul={kelas.judul}
					keterangan={`${formatTanggalWaktu(kelas.jadwalMulai)} WIB · ${kelas.lokasi}`}
				/>
			</div>

			<div className="grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Deskripsi & Silabus Kelas</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
								{kelas.deskripsi}
							</p>
							{kelas.jadwalSelesai ? (
								<>
									<Separator />
									<p className="text-sm text-muted-foreground">
										Perkiraan selesai:{" "}
										<span className="font-semibold text-foreground">
											{formatTanggalWaktu(kelas.jadwalSelesai)} WIB
										</span>
									</p>
								</>
							) : null}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Fasilitas & Keuntungan Peserta</CardTitle>
							<CardDescription>
								Yang peserta dapatkan selama mengikuti pelatihan ini.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-3 sm:grid-cols-2">
							{fasilitas.map((item) => (
								<div
									key={item}
									className="flex items-start gap-2 rounded-md border border-border bg-muted p-3"
								>
									<CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
									<span className="text-sm text-card-foreground">{item}</span>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Kartu pendaftaran lengket di desktop. */}
				<Card className="lg:sticky lg:top-24">
					<CardHeader>
						<Badge variant={sisa > 0 ? "menunggu" : "destructive"} className="w-fit">
							{sisa > 0 ? `Tersisa ${sisa} dari ${kelas.kuota} kursi` : "Kuota penuh"}
						</Badge>
						<div className="mt-2 flex flex-col gap-1">
							<span className="text-xs font-medium text-muted-foreground">
								Biaya investasi
							</span>
							<span className="font-heading text-3xl font-extrabold text-foreground">
								{formatRupiah(kelas.harga.toString())}
							</span>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<p className="flex items-center gap-2 text-sm text-muted-foreground">
								<Calendar aria-hidden="true" className="size-4 shrink-0 text-brand" />
								<span>{formatTanggalWaktu(kelas.jadwalMulai)} WIB</span>
							</p>
							<p className="flex items-center gap-2 text-sm text-muted-foreground">
								<MapPin aria-hidden="true" className="size-4 shrink-0 text-brand" />
								<span>{kelas.lokasi}</span>
							</p>
						</div>
						<Separator />
						<FormulirPendaftaran
							slugKelas={kelas.slug}
							nonaktif={nonaktif}
							alasanNonaktif={alasanNonaktif}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}