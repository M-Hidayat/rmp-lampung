import type { Metadata } from "next"
import Image from "next/image"
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

import hero from "../../../public/images/hero-culinary.jpg"
import { Button } from "@/components/ui/button"
import { BuktiPublik, GaleriKegiatan } from "@/components/bukti-publik"
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
		judul: "Belajar lebih terarah",
		deskripsi: "Materi dan jadwal disajikan dengan jelas pada setiap kelas.",
		ikon: BookOpenCheck,
	},
	{
		judul: "Berbasis praktik",
		deskripsi: "Proses belajar berfokus pada pengembangan keterampilan yang dapat diterapkan.",
		ikon: Utensils,
	},
	{
		judul: "Administrasi dalam satu sistem",
		deskripsi: "Pendaftaran, status pembayaran, absensi, invoice, dan sertifikat dikelola melalui akun peserta sesuai ketersediaannya.",
		ikon: MonitorCheck,
	},
]

const langkahPendaftaran = [
	{
		judul: "Pilih kelas",
		deskripsi: "Periksa materi, jadwal, biaya, lokasi, dan ketersediaan kuota.",
	},
	{
		judul: "Buat akun dan daftar",
		deskripsi: "Lengkapi akun peserta, lalu kirim pendaftaran pada kelas pilihan.",
	},
	{
		judul: "Selesaikan pembayaran",
		deskripsi: "Gunakan kanal pembayaran yang tersedia dan tunggu konfirmasi sistem.",
	},
	{
		judul: "Ikuti kelas",
		deskripsi: "Invoice dan sertifikat tersedia sesuai status pembayaran, kehadiran, dan penerbitan admin.",
	},
]

const whatsapp = identitasRmp.whatsapp.nilai

export default async function Beranda() {
	const kelas = await daftarKelasPublik().catch(() => [])
	const pilihan = kelas.slice(0, 3)

	return (
		<div className="space-y-16 pb-4 sm:space-y-20 lg:space-y-24">
			<section
				id="beranda"
				aria-labelledby="judul-beranda"
				className="scroll-mt-24 pt-2"
			>
				<div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
					<div className="space-y-6 lg:col-span-6">
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
							Pelatihan Bisnis Kuliner di Bandar Lampung
						</p>
						<h1
							id="judul-beranda"
							className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl"
						>
							Belajar melalui praktik, siapkan langkah kerja atau usaha
						</h1>
						<p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
							Rumah Mama Pintar menyediakan kursus masakan, roti, kue, dan minuman dalam format tatap muka maupun online.
						</p>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Button asChild size="lg" variant="gold">
								<Link href="#program">Lihat Program Kelas</Link>
							</Button>
							<Button asChild size="lg" variant="gold-outline">
								<a href={whatsapp} target="_blank" rel="noreferrer noopener">
									<MessageCircle aria-hidden="true" /> Konsultasi via WhatsApp
								</a>
							</Button>
						</div>
						<div className="flex flex-col gap-2 border-l-4 border-primary pl-4 text-sm text-zinc-600 sm:flex-row sm:gap-6">
							<span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-primary" />{identitasRmp.kota.nilai}</span>
						</div>
					</div>
					<div className="lg:col-span-6">
						<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-orange-50 shadow-sm">
							<Image src={hero} alt="Kegiatan pelatihan kuliner Rumah Mama Pintar" fill priority placeholder="blur" className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
						</div>
					</div>
				</div>
				<div className="mt-10 grid gap-4 sm:grid-cols-3">
					{keunggulan.map(({ judul, deskripsi, ikon: Ikon }) => (
						<article key={judul} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
							<div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-primary"><Ikon aria-hidden="true" className="size-5" /></div>
							<h2 className="mt-4 font-heading text-base font-bold text-zinc-950">{judul}</h2>
							<p className="mt-2 text-sm leading-6 text-zinc-600">{deskripsi}</p>
						</article>
					))}
				</div>
			</section>

			<section id="program" aria-labelledby="judul-program" className="scroll-mt-24 space-y-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-2xl">
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Program pilihan</p>
						<h2 id="judul-program" className="mt-2 font-heading text-2xl font-bold text-zinc-950 sm:text-3xl">Temukan kelas yang sesuai</h2>
						<p className="mt-2 text-sm leading-6 text-zinc-600">Periksa jadwal, biaya, lokasi, dan kuota sebelum mendaftar.</p>
					</div>
					<Link href="/kelas" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Lihat semua kelas <ArrowRight aria-hidden="true" className="size-4" /></Link>
				</div>
				{pilihan.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center sm:p-12">
						<ChefHat aria-hidden="true" className="mx-auto size-9 text-primary" />
						<h3 className="mt-4 font-heading font-bold text-zinc-950">Jadwal kelas sedang disiapkan</h3>
						<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">Hubungi Rumah Mama Pintar untuk menanyakan informasi program terbaru.</p>
						<Button asChild variant="gold-outline" className="mt-5"><a href={whatsapp} target="_blank" rel="noreferrer noopener">Hubungi via WhatsApp</a></Button>
					</div>
				) : (
					<div className="grid gap-5 md:grid-cols-3">
						{pilihan.map((item) => {
							const sisa = sisaKuota(item.kuota, item._count.enrollments)
							return (
								<article key={item.id} className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
									<div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
										<h3 className="font-heading font-bold text-zinc-950">{item.judul}</h3>
										<span className="shrink-0 text-sm font-bold text-primary">{formatRupiah(item.harga.toString())}</span>
									</div>
									<p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{item.deskripsi || "Informasi materi akan diumumkan oleh admin."}</p>
									<div className="mt-5 space-y-3 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
										<p className="flex items-start gap-2"><Calendar aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /><span>{formatTanggalWaktu(item.jadwalMulai)} WIB</span></p>
										<p className="flex items-start gap-2"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /><span className="min-w-0 break-words">{item.lokasi}</span></p>
									</div>
									<div className="mt-auto flex flex-col items-stretch gap-3 pt-6 xl:flex-row xl:items-center xl:justify-between">
										<span className="text-xs font-medium text-zinc-600">{sisa > 0 ? `${sisa} kursi tersisa` : "Kelas penuh"}</span>
										<Button asChild size="sm" variant="gold" className="min-h-11 w-full xl:w-auto">
											<Link href={`/kelas/${item.slug}`}>Lihat detail</Link>
										</Button>
									</div>
								</article>
							)
						})}
					</div>
				)}
			</section>

			<section id="cara-daftar" aria-labelledby="judul-cara-daftar" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white px-5 py-10 text-zinc-950 shadow-sm sm:px-8 lg:px-10">
				<div className="max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Cara pendaftaran</p>
					<h2 id="judul-cara-daftar" className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Empat langkah untuk mulai belajar</h2>
				</div>
				<ol className="mt-8 max-w-3xl">
					{langkahPendaftaran.map((langkah, indeks) => (
						<li key={langkah.judul} className="relative flex gap-4 pb-5 last:pb-0 sm:gap-5">
							{indeks < langkahPendaftaran.length - 1 ? <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 border-l-2 border-orange-200" /> : null}
							<span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-600 font-bold text-white shadow-sm" aria-hidden="true">{indeks + 1}</span>
							<div className="min-w-0 flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
								<h3 className="font-heading font-bold">{langkah.judul}</h3>
								<p className="mt-2 text-sm leading-6 text-zinc-600">{langkah.deskripsi}</p>
							</div>
						</li>
					))}
				</ol>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Button asChild size="lg" variant="gold"><Link href="/kelas">Pilih Kelas</Link></Button>
					<Button asChild size="lg" variant="outline"><Link href="/daftar">Buat Akun</Link></Button>
				</div>
			</section>

			{/* Bukti pihak ketiga: liputan media, institusi pendidikan, organisasi.
			    Semua tautan mengarah ke sumber asli agar dapat diperiksa sendiri. */}
			<BuktiPublik />

			{/* Galeri dokumentasi. Saat ini belum ada foto asli dari pemilik, jadi
			    komponen menampilkan keadaan kosong yang jujur (bukan gambar stok). */}
			<GaleriKegiatan />

			<section aria-labelledby="judul-cta" className="rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-zinc-950 shadow-sm sm:px-10 sm:py-12">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div className="max-w-2xl"><h2 id="judul-cta" className="font-heading text-2xl font-bold sm:text-3xl">Siap memilih kelas kuliner?</h2><p className="mt-3 leading-7 text-zinc-600">Lihat program yang tersedia atau hubungi Rumah Mama Pintar untuk informasi lebih lanjut.</p></div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button asChild size="lg" variant="gold"><Link href="/kelas">Lihat Katalog</Link></Button>
						<Button asChild size="lg" variant="outline"><a href={whatsapp} target="_blank" rel="noreferrer noopener">WhatsApp Rumah Mama Pintar</a></Button>
					</div>
				</div>
			</section>
		</div>
	)
}
