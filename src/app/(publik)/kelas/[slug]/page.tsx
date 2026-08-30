import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Calendar, MapPin, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { FormulirPendaftaran } from "./formulir-pendaftaran"
import { JudulHalaman } from "@/components/kerangka"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { KesalahanDomain } from "@/lib/kesalahan"
import { ambilKelasPublik, sisaKuota } from "@/lib/layanan/kelas"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	try {
		const kelas = await ambilKelasPublik(slug)
		return { title: `${kelas.judul} — Kursus Kuliner RMP Lampung` }
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
		<div className="space-y-8">
			<div>
				<Button asChild variant="ghost" size="sm" className="mb-4 text-xs -ml-2 text-zinc-600 hover:text-zinc-950">
					<Link href="/kelas">
						<ArrowLeft className="size-3.5 mr-1" /> Kembali ke Katalog
					</Link>
				</Button>
				<JudulHalaman
					judul={kelas.judul}
					keterangan={`${formatTanggalWaktu(kelas.jadwalMulai)} WIB · ${kelas.lokasi}`}
				/>
			</div>

			<div className="grid gap-8 lg:grid-cols-[2fr_1fr] items-start">
				<div className="space-y-6">
					{/* Deskripsi & Silabus Card */}
					<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
						<CardHeader className="border-b border-[#F5F3EF] pb-3">
							<CardTitle className="text-base font-bold text-zinc-950 font-heading">
								Deskripsi & Silabus Kelas
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 text-sm text-zinc-600 leading-relaxed pt-4">
							<p className="whitespace-pre-line">{kelas.deskripsi}</p>

							{kelas.jadwalSelesai ? (
								<p className="text-xs text-zinc-500 border-t border-[#F5F3EF] pt-3">
									Perkiraan selesai: <span className="font-semibold text-zinc-800">{formatTanggalWaktu(kelas.jadwalSelesai)} WIB</span>
								</p>
							) : null}
						</CardContent>
					</Card>

					{/* Fasilitas & Benefit Card */}
					<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
						<CardHeader className="border-b border-[#F5F3EF] pb-3">
							<CardTitle className="text-base font-bold text-zinc-950 font-heading">
								Fasilitas & Keuntungan Peserta
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm text-zinc-700 pt-4">
							<div className="flex items-start gap-2 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
								<CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
								<span>100% Praktik Hands-on (Bahan Disediakan)</span>
							</div>
							<div className="flex items-start gap-2 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
								<CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
								<span>Hasil Praktik Dapat Dibawa Pulang</span>
							</div>
							<div className="flex items-start gap-2 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
								<CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
								<span>Modul Resep Komersial & Formulasi HPP</span>
							</div>
							<div className="flex items-start gap-2 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
								<CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
								<span>Sertifikat Kelulusan Resmi Ber-QR</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sticky Pendaftaran & Booking Card */}
				<div className="sticky top-20">
					<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
						<CardHeader className="space-y-2 border-b border-[#F5F3EF] pb-4">
							<span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold w-fit ${
								sisa > 0
									? "border border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]"
									: "border border-red-200 bg-red-50 text-red-700"
							}`}>
								{sisa > 0 ? `Tersisa ${sisa} dari ${kelas.kuota} Kursi` : "Kuota Penuh"}
							</span>
							<div className="space-y-0.5">
								<span className="text-xs text-zinc-500 font-medium">Biaya Investasi</span>
								<div className="text-2xl font-extrabold font-mono text-[#854D0E]">
									{formatRupiah(kelas.harga.toString())}
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4 pt-4 text-xs sm:text-sm">
							<div className="space-y-2 text-zinc-600">
								<div className="flex items-center gap-2">
									<Calendar className="size-3.5 text-[#D49A28] shrink-0" />
									<span>{formatTanggalWaktu(kelas.jadwalMulai)} WIB</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="size-3.5 text-[#D49A28] shrink-0" />
									<span>{kelas.lokasi}</span>
								</div>
							</div>

							<div className="border-t border-[#F5F3EF] pt-4">
								<FormulirPendaftaran
									slugKelas={kelas.slug}
									nonaktif={nonaktif}
									alasanNonaktif={alasanNonaktif}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
