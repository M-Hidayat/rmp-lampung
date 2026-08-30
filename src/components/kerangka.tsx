import Link from "next/link"
import { ArrowUpRight, ChefHat } from "lucide-react"

import { identitasTampilan } from "@/lib/identitas-rmp"
import { cn } from "@/lib/utils"

export type TautanNavigasi = { href: string; label: string; active?: boolean }

/** Logo Emblem RMP Pintar Lampung dengan desain medali emas kuliner */
export function LogoRmp({ className }: { className?: string }) {
	return (
		<div className={cn("flex items-center gap-3 select-none", className)}>
			<div className="relative flex size-10 items-center justify-center rounded-full bg-linear-to-b from-[#FBF7EE] to-[#F1E5CF] p-0.5 shadow-xs ring-1 ring-[#D49A28]/40 shrink-0">
				<div className="flex size-full items-center justify-center rounded-full border border-[#D49A28] bg-linear-to-b from-[#FFFDF9] to-[#FDF8EE] text-center shadow-inner">
					<div className="flex flex-col items-center justify-center leading-none">
						<div className="flex items-center gap-0.5 text-[6px] text-[#B87B1A]">
							<span>★</span>
							<span>★</span>
							<span>★</span>
						</div>
						<span className="font-serif text-[10px] font-extrabold tracking-wider text-[#854D0E]">
							RMP
						</span>
						<span className="text-[5px] font-bold uppercase tracking-widest text-[#B87B1A]">
							KULINER
						</span>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<span className="text-base font-bold tracking-tight text-zinc-950 font-heading">
					RMP Pintar Lampung
				</span>
			</div>
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
		<header className="sticky top-0 z-40 border-b border-[#EFECE6] bg-white/95 backdrop-blur-xs">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
				<Link
					href="/"
					className="transition-opacity hover:opacity-90"
				>
					<LogoRmp />
				</Link>
				<nav aria-label="Navigasi utama">
					<ul className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-zinc-700">
						{tautan.map((item) => (
							<li key={item.href} className="relative">
								<Link
									href={item.href}
									className={cn(
										"relative inline-flex items-center px-3.5 py-2 transition-colors hover:text-zinc-950 text-sm font-medium",
										item.active
											? "font-semibold text-zinc-950 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-[#D49A28] after:rounded-full"
											: "text-zinc-600"
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

export function KakiHalaman() {
	return (
		<footer className="mt-20 border-t border-[#EFECE6] bg-[#FAF8F5] text-xs sm:text-sm text-zinc-600">
			<div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
				<div className="space-y-3 lg:col-span-2">
					<LogoRmp />
					<p className="max-w-md text-xs leading-relaxed text-zinc-500 pt-1">
						Pusat pelatihan keterampilan kuliner profesional di Bandar Lampung. Pelatihan praktik langsung di dapur komersial dengan sertifikasi kelulusan resmi.
					</p>
					<p className="text-xs text-zinc-400 pt-1">
						© {new Date().getFullYear()} {identitasTampilan.nama}. Hak cipta dilindungi.
					</p>
				</div>
				<div>
					<p className="font-semibold text-zinc-950 text-sm">Kontak & Lokasi</p>
					<div className="mt-3 space-y-1.5 text-xs text-zinc-500">
						<p className="leading-relaxed">{identitasTampilan.alamat}</p>
						<p>Telepon: <span className="font-medium text-zinc-800">{identitasTampilan.telepon}</span></p>
						<p>Email: <span className="font-medium text-zinc-800">{identitasTampilan.email}</span></p>
					</div>
				</div>
				<div>
					<p className="font-semibold text-zinc-950 text-sm">Akses Cepat</p>
					<ul className="mt-3 space-y-1.5 text-xs text-zinc-500">
						<li>
							<Link className="inline-flex items-center gap-1 hover:text-zinc-950 hover:underline transition-colors" href="/kelas">
								Katalog Kursus <ArrowUpRight className="size-3 opacity-60" />
							</Link>
						</li>
						<li>
							<Link className="inline-flex items-center gap-1 hover:text-zinc-950 hover:underline transition-colors" href="/cara-pendaftaran">
								Cara Pendaftaran <ArrowUpRight className="size-3 opacity-60" />
							</Link>
						</li>
						<li>
							<Link className="inline-flex items-center gap-1 hover:text-zinc-950 hover:underline transition-colors" href="/verifikasi">
								Verifikasi Sertifikat <ArrowUpRight className="size-3 opacity-60" />
							</Link>
						</li>
						<li>
							<Link className="inline-flex items-center gap-1 hover:text-zinc-950 hover:underline transition-colors" href="/profil">
								Profil Lembaga <ArrowUpRight className="size-3 opacity-60" />
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	)
}

export function JudulHalaman({
	judul,
	keterangan,
	className,
}: {
	judul: string
	keterangan?: string
	className?: string
}) {
	return (
		<div className={cn("space-y-1 pb-2", className)}>
			<h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
				{judul}
			</h1>
			{keterangan ? (
				<p className="text-sm text-zinc-500 max-w-3xl leading-relaxed">{keterangan}</p>
			) : null}
		</div>
	)
}

export function KartuStatistik({
	label,
	nilai,
}: {
	label: string
	nilai: string | number
}) {
	return (
		<div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
			<p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
				{label}
			</p>
			<p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
				{nilai}
			</p>
		</div>
	)
}
