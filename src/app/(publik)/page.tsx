import type { Metadata } from "next"
import Link from "next/link"
import {
	ArrowRight,
	Calendar,
	ChevronRight,
	Clock,
	Layers,
	MapPin,
	MessageCircle,
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

const langkahPendaftaran = [
	{
		judul: "Pilih program",
		deskripsi: "Lihat daftar kelas, jadwal, lokasi, dan sisa kuota yang tersedia.",
		ikon: Layers,
	},
	{
		judul: "Buat akun",
		deskripsi: "Daftar dengan email agar riwayat kelas dan pembayaran tercatat.",
		ikon: UserPlus,
	},
	{
		judul: "Selesaikan pembayaran",
		deskripsi: "Lanjutkan pembayaran setelah memilih kelas yang sesuai.",
		ikon: MessageCircle,
	},
	{
		judul: "Ikuti kelas",
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
			{/* Pembuka. Permukaan putih bersih dengan isi terpusat; penekanan aksi
			    dibawa oleh tombol, bukan oleh latar panel gelap. */}
			<section id="beranda" aria-labelledby="judul-beranda" className="scroll-mt-24">
				<div className="flex flex-col items-center gap-6 text-center">
					<h1
						id="judul-beranda"
						className="max-w-3xl text-balance text-3xl font-extrabold text-foreground sm:text-4xl lg:text-display"
					>
						Belajar melalui praktik, siapkan langkah kerja atau usaha
					</h1>

					<Button asChild size="lg" variant="gold">
						<Link href="#program">Lihat Program Kelas</Link>
					</Button>
				</div>
			</section>

			{/* Program dari data nyata aplikasi, bukan daftar duplikat. */}
			<section id="program" aria-labelledby="judul-program" className="scroll-mt-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex max-w-2xl flex-col gap-3">
						<LabelBagian>Program pilihan</LabelBagian>
						<h2 id="judul-program" className="text-2xl font-bold text-foreground sm:text-3xl">
							Temukan kelas yang sesuai
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
							Empat langkah untuk mulai belajar
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

			<section aria-labelledby="judul-cta">
				<div className="flex flex-col items-start gap-8 rounded-xl bg-primary px-6 py-14 text-primary-foreground sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex max-w-2xl flex-col gap-3">
						<h2 id="judul-cta" className="text-2xl font-bold sm:text-3xl">
							Siap memilih kelas kuliner?
						</h2>
						<p className="leading-7 text-primary-muted">
							Lihat program yang tersedia atau hubungi Rumah Mama Pintar untuk
							informasi lebih lanjut.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button asChild size="lg" variant="gold">
							<Link href="/kelas">Lihat Program</Link>
						</Button>
						<Button asChild size="lg" variant="onDark">
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
