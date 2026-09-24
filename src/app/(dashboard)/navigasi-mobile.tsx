"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Award, BookOpen, CreditCard, FileText, LayoutDashboard, LogOut, Menu, QrCode, User, UserRound, Users, X } from "lucide-react"
import { useEffect, useState } from "react"

import { aksiKeluar } from "./aksi"
import { cn } from "@/lib/utils"

export type ItemMenuDashboard = {
	href: string
	label: string
	ikon: keyof typeof ikonMenu
}

const ikonMenu = {
	dashboard: LayoutDashboard,
	kelas: BookOpen,
	pembayaran: CreditCard,
	qr: QrCode,
	dokumen: FileText,
	sertifikat: Award,
	profil: User,
	peserta: Users,
}

export function TautanDashboard({ item, onClick }: { item: ItemMenuDashboard; onClick?: () => void }) {
	const pathname = usePathname()
	const punyaHalamanTurunan = item.href.split("/").filter(Boolean).length > 1
	const aktif = pathname === item.href || (punyaHalamanTurunan && pathname.startsWith(`${item.href}/`))
	const Ikon = ikonMenu[item.ikon]

	return (
		<Link
			href={item.href}
			aria-current={aktif ? "page" : undefined}
			className={cn(
				"flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				aktif
					? "bg-zinc-100 font-semibold text-zinc-950"
					: "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
			)}
			onClick={onClick}
		>
			<Ikon className="size-5 shrink-0" aria-hidden="true" />
			<span>{item.label}</span>
		</Link>
	)
}

export function NavigasiMobile({
	items,
	labelPeran,
	hrefProfil,
}: {
	items: ItemMenuDashboard[]
	labelPeran: string
	hrefProfil: string
}) {
	const [terbuka, setTerbuka] = useState(false)

	// Escape harus didengarkan pada document. Sebelumnya dipasang lewat
	// onKeyDown pada <div> yang tidak fokusable sehingga tidak pernah aktif.
	useEffect(() => {
		if (!terbuka) return
		function padaTombol(event: KeyboardEvent) {
			if (event.key === "Escape") setTerbuka(false)
		}
		document.addEventListener("keydown", padaTombol)
		// Cegah halaman di belakang drawer ikut ter-scroll.
		const sebelumnya = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return () => {
			document.removeEventListener("keydown", padaTombol)
			document.body.style.overflow = sebelumnya
		}
	}, [terbuka])

	return (
		<>
			<button
				type="button"
				className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
				aria-label="Buka menu navigasi"
				aria-expanded={terbuka}
				onClick={() => setTerbuka(true)}
			>
				<Menu className="size-5" aria-hidden="true" />
			</button>
			{terbuka ? (
				<div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu navigasi">
					<button
						type="button"
						className="absolute inset-0 bg-slate-950/50"
						aria-label="Tutup menu navigasi"
						onClick={() => setTerbuka(false)}
					/>
					<aside className="absolute inset-y-0 left-0 flex h-dvh min-h-0 w-[min(20rem,88vw)] flex-col bg-card shadow-xl">
						<div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-6">
							<div className="min-w-0">
								<p className="truncate font-heading text-sm font-bold text-foreground">Rumah Mama Pintar</p>
								<p className="truncate text-xs text-muted-foreground">Panel {labelPeran}</p>
							</div>
							<button
								type="button"
								className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								aria-label="Tutup menu"
								onClick={() => setTerbuka(false)}
							>
								<X className="size-5" aria-hidden="true" />
							</button>
						</div>
						{/* min-h-0 wajib: tanpa ini flex-1 tidak dapat menyusut sehingga
						    nav meluber dan tombol Keluar terdorong ke luar layar pada
						    viewport pendek. Sidebar desktop sudah memakai pola yang sama. */}
						<nav aria-label="Navigasi dashboard" className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
							{items.map((item) => (
								<TautanDashboard key={item.href} item={item} onClick={() => setTerbuka(false)} />
							))}
						</nav>
						<div className="shrink-0 border-t border-border p-3">
							<Link
								href={hrefProfil}
								onClick={() => setTerbuka(false)}
								className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> Profil Akun
							</Link>
							<form action={aksiKeluar}>
								<button
									type="submit"
									className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-destructive transition-colors duration-200 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									<LogOut className="size-4" aria-hidden="true" /> Keluar
								</button>
							</form>
						</div>
					</aside>
				</div>
			) : null}
		</>
	)
}
