import type { Metadata } from "next"
import { ExternalLink } from "lucide-react"

import { JudulHalaman, LabelBagian } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BuktiPublik, UlasanPeserta } from "@/components/bukti-publik"
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
		<div className="flex flex-col gap-12">
			<JudulHalaman
				labels={<LabelBagian>Transparansi data</LabelBagian>}
				judul="Profil Rumah Mama Pintar dan Sumber Data"
				keterangan="Setiap fakta identitas disertai sumber publik. Data yang belum ditemukan tetap ditandai sebagai placeholder."
			/>

			<Alert variant="info" judul="Kebijakan konten identitas">
				<p>
					Sistem tidak membuat logo, alamat, kontak, testimoni, sejarah, atau
					klaim bisnis yang tidak dapat dibuktikan. Konten brand produksi
					menunggu konfirmasi resmi pemilik.
				</p>
			</Alert>

			{/* Ulasan asli peserta + liputan pihak ketiga, semuanya bertaut sumber. */}
			<UlasanPeserta batas={5} />

			<BuktiPublik jumlahAwal={buktiPublik.length} />

			<Alert variant="peringatan" judul="Catatan riset yang perlu dikonfirmasi pemilik">
				<p className="mb-2">
					Riset menemukan ketidakcocokan antar sumber. Hal ini ditampilkan apa adanya
					agar tidak menjadi masalah di kemudian hari.
				</p>
				<ul className="flex flex-col gap-2">
					<li>
						<span className="font-semibold text-foreground">Alamat:</span>{" "}
						{catatanRiset.alamatTerkonfirmasi.catatan}
					</li>
					<li>
						<span className="font-semibold text-foreground">Telepon:</span>{" "}
						{catatanRiset.telepon.catatan}
					</li>
					<li>
						<span className="font-semibold text-foreground">Foto kegiatan:</span>{" "}
						{catatanRiset.fotoKegiatan.catatan}
					</li>
					<li>
						<span className="font-semibold text-foreground">Nama instruktur:</span>{" "}
						{catatanRiset.sertifikat.catatan}
					</li>
				</ul>
			</Alert>

			<section aria-labelledby="judul-fakta" className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<LabelBagian>Daftar fakta</LabelBagian>
					<h2 id="judul-fakta" className="text-2xl font-bold text-foreground sm:text-3xl">
						Fakta Identitas dan Sumbernya
					</h2>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					{fakta.map((item) => (
						<Card key={item.label} className="h-full">
							<CardHeader>
								<div className="flex items-start justify-between gap-3">
									<CardTitle className="text-sm">{item.label}</CardTitle>
									<Badge variant={item.terverifikasi ? "sukses" : "menunggu"}>
										{item.terverifikasi ? "Terverifikasi" : "Placeholder"}
									</Badge>
								</div>
								<CardDescription>
									{item.terverifikasi
										? "Status: terverifikasi dari sumber publik"
										: "Status: belum terverifikasi (placeholder)"}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-3">
								<p className="text-sm font-medium leading-relaxed text-card-foreground">
									{item.nilai}
								</p>
								{item.catatan ? (
									<p className="text-xs leading-relaxed text-muted-foreground">
										{item.catatan}
									</p>
								) : null}
								{item.sumber?.length ? (
									<div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted p-3">
										<p className="text-xs font-semibold text-foreground">Sumber publik</p>
										<ul className="flex flex-col gap-1.5">
											{item.sumber.map((sumber) => (
												<li key={sumber}>
													<a
														className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
														href={sumber}
														rel="noreferrer noopener nofollow"
														target="_blank"
													>
														<span className="max-w-[240px] truncate sm:max-w-[320px]">
															{sumber}
														</span>
														<ExternalLink aria-hidden="true" className="size-3 shrink-0 opacity-60" />
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
			</section>

			<Card>
				<CardHeader>
					<CardTitle id="judul-placeholder">
						Ringkasan data yang masih placeholder
					</CardTitle>
					<CardDescription>
						Data berikut wajib dikonfirmasi pemilik sebelum publikasi produksi.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className="grid gap-3 sm:grid-cols-2">
						{placeholder.map((item) => (
							<li key={item.kunci} className="flex flex-col gap-1 rounded-md border border-border bg-muted p-3">
								<span className="text-sm font-semibold text-foreground">{item.kunci}</span>
								<span className="text-xs leading-relaxed text-muted-foreground">
									{item.catatan}
								</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}