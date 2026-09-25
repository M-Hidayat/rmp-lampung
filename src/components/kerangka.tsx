import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"

import { identitasTampilan } from "@/lib/identitas-rmp"
import { cn } from "@/lib/utils"

export type TautanNavigasi = { href: string; label: string; active?: boolean }

/**
 * Label bagian. Satu bentuk untuk seluruh aplikasi: huruf besar, tracking lebar,
 * warna crimson identitas (`brand`), ukuran `caption`.
 *
 * Semua judul bagian memakai komponen ini agar tidak ada lagi campuran
 * `text-accent-foreground`, `text-muted-foreground`, dan warna mentah.
 */
export function LabelBagian({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<p
			className={cn(
				"text-xs font-bold uppercase tracking-[0.16em] text-brand",
				className,
			)}
		>
			{children}
		</p>
	)
}

/**
 * Logo resmi Rumah Mama Pintar.
 *
 * Memakai berkas logo asli yang diberikan pemilik (`/images/logo.jpg`).
 */
export function LogoRmp({ className }: { className?: string }) {
	return (
		<div className={cn("flex select-none items-center gap-3", className)}>
			<Image
				src="/images/logo.jpg"
				alt="Logo Rumah Mama Pintar"
				width={80}
				height={80}
				className="size-10 shrink-0 rounded-md object-cover"
				priority
			/>
			<span className="font-heading text-base font-bold tracking-tight text-foreground">
				Rumah Mama Pintar
			</span>
		</div>
	)
}

/** Kepala halaman dengan navigasi utama yang bersih, modern & accessible. */
export function KepalaHalaman({
	tautan,
	aksi,
}: {
	tautan: TautanNavigasi[]
	aksi?: React.ReactNode
}) {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xs">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
				<Link href="/" className="inline-flex min-h-11 items-center transition-opacity hover:opacity-90">
					<LogoRmp />
				</Link>
				<nav aria-label="Navigasi utama">
					<ul className="flex items-center gap-1 text-sm font-medium text-muted-foreground sm:gap-2">
						{tautan.map((item) => (
							<li key={item.href} className="relative">
								<Link
									href={item.href}
									className={cn(
										"relative inline-flex min-h-11 items-center px-3.5 py-2 text-sm font-medium transition-colors hover:text-foreground",
										item.active
											? "font-semibold text-foreground after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:rounded-full after:bg-brand"
											: "text-muted-foreground",
									)}
								>
									{item.label}
								</Link>
							</li>
						))}
						{aksi ? <li className="pl-3">{aksi}</li> : null}
					</ul>
				</nav>
			</div>
		</header>
	)
}

function TautanKaki({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link
			className="inline-flex min-h-11 items-center gap-1 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			href={href}
		>
			{children}
			<ArrowUpRight aria-hidden="true" className="size-3 opacity-60" />
		</Link>
	)
}

export function KakiHalaman() {
	return (
		<footer className="mt-20 border-t border-border bg-card">
			<div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
				<div className="flex flex-col gap-4 lg:col-span-2">
					<LogoRmp />
					<p className="max-w-md text-sm leading-relaxed text-muted-foreground">
						Pelatihan bisnis kuliner di Bandar Lampung dengan pilihan kursus
						masakan, roti, kue, dan minuman.
					</p>
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} {identitasTampilan.nama}. Hak cipta dilindungi.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<p className="text-sm font-bold text-foreground">Kontak & Lokasi</p>
					<ul className="flex flex-col gap-3 text-sm text-muted-foreground">
						<li className="flex gap-2">
							<MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand" />
							<span className="leading-relaxed">{identitasTampilan.alamat}</span>
						</li>
						<li className="flex gap-2">
							<Phone aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand" />
							<span className="font-medium text-foreground">{identitasTampilan.telepon}</span>
						</li>
						<li className="flex gap-2">
							<Mail aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand" />
							<span className="break-all font-medium text-foreground">{identitasTampilan.email}</span>
						</li>
					</ul>
				</div>

				<div className="flex flex-col gap-1">
					<p className="text-sm font-bold text-foreground">Akses Cepat</p>
					<ul className="flex flex-col">
						<li><TautanKaki href="/kelas">Katalog Kursus</TautanKaki></li>
						<li><TautanKaki href="/cara-pendaftaran">Cara Pendaftaran</TautanKaki></li>
						<li><TautanKaki href="/verifikasi">Verifikasi Sertifikat</TautanKaki></li>
						<li><TautanKaki href="/profil">Profil Lembaga</TautanKaki></li>
						<li><TautanKaki href="/kontak">Kontak</TautanKaki></li>
					</ul>
				</div>
			</div>
		</footer>
	)
}

/**
 * Judul halaman.
 *
 * Menyediakan tepat satu `h1` per halaman serta satu kalimat pengantar, dan
 * sengaja tidak memakai dekorasi agar hierarki judul tetap sederhana.
 */
export function JudulHalaman({
	judul,
	keterangan,
	labels,
	className,
}: {
	judul: string
	keterangan?: string
	labels?: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn("flex flex-col gap-3 pb-2", className)}>
			{labels}
			<h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
				{judul}
			</h1>
			{keterangan ? (
				<p className="max-w-2xl text-base leading-7 text-muted-foreground">{keterangan}</p>
			) : null}
		</div>
	)
}

/** Kartu statistik ringkas untuk laporan dan dashboard. */
export function KartuStatistik({
	label,
	nilai,
}: {
	label: string
	nilai: string | number
}) {
	return (
		<div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-6">
			<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
				{label}
			</p>
			<p className="font-heading text-2xl font-bold tracking-tight text-foreground">
				{nilai}
			</p>
		</div>
	)
}