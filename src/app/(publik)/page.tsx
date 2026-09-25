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

/** Label bagian di atas permukaan navy memakai token, bukan kelas transparan. */
function LabelBagianTerang({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-muted">
			{children}
		</p>
	)
}

export default async function Beranda() {
	// Kegagalan query kelas tidak boleh meruntuhkan bagian lain halaman ini.
	const kelas = await daftarKelasPublik().catch(() => [])
	const pilihan = kelas.slice(0, 3)
	const whatsapp = identitasRmp.whatsapp.nilai
	const totalKuota = kelas.reduce((jumlah, item) => jumlah + sisaKuota(item.kuota, item._count.enrollments), 0)

	return (
		<div className="flex flex-col gap-16 lg:gap-28">
			{/* Pembuka. Panel navy memberi hierarki tegas pada aksi utama tanpa
			    memakai foto hero buatan. */}
			<section id="beranda" aria-labelledby="judul-beranda" className="scroll-mt-24">
				<div className="overflow-hidden rounded-xl bg-primary px-6 py-16 text-primary-foreground sm:px-10 sm:py-20 lg:px-16 lg:py-24">
					<div className="flex flex-col gap-6 lg:max-w-3xl">
						<LabelBagianTerang>Pelatihan Bisnis Kuliner di Bandar Lampung</LabelBagianTerang>
						<h1
							id="judul-beranda"
							className="text-3xl font-extrabold sm:text-4xl lg:text-display"
						>
							Belajar melalui praktik, siapkan langkah kerja atau usaha
						</h1>
						<p className="max-w-xl text-lg leading-8 text-primary-muted">
							Rumah Mama Pintar menyediakan kursus masakan, roti, kue, dan minuman
							dalam format tatap muka maupun online.
						</p>

						<div className="flex flex-col gap-3 sm:flex-row">
							<Button asChild size="lg" variant="gold">
								<Link href="#program">Lihat Program Kelas</Link>
							</Button>
							<Button asChild size="lg" variant="onDark">
								<a href={whatsapp} target="_blank" rel="noreferrer noopener">
									<MessageCircle aria-hidden="true" /> Konsultasi via WhatsApp
								</a>
							</Button>
						</div>

						<div className="flex flex-col gap-2 text-sm text-primary-muted sm:flex-row sm:gap-6">
							<span className="inline-flex items-center gap-2">
								<MapPin aria-hidden="true" className="size-4" />
								{identitasRmp.kota.nilai}
							</span>
							<span className="inline-flex items-center gap-2">
								<Clock aria-hidden="true" className="size-4" />
								{kelas.length > 0
									? `${kelas.length} kelas aktif · ${totalKuota} kursi tersedia`
									: "Jadwal kelas diperbarui berkala"}
							</span>
						</div>
					</div>
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
					<div className="mt-8 grid gap-5 md:grid-cols-3">
						{pilihan.map((item) => {
							const sisa = sisaKuota(item.kuota, item._count.enrollments)
							return (
								<Card key={item.id} className="h-full">
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
