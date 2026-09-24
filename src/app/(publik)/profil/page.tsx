import type { Metadata } from "next"
import { ExternalLink } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { BuktiPublik } from "@/components/bukti-publik"
import { buktiPublik, catatanRiset } from "@/lib/bukti-publik"
import { daftarPlaceholder, identitasRmp } from "@/lib/identitas-rmp"

export const metadata: Metadata = { title: "Profil Rumah Mama Pintar" }

type BarisFakta = {
	label: string
	nilai: string
	terverifikasi: boolean
	sumber?: string[]
	catatan?: string
}

function barisFakta(): BarisFakta[] {
	return [
		{
			label: "Nama usaha",
			nilai: identitasRmp.namaUsaha.nilai,
			terverifikasi: identitasRmp.namaUsaha.terverifikasi,
			sumber: identitasRmp.namaUsaha.sumber,
		},
		{
			label: "Badan usaha resmi",
			nilai: identitasRmp.namaResmiBadanUsaha.nilai,
			terverifikasi: identitasRmp.namaResmiBadanUsaha.terverifikasi,
			catatan: identitasRmp.namaResmiBadanUsaha.catatan,
		},
		{
			label: "Jenis kursus",
			nilai: identitasRmp.jenisKursus.nilai,
			terverifikasi: identitasRmp.jenisKursus.terverifikasi,
			sumber: identitasRmp.jenisKursus.sumber,
		},
		{
			label: "Alamat",
			nilai: identitasRmp.alamat.nilai,
			terverifikasi: identitasRmp.alamat.terverifikasi,
			sumber: identitasRmp.alamat.sumber,
			catatan: identitasRmp.alamat.catatan,
		},
		{
			label: "Telepon / WhatsApp",
			nilai: identitasRmp.telepon.nilai,
			terverifikasi: identitasRmp.telepon.terverifikasi,
			sumber: identitasRmp.telepon.sumber,
		},
		{
			label: "Email",
			nilai: identitasRmp.email.nilai,
			terverifikasi: identitasRmp.email.terverifikasi,
			sumber: identitasRmp.email.sumber,
			catatan: identitasRmp.email.catatan,
		},
		{
			label: "Identitas visual (logo)",
			nilai: identitasRmp.logo.nilai,
			terverifikasi: identitasRmp.logo.terverifikasi,
			catatan: identitasRmp.logo.catatan,
		},
		{
			label: "Kelas yang pernah ditawarkan",
			nilai: identitasRmp.kelasYangPernahDitawarkan.nilai.join(", "),
			terverifikasi: identitasRmp.kelasYangPernahDitawarkan.terverifikasi,
			sumber: identitasRmp.kelasYangPernahDitawarkan.sumber,
			catatan: identitasRmp.kelasYangPernahDitawarkan.catatan,
		},
		{
			label: "Pola pendaftaran saat ini",
			nilai: identitasRmp.polaPendaftaranSaatIni.nilai,
			terverifikasi: identitasRmp.polaPendaftaranSaatIni.terverifikasi,
			sumber: identitasRmp.polaPendaftaranSaatIni.sumber,
		},
		{
			label: "Daftar harga resmi",
			nilai: identitasRmp.hargaResmi.nilai,
			terverifikasi: identitasRmp.hargaResmi.terverifikasi,
		},
	]
}

export default function HalamanProfil() {
	const fakta = barisFakta()
	const placeholder = daftarPlaceholder()

	return (
		<div className="space-y-8">
			<JudulHalaman
				judul="Profil Rumah Mama Pintar dan sumber data"
				keterangan="Setiap fakta identitas disertai sumber publik. Data yang belum ditemukan tetap ditandai sebagai placeholder."
			/>

			<Alert variant="info" judul="Kebijakan konten identitas">
				<p>
					Sistem tidak membuat logo, alamat, kontak, testimoni, sejarah, atau
					klaim bisnis yang tidak dapat dibuktikan. Konten brand produksi
					menunggu konfirmasi resmi pemilik.
				</p>
			</Alert>

			{/* Bukti pihak ketiga yang dapat diperiksa sendiri oleh pengunjung. */}
			<div className="space-y-4">
				<BuktiPublik jumlahAwal={buktiPublik.length} />

				<Alert variant="peringatan" judul="Catatan riset yang perlu dikonfirmasi pemilik">
					<p className="mb-2">
						Riset menemukan ketidakcocokan antar sumber. Hal ini ditampilkan apa adanya
						agar tidak menjadi masalah di kemudian hari.
					</p>
					<ul className="space-y-2 text-sm">
						<li>
							<span className="font-semibold">Alamat:</span> {catatanRiset.alamat.catatan}
						</li>
						<li>
							<span className="font-semibold">Telepon:</span> {catatanRiset.telepon.catatan}
						</li>
						<li>
							<span className="font-semibold">Foto kegiatan:</span> {catatanRiset.fotoKegiatan.catatan}
						</li>
					</ul>
				</Alert>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				{fakta.map((item) => (
					<Card key={item.label} className="flex h-full flex-col justify-between">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between gap-2">
								<CardTitle className="text-sm font-semibold text-zinc-950">{item.label}</CardTitle>
								<Badge variant={item.terverifikasi ? "sukses" : "menunggu"}>
									{item.terverifikasi ? "Terverifikasi" : "Placeholder"}
								</Badge>
							</div>
							<CardDescription className="text-xs">
								{item.terverifikasi
									? "Status: terverifikasi dari sumber publik"
									: "Status: belum terverifikasi (placeholder)"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 pt-2 text-xs sm:text-sm">
							<p className="font-medium text-zinc-900 leading-relaxed">{item.nilai}</p>
							{item.catatan ? (
								<p className="text-xs text-zinc-500">{item.catatan}</p>
							) : null}
							{item.sumber?.length ? (
								<div className="rounded-md bg-zinc-50 p-2.5 border border-zinc-200 space-y-1 text-xs">
									<p className="font-semibold text-zinc-700">Sumber Publik:</p>
									<ul className="space-y-1 break-words">
										{item.sumber.map((sumber) => (
											<li key={sumber}>
												<a
													className="inline-flex items-center gap-1 text-zinc-700 hover:underline hover:text-zinc-950"
													href={sumber}
													rel="noreferrer noopener nofollow"
													target="_blank"
												>
													<span className="truncate max-w-[240px] sm:max-w-[320px]">{sumber}</span>
													<ExternalLink className="size-3 shrink-0 opacity-60" />
												</a>
											</li>
										))}
									</ul>
								</div>
							) : null}
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base font-semibold text-zinc-950">
						Ringkasan data yang masih placeholder
					</CardTitle>
					<CardDescription className="text-xs">
						Data berikut wajib dikonfirmasi pemilik sebelum publikasi produksi.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm text-zinc-600">
						{placeholder.map((item) => (
							<li key={item.kunci} className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3">
								<span className="font-semibold text-zinc-900 block">{item.kunci}</span>
								<span className="text-zinc-500">{item.catatan}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
