import type { Metadata } from "next"
import Link from "next/link"
import {
	ArrowRight,
	BookOpenCheck,
	Calendar,
	ChefHat,
	MapPin,
	MessageCircle,
	MonitorCheck,
	Utensils,
} from "lucide-react"

import { BuktiPublik, GaleriKegiatan, UlasanPeserta } from "@/components/bukti-publik"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { identitasRmp } from "@/lib/identitas-rmp"
import { daftarKelasPublik, sisaKuota } from "@/lib/layanan/kelas"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
	title: "Pelatihan Bisnis Kuliner di Bandar Lampung",
	description:
		"Pelatihan bisnis kuliner Rumah Mama Pintar di Bandar Lampung dengan pilihan kursus masakan, roti, kue, dan minuman.",
}

const keunggulan = [
	{
		judul: "Kelas tatap muka",
		deskripsi: "Praktik langsung di dapur pelatihan bersama pengajar.",
		ikon: Utensils,
	},
	{
		judul: "Kelas online",
		deskripsi: "Diikuti dari jarak jauh tanpa mengurangi materi praktik.",
		ikon: MonitorCheck,
	},
	{
		judul: "Pendampingan belajar",
		deskripsi: "Peserta dibimbing sampai mampu mempraktikkan sendiri.",
		ikon: BookOpenCheck,
	},
]

const langkahPendaftaran = [
	{
		judul: "Pilih program",
		deskripsi: "Lihat daftar kelas, jadwal, lokasi, dan sisa kuota yang tersedia.",
	},
	{
		judul: "Buat akun",
		deskripsi: "Daftar dengan email agar riwayat kelas dan pembayaran tercatat.",
	},
	{
		judul: "Selesaikan pembayaran",
		deskripsi: "Lanjutkan pembayaran setelah memilih kelas yang sesuai.",
	},
	{
		judul: "Ikuti kelas",
		deskripsi: "Hadir di kelas tatap muka atau ikuti kelas online sesuai jadwal.",
	},
]

export default async function Beranda() {
	// Kegagalan query kelas tidak boleh meruntuhkan bagian lain halaman ini.
	const kelas = await daftarKelasPublik().catch(() => [])
	const pilihan = kelas.slice(0, 3)
	const whatsapp = identitasRmp.whatsapp.nilai

	return (
		<div className="space-y-16 pb-4 sm:space-y-20 lg:space-y-24">
			{/* Pembuka: satu janji faktual + satu aksi utama. Tanpa foto hero
			    (dihapus atas permintaan) sehingga muat pertama lebih ringan. */}
			<section id="beranda" aria-labelledby="judul-beranda" className="scroll-mt-24">
				<div className="max-w-3xl space-y-6">
					<p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground sm:text-sm">
						Pelatihan Bisnis Kuliner di Bandar Lampung
					</p>
					<h1
						id="judul-beranda"
						className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
					>
						Belajar melalui praktik, siapkan langkah kerja atau usaha
					</h1>
					<p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
						Rumah Mama Pintar menyediakan kursus masakan, roti, kue, dan minuman dalam
						format tatap muka maupun online.
					</p>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button asChild size="lg" variant="gold">
							<Link href="#program">Lihat Program Kelas</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<a href={whatsapp} target="_blank" rel="noreferrer noopener">
								<MessageCircle aria-hidden="true" /> Konsultasi via WhatsApp
							</a>
						</Button>
					</div>
					<div className="flex flex-col gap-2 border-l-4 border-accent-foreground/40 pl-4 text-sm text-muted-foreground sm:flex-row sm:gap-6">
						<span className="inline-flex items-center gap-2">
							<MapPin aria-hidden="true" className="size-4 text-accent-foreground" />
							{identitasRmp.kota.nilai}
						</span>
					</div>
				</div>

				<div className="mt-10 grid gap-5 sm:grid-cols-3">
					{keunggulan.map(({ judul, deskripsi, ikon: Ikon }) => (
						<Card key={judul} className="pt-0">
							<CardHeader className="pt-5">
								<div className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
									<Ikon aria-hidden="true" className="size-5" />
								</div>
								<CardTitle className="mt-3 text-base font-bold">{judul}</CardTitle>
							</CardHeader>
							<CardContent className="pb-5">
								<p className="text-sm leading-6 text-muted-foreground">{deskripsi}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Program dari data nyata aplikasi, bukan daftar duplikat. */}
			<section id="program" aria-labelledby="judul-program" className="scroll-mt-24 space-y-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-2xl">
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
							Program pilihan
						</p>
						<h2
							id="judul-program"
							className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl"
						>
							Temukan kelas yang sesuai
						</h2>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							Periksa jadwal, biaya, lokasi, dan kuota sebelum mendaftar.
						</p>
					</div>
					<Link
						href="/kelas"
						className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						Lihat semua kelas <ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				</div>

				{pilihan.length === 0 ? (
					<Card className="border-dashed">
						<CardContent className="py-12 text-center">
							<ChefHat aria-hidden="true" className="mx-auto size-9 text-accent-foreground" />
							<h3 className="mt-4 font-heading font-bold text-foreground">
								Jadwal kelas sedang disiapkan
							</h3>
							<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
								Hubungi Rumah Mama Pintar untuk menanyakan informasi program terbaru.
							</p>
							<Button asChild variant="outline" className="mt-5">
								<a href={whatsapp} target="_blank" rel="noreferrer noopener">
									Hubungi via WhatsApp
								</a>
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-5 md:grid-cols-3">
						{pilihan.map((item) => {
							const sisa = sisaKuota(item.kuota, item._count.enrollments)
							return (
								<Card key={item.id} className="flex flex-col pt-0">
									<CardHeader className="pt-5">
										<div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
											<CardTitle className="font-heading text-base font-bold">
												{item.judul}
											</CardTitle>
											<span className="shrink-0 text-sm font-bold text-accent-foreground">
												{formatRupiah(item.harga.toString())}
											</span>
										</div>
									</CardHeader>
									<CardContent className="flex-1 space-y-3">
										<p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
											{item.deskripsi || "Informasi materi akan diumumkan oleh admin."}
										</p>
										<Separator />
										<p className="flex items-start gap-2 text-sm text-muted-foreground">
											<Calendar
												aria-hidden="true"
												className="mt-0.5 size-4 shrink-0 text-accent-foreground"
											/>
											<span>{formatTanggalWaktu(item.jadwalMulai)} WIB</span>
										</p>
										<p className="flex items-start gap-2 text-sm text-muted-foreground">
											<MapPin
												aria-hidden="true"
												className="mt-0.5 size-4 shrink-0 text-accent-foreground"
											/>
											<span className="min-w-0 break-words">{item.lokasi}</span>
										</p>
									</CardContent>
									<CardFooter className="flex-col items-stretch gap-3 pb-5 xl:flex-row xl:items-center xl:justify-between">
										<span className="text-xs font-medium text-muted-foreground">
											{sisa > 0 ? `${sisa} kursi tersisa` : "Kelas penuh"}
										</span>
										{/* min-h-11 dipaksa di mobile agar target sentuh >=44px,
										    baru dipadatkan pada layar xl. */}
										<Button
											asChild
											size="sm"
											className="min-h-11 w-full font-semibold xl:min-h-9 xl:w-auto"
										>
											<Link href={`/kelas/${item.slug}`}>Lihat detail</Link>
										</Button>
									</CardFooter>
								</Card>
							)
						})}
					</div>
				)}
			</section>

			{/* Ulasan asli peserta dari Google Maps, beserta penilaian 4,9/186 ulasan. */}
			<UlasanPeserta />

			{/* Bukti pihak ketiga: liputan media, institusi pendidikan, organisasi.
			    Semua tautan mengarah ke sumber asli agar dapat diperiksa sendiri. */}
			<BuktiPublik />

			{/* Galeri dokumentasi kegiatan, memakai foto asli dari arsip RMP. */}
			<GaleriKegiatan />

			<section
				id="cara-daftar"
				aria-labelledby="judul-cara-daftar"
				className="scroll-mt-24"
			>
				<Card className="px-5 py-10 sm:px-8 lg:px-10">
					<div className="max-w-2xl">
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
							Cara pendaftaran
						</p>
						<h2
							id="judul-cara-daftar"
							className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl"
						>
							Empat langkah untuk mulai belajar
						</h2>
					</div>
					<ol className="mt-8 max-w-3xl">
						{langkahPendaftaran.map((langkah, indeks) => (
							<li key={langkah.judul} className="relative flex gap-4 pb-5 last:pb-0 sm:gap-5">
								{indeks < langkahPendaftaran.length - 1 ? (
									<span
										aria-hidden="true"
										className="absolute bottom-0 left-5 top-10 border-l-2 border-brand-border"
									/>
								) : null}
								<span
									className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-brand-foreground shadow-sm"
									aria-hidden="true"
								>
									{indeks + 1}
								</span>
								<div className="min-w-0 flex-1 rounded-lg border border-border bg-muted p-5">
									<h3 className="font-heading font-bold text-foreground">{langkah.judul}</h3>
									<p className="mt-2 text-sm leading-6 text-muted-foreground">
										{langkah.deskripsi}
									</p>
								</div>
							</li>
						))}
					</ol>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button asChild size="lg" variant="gold">
							<Link href="/kelas">Pilih Kelas</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="/daftar">Buat Akun</Link>
						</Button>
					</div>
				</Card>
			</section>

			<section aria-labelledby="judul-cta" className="rounded-2xl border border-border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-12">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div className="max-w-2xl">
						<h2
							id="judul-cta"
							className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
						>
							Siap memilih kelas kuliner?
						</h2>
						<p className="mt-3 leading-7 text-muted-foreground">
							Lihat program yang tersedia atau hubungi Rumah Mama Pintar untuk informasi
							lebih lanjut.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button asChild size="lg" variant="gold">
							<Link href="/kelas">Lihat Program</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<a href={whatsapp} target="_blank" rel="noreferrer noopener">
								<MessageCircle aria-hidden="true" /> Hubungi Kami
							</a>
						</Button>
					</div>
				</div>
			</section>
		</div>
	)
}
