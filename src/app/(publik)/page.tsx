import Image from "next/image"
import Link from "next/link"
import {
	Award,
	Calendar,
	ChefHat,
	Clock,
	GraduationCap,
	Users,
	ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TestimoniAlumni } from "@/components/testimoni-alumni"
import { daftarKelasPublik, sisaKuota } from "@/lib/layanan/kelas"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const dynamic = "force-dynamic"

export default async function Beranda() {
	const kelasDb = await daftarKelasPublik()

	// 3 Kelas Pilihan utama dari mockup referensi
	const kelasPilihan = [
		{
			id: "baking-dasar",
			slug: kelasDb[0]?.slug || "baking-dasar",
			judul: kelasDb[0]?.judul || "Baking Dasar",
			deskripsi: "Belajar teknik dasar baking untuk pemula hingga mahir.",
			pertemuan: "12 Pertemuan",
			gambar: "/images/baking-dasar.jpg",
			harga: kelasDb[0]?.harga.toString() || "450000",
			sisa: kelasDb[0] ? sisaKuota(kelasDb[0].kuota, kelasDb[0]._count.enrollments) : 5,
		},
		{
			id: "kue-tradisional",
			slug: kelasDb[1]?.slug || "kue-tradisional",
			judul: kelasDb[1]?.judul || "Kue Tradisional",
			deskripsi: "Aneka kue tradisional favorit dengan cita rasa autentik.",
			pertemuan: "10 Pertemuan",
			gambar: "/images/kue-tradisional.jpg",
			harga: kelasDb[1]?.harga.toString() || "350000",
			sisa: kelasDb[1] ? sisaKuota(kelasDb[1].kuota, kelasDb[1]._count.enrollments) : 8,
		},
		{
			id: "tata-boga-profesional",
			slug: kelasDb[2]?.slug || "tata-boga-profesional",
			judul: kelasDb[2]?.judul || "Tata Boga Profesional",
			deskripsi: "Kuasai teknik memasak untuk dunia kerja profesional.",
			pertemuan: "16 Pertemuan",
			gambar: "/images/tata-boga.jpg",
			harga: kelasDb[2]?.harga.toString() || "650000",
			sisa: kelasDb[2] ? sisaKuota(kelasDb[2].kuota, kelasDb[2]._count.enrollments) : 4,
		},
	]

	// Jadwal Terdekat
	const jadwalTerdekat = [
		{
			id: "j1",
			hari: "26",
			bulan: "Mei",
			judul: "Baking Dasar – Batch 24",
			waktu: "Senin, 26 Mei 2025 \u2022 08.30 \u2013 12.30 WIB",
			status: "Tersedia",
		},
		{
			id: "j2",
			hari: "02",
			bulan: "Jun",
			judul: "Kue Tradisional – Batch 18",
			waktu: "Senin, 2 Juni 2025 \u2022 08.30 \u2013 12.30 WIB",
			status: "Tersedia",
		},
		{
			id: "j3",
			hari: "09",
			bulan: "Jun",
			judul: "Tata Boga Profesional – Batch 15",
			waktu: "Senin, 9 Juni 2025 \u2022 08.30 \u2013 14.30 WIB",
			status: "Tersedia",
		},
	]

	return (
		<div className="space-y-10 sm:space-y-12">
			{/* 1. Hero Section — Split 2 Kolom Sesuai Mockup */}
			<section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 pt-2">
				{/* Kolom Kiri: Teks & Aksi */}
				<div className="space-y-5 lg:col-span-6">
					<p className="text-xs sm:text-sm font-bold tracking-widest text-[#B47517] uppercase font-heading">
						KURSUS KULINER PROFESIONAL
					</p>

					<h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-zinc-950 leading-[1.15] font-heading">
						<span className="sr-only">Kursus kuliner RMP Pintar Lampung — </span>
						Belajar Kuliner,<br />
						Siap Kerja &amp; Usaha
					</h1>

					<p className="text-sm sm:text-base text-zinc-600 max-w-lg leading-relaxed">
						Pelatihan praktik langsung bersama instruktur berpengalaman di Bandar Lampung.
					</p>

					<div className="flex flex-wrap items-center gap-3 pt-2">
						<Button
							asChild
							size="lg"
							variant="gold"
							className="rounded-lg px-6 py-2.5 font-semibold text-white shadow-xs"
						>
							<Link href="/kelas">Lihat Kelas</Link>
						</Button>

						<Button
							asChild
							size="lg"
							variant="gold-outline"
							className="rounded-lg px-6 py-2.5 font-semibold"
						>
							<Link href="/daftar">Daftar Sekarang</Link>
						</Button>
					</div>
				</div>

				{/* Kolom Kanan: Foto Hero Dapur & Chef */}
				<div className="lg:col-span-6">
					<div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#EFECE6] shadow-md bg-[#FAF5EB]">
						<Image
							src="/images/hero-culinary.jpg"
							alt="Pelatihan Kursus Kuliner RMP Pintar Lampung"
							fill
							priority
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>
				</div>
			</section>

			{/* 2. Floating Stats Bar (Value Propositions Strip) */}
			<section className="rounded-2xl border border-[#EFECE6] bg-white p-5 sm:p-6 shadow-xs">
				<div className="grid grid-cols-1 gap-6 divide-y sm:grid-cols-3 sm:gap-4 sm:divide-y-0 sm:divide-x divide-[#F0ECE1]">
					{/* Stat 1: 20+ Kelas */}
					<div className="flex items-center gap-4 sm:justify-center">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FDF8ED] text-[#D49A28]">
							<GraduationCap className="size-6" />
						</div>
						<div>
							<p className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-heading leading-tight">
								20+
							</p>
							<p className="text-xs font-medium text-zinc-500">
								Kelas
							</p>
						</div>
					</div>

					{/* Stat 2: 500+ Alumni */}
					<div className="flex items-center gap-4 pt-4 sm:pt-0 sm:justify-center">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FDF8ED] text-[#D49A28]">
							<Users className="size-6" />
						</div>
						<div>
							<p className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-heading leading-tight">
								500+
							</p>
							<p className="text-xs font-medium text-zinc-500">
								Alumni
							</p>
						</div>
					</div>

					{/* Stat 3: Sertifikat Resmi & Diakui */}
					<div className="flex items-center gap-4 pt-4 sm:pt-0 sm:justify-center">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FDF8ED] text-[#D49A28]">
							<Award className="size-6" />
						</div>
						<div>
							<p className="text-lg sm:text-xl font-extrabold text-zinc-950 font-heading leading-tight">
								Sertifikat
							</p>
							<p className="text-xs font-medium text-zinc-500">
								Resmi &amp; Diakui
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Grid Konten 3-Bagian (Kelas Pilihan, Jadwal Terdekat, Testimoni Alumni) */}
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
				{/* Kolom 1: Kelas Pilihan (Lg: Col 5) */}
				<div className="rounded-2xl border border-[#EFECE6] bg-white p-5 shadow-xs flex flex-col justify-between lg:col-span-5 space-y-4">
					<div>
						<div className="flex items-center justify-between pb-3 border-b border-[#F5F3EF]">
							<h2 className="text-base font-bold text-zinc-950 font-heading">
								Kelas Pilihan
							</h2>
							<Link
								href="/kelas"
								className="text-xs font-medium text-[#B47517] hover:text-[#854D0E] inline-flex items-center gap-1 transition-colors"
							>
								<span>Lihat semua kelas</span>
								<span>&rarr;</span>
							</Link>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
							{kelasPilihan.map((item) => (
								<Link
									key={item.id}
									href={`/kelas/${item.slug}`}
									className="group flex flex-col overflow-hidden rounded-xl border border-[#EFECE6] bg-white transition-all hover:border-[#D49A28]/40 hover:shadow-xs"
								>
									<div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF5EB]">
										<Image
											src={item.gambar}
											alt={item.judul}
											fill
											className="object-cover transition-transform duration-300 group-hover:scale-105"
											sizes="(max-width: 768px) 100vw, 20vw"
										/>
									</div>
									<div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
										<div>
											<h3 className="text-xs font-bold text-zinc-950 group-hover:text-[#B47517] transition-colors line-clamp-1">
												{item.judul}
											</h3>
											<p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mt-0.5">
												{item.deskripsi}
											</p>
										</div>
										<div className="pt-1 flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
											<Clock className="size-3 text-[#D49A28]" />
											<span>{item.pertemuan}</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>

				{/* Kolom 2: Jadwal Terdekat (Lg: Col 4) */}
				<div className="rounded-2xl border border-[#EFECE6] bg-white p-5 shadow-xs flex flex-col justify-between lg:col-span-4 space-y-4">
					<div>
						<div className="flex items-center justify-between pb-3 border-b border-[#F5F3EF]">
							<h2 className="text-base font-bold text-zinc-950 font-heading">
								Jadwal Terdekat
							</h2>
							<Link
								href="/kelas"
								className="text-xs font-medium text-[#B47517] hover:text-[#854D0E] inline-flex items-center gap-1 transition-colors"
							>
								<span>Lihat semua jadwal</span>
								<span>&rarr;</span>
							</Link>
						</div>

						<div className="space-y-3 pt-3">
							{jadwalTerdekat.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between gap-3 rounded-xl border border-[#F0ECE1] bg-[#FAF8F5]/60 p-2.5 transition-colors hover:bg-[#FAF8F5]"
								>
									{/* Date block */}
									<div className="flex size-11 flex-col items-center justify-center rounded-lg border border-[#E8DFC8] bg-white text-center shadow-2xs shrink-0">
										<span className="text-sm font-extrabold text-zinc-950 leading-none">
											{item.hari}
										</span>
										<span className="text-[9px] font-bold text-zinc-500 uppercase mt-0.5">
											{item.bulan}
										</span>
									</div>

									{/* Schedule info */}
									<div className="min-w-0 flex-1 space-y-0.5">
										<p className="text-xs font-bold text-zinc-950 truncate">
											{item.judul}
										</p>
										<p className="text-[10px] text-zinc-500 truncate">
											{item.waktu}
										</p>
									</div>

									{/* Badge */}
									<div className="shrink-0">
										<span className="inline-flex items-center rounded-md border border-[#FDE68A] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-semibold text-[#92400E]">
											{item.status}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Kolom 3: Testimoni Alumni (Lg: Col 3) */}
				<div className="lg:col-span-3">
					<TestimoniAlumni />
				</div>
			</section>

			{/* 4. Bottom Banner CTA Strip */}
			<section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#D49A28] via-[#C88A22] to-[#B87B1A] px-6 py-6 sm:px-8 sm:py-7 text-white shadow-sm">
				{/* Chef Hat Watermark Background */}
				<div className="pointer-events-none absolute -left-6 -bottom-6 opacity-15">
					<ChefHat className="size-44 text-white" strokeWidth={1.5} />
				</div>

				<div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-3 text-center sm:text-left">
						<div className="hidden sm:flex size-10 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
							<ChefHat className="size-5" />
						</div>
						<p className="text-base sm:text-lg md:text-xl font-bold tracking-tight font-heading text-white">
							Mulai perjalanan kulinermu bersama RMP.
						</p>
					</div>

					<Button
						asChild
						size="lg"
						className="bg-[#FFFDF9] text-[#854D0E] hover:bg-white hover:text-[#713F12] font-bold rounded-xl px-6 py-2.5 shadow-xs shrink-0 cursor-pointer border-0"
					>
						<Link href="/daftar">Daftar Sekarang</Link>
					</Button>
				</div>
			</section>
		</div>
	)
}
