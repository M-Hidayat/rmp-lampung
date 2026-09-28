import type { Metadata } from "next"
import Link from "next/link"
import {
	ArrowRight,
	Cake,
	Calendar,
	ChevronRight,
	Clock,
	Croissant,
	CupSoda,
	Layers,
	MapPin,
	MessageCircle,
	Soup,
	UserPlus,
	Utensils,
} from "lucide-react"

import { BuktiPublik, GaleriKegiatan, UlasanPeserta } from "@/components/bukti-publik"
import { LabelBagian } from "@/components/kerangka"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
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

const deretKelas = [
	{ nama: "Kursus Masakan", ikon: Soup },
	{ nama: "Kursus Kue", ikon: Cake },
	{ nama: "Kursus Roti", ikon: Croissant },
	{ nama: "Kursus Minuman", ikon: CupSoda },
]


const langkahPendaftaran = [
	{
		judul: "Pilih Program",
		deskripsi: "Lihat daftar kelas, jadwal, lokasi, dan sisa kuota yang tersedia.",
		ikon: Layers,
	},
	{
		judul: "Buat Akun",
		deskripsi: "Daftar dengan email agar riwayat kelas dan pembayaran tercatat.",
		ikon: UserPlus,
	},
	{
		judul: "Selesaikan Pembayaran",
		deskripsi: "Lanjutkan pembayaran setelah memilih kelas yang sesuai.",
		ikon: MessageCircle,
	},
	{
		judul: "Ikuti Kelas",
		deskripsi: "Hadir di kelas tatap muka atau ikuti kelas online sesuai jadwal.",
		ikon: Calendar,
	},
]

export default async function Beranda() {
	// Kegagalan query kelas tidak boleh meruntuhkan bagian lain halaman ini.
	const kelas = await daftarKelasPublik().catch(() => [])
	const pilihan = kelas.slice(0, 3)
	const whatsapp = identitasRmp.whatsapp.nilai
	const totalKuota = kelas.reduce((jumlah, item) => jumlah + sisaKuota(item.kuota, item._count.enrollments), 0)

	return (
		<div className="flex flex-col gap-16 lg:gap-28">
			{/* Pembuka. Rasa tata letak mengikuti hero serbamager: glow aksen
			    redup di belakang teks, isi terpusat, satu aksi, lalu deret
			    elemen yang bergulir lambat, ditutup lengkungan di kaki hero.

			    Yang diadopsi: polanya. Yang TIDAK diadopsi: warnanya. Di
			    serbamager glow-nya oranye #BD5D3A; di sini memakai ungu
			    identitas RMP (#745FD4) lewat token `hero-glow`, sesuai
			    permintaan pemilik "tetap gunakan warna rumah mama pintar".

			    Deret yang bergulir berisi JENIS KELAS milik RMP sendiri
			    (terverifikasi di identitas-rmp.ts), bukan logo pihak ketiga
			    seperti pada referensi. */}
			<section id="beranda" aria-labelledby="judul-beranda" className="relative scroll-mt-24">
				{/* Cahaya aksen: murni dekoratif, tanpa konten di dalamnya. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 -top-20 h-[560px] bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-hero-glow)_28%,transparent),transparent_70%)]"
				/>

				<div className="relative flex flex-col items-center gap-10 text-center">
					<h1
						id="judul-beranda"
						className="max-w-3xl text-balance text-3xl font-semibold text-foreground sm:text-4xl lg:text-display"
					>
						Nikmati Pengalaman Belajar Kuliner yang Lebih Mudah
					</h1>

					<Button asChild size="lg" variant="gold">
						<Link href="#program">Lihat Program Kelas</Link>
					</Button>

					{/* Deret jenis kelas tanpa mie ayam & bakso */}
					<div
						className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
						aria-label="Jenis kelas yang tersedia"
						role="group"
					>
						<div className="flex w-max motion-safe:animasi-hero-gulir">
							{deretKelas.map((item) => {
								const Ikon = item.ikon
								return (
									<div
										key={`satu-${item.nama}`}
										className="flex shrink-0 flex-col items-center gap-2 px-6"
									>
										<Ikon aria-hidden="true" className="size-7 text-brand" />
										<span className="text-sm font-semibold text-muted-foreground">
											{item.nama}
										</span>
									</div>
								)
							})}
							{deretKelas.map((item) => {
								const Ikon = item.ikon
								return (
									<div
										key={`dua-${item.nama}`}
										aria-hidden="true"
										className="flex shrink-0 flex-col items-center gap-2 px-6"
									>
										<Ikon aria-hidden="true" className="size-7 text-brand" />
										<span className="text-sm font-semibold text-muted-foreground">
											{item.nama}
										</span>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				{/* Pembatas lurus antara hero dan bagian berikutnya */}
				<div
					aria-hidden="true"
					className="mt-12 sm:mt-16 border-b border-border"
				/>
			</section>

			{/* Program dari data nyata aplikasi, bukan daftar duplikat. */}
			<section id="program" aria-labelledby="judul-program" className="scroll-mt-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex max-w-2xl flex-col gap-3">
						<LabelBagian>Program pilihan</LabelBagian>
						<h2 id="judul-program" className="text-2xl font-bold text-foreground sm:text-3xl">
							Temukan Kelas yang Sesuai
						</h2>
						<CardDescription className="text-base">
							Periksa jadwal, biaya, lokasi, dan kuota sebelum mendaftar.
						</CardDescription>
						{kelas.length > 0 ? (
							<p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
								<Clock aria-hidden="true" className="size-4 shrink-0 text-brand" />
								{kelas.length} kelas aktif · {totalKuota} kursi tersedia
							</p>
						) : null}
					</div>
					<Button asChild variant="link" className="justify-start self-start font-semibold">
						<Link href="/kelas">
							Lihat semua kelas <ArrowRight aria-hidden="true" />
						</Link>
					</Button>
				</div>

				{pilihan.length === 0 ? (
					<Empty className="mt-8 border border-dashed">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Utensils aria-hidden="true" />
							</EmptyMedia>
							<EmptyTitle>Jadwal kelas sedang disiapkan</EmptyTitle>
							<EmptyDescription>
								Hubungi Rumah Mama Pintar untuk menanyakan informasi program terbaru.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button asChild variant="outline">
								<a href={whatsapp} target="_blank" rel="noreferrer noopener">
									Hubungi via WhatsApp
								</a>
							</Button>
						</EmptyContent>
					</Empty>
				) : (
					<div className="mt-8">
						<Carousel label="Program kelas yang tersedia" opts={{ align: "start", loop: false }}>
							<CarouselContent>
								{pilihan.map((item, indeks) => {
									const sisa = sisaKuota(item.kuota, item._count.enrollments)
									return (
										<CarouselItem
											key={item.id}
											className="sm:basis-1/2 lg:basis-1/3"
											aria-label={`Kelas ${indeks + 1} dari ${pilihan.length}`}
										>
											<Card className="h-full">
												<CardHeader>
													<div className="flex items-start justify-between gap-3">
														<CardTitle className="text-lg">{item.judul}</CardTitle>
														<Badge variant={sisa > 0 ? "sukses" : "destructive"}>
															{sisa > 0 ? `${sisa} kursi` : "Penuh"}
														</Badge>
													</div>
													<p className="font-heading text-xl font-bold text-foreground">
														{formatRupiah(item.harga.toString())}
													</p>
												</CardHeader>
												<CardContent className="flex flex-1 flex-col gap-4">
													<CardDescription className="line-clamp-3">
														{item.deskripsi || "Informasi materi akan diumumkan oleh admin."}
													</CardDescription>
													<Separator />
													<div className="flex flex-col gap-2">
														<p className="flex items-start gap-2 text-sm text-muted-foreground">
															<Calendar aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
															<span>{formatTanggalWaktu(item.jadwalMulai)} WIB</span>
														</p>
														<p className="flex items-start gap-2 text-sm text-muted-foreground">
															<MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
															<span className="min-w-0 break-words">{item.lokasi}</span>
														</p>
													</div>
												</CardContent>
												<CardFooter className="mt-auto">
													<Button asChild variant="gold" className="w-full">
														<Link href={`/kelas/${item.slug}`}>
															Lihat detail <ChevronRight aria-hidden="true" />
														</Link>
													</Button>
												</CardFooter>
											</Card>
										</CarouselItem>
									)
								})}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
							<CarouselDots className="mt-5" />
						</Carousel>
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

			<section id="cara-daftar" aria-labelledby="judul-cara-daftar" className="scroll-mt-24">
				<Card>
					<CardHeader className="gap-3 pb-0">
						<LabelBagian>Cara pendaftaran</LabelBagian>
						<h2
							id="judul-cara-daftar"
							className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl"
						>
							Empat Langkah untuk Mulai Belajar
						</h2>
					</CardHeader>
					<CardContent className="pt-8">
						<ol className="flex flex-col gap-4">
							{langkahPendaftaran.map((langkah, indeks) => {
								const Ikon = langkah.ikon
								return (
									<li key={langkah.judul}>
										<Card>
											<CardContent className="flex items-start gap-4 p-5">
												<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary font-bold text-foreground">
													{indeks + 1}
												</span>
												<div className="flex min-w-0 flex-col gap-1">
													<div className="flex items-center gap-2">
														<Ikon aria-hidden="true" className="size-4 shrink-0 text-brand" />
														<h3 className="font-heading font-bold text-foreground">
															{langkah.judul}
														</h3>
													</div>
													<p className="text-sm leading-6 text-muted-foreground">
														{langkah.deskripsi}
													</p>
												</div>
											</CardContent>
										</Card>
									</li>
								)
							})}
						</ol>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button asChild size="lg" variant="default">
								<Link href="/kelas">Pilih Kelas</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/daftar">Buat Akun</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Ajakan penutup. Rasa tata letak mengikuti referensi pemilik
			    (sumopod.com): isi terpusat di layar kecil dengan tombol selebar
			    kartu, lalu berubah menjadi teks kiri + aksi kanan mulai `sm`.
			    Yang TIDAK diadopsi dari referensi: warna biru, sudut 16px, dan
			    bayangan `shadow-xl` - identitas tetap near-black + gold, dan
			    DESIGN.md menetapkan blok ajakan memakai radius `xl` (12px) serta
			    permukaan datar tanpa bayangan. */}
			<section aria-labelledby="judul-cta">
				<div className="flex flex-col items-center gap-8 rounded-xl bg-primary px-8 py-16 text-center text-primary-foreground sm:items-start sm:px-10 sm:text-left lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-20">
					<div className="flex max-w-2xl flex-col gap-6">
						<h2 id="judul-cta" className="text-3xl font-bold">
							Siap Memilih Kelas Kuliner?
						</h2>
						<p className="text-lg leading-relaxed text-primary-muted">
							Lihat program yang tersedia atau hubungi Rumah Mama Pintar untuk
							informasi lebih lanjut.
						</p>
					</div>
					<div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:shrink-0">
						<Button asChild size="lg" variant="gold" className="w-full sm:w-auto">
							<Link href="/kelas">Lihat Program</Link>
						</Button>
						<Button asChild size="lg" variant="onDark" className="w-full sm:w-auto">
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
