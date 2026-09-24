"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, LogOut, UserRound } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { aksiKeluar } from "./aksi"
import { cn } from "@/lib/utils"

/**
 * Menu akun terpadu di header dashboard.
 *
 * Menggabungkan akses profil dan tombol keluar ke dalam satu menu, sehingga
 * sidebar tidak lagi memuat dua aksi terpisah. Dipakai oleh peserta maupun
 * admin karena keduanya berbagi tata letak dashboard yang sama.
 */
export function MenuAkun({
	nama,
	email,
	labelPeran,
	hrefProfil,
}: {
	nama: string
	email: string
	labelPeran: string
	hrefProfil: string
}) {
	const [terbuka, setTerbuka] = useState(false)
	const wadahRef = useRef<HTMLDivElement | null>(null)
	const pathname = usePathname()

	// Tutup saat pindah halaman.
	useEffect(() => {
		setTerbuka(false)
	}, [pathname])

	// Tutup saat klik di luar atau tekan Escape.
	useEffect(() => {
		if (!terbuka) return
		function padaKlik(event: MouseEvent) {
			if (wadahRef.current && !wadahRef.current.contains(event.target as Node)) {
				setTerbuka(false)
			}
		}
		function padaTombol(event: KeyboardEvent) {
			if (event.key === "Escape") setTerbuka(false)
		}
		document.addEventListener("mousedown", padaKlik)
		document.addEventListener("keydown", padaTombol)
		return () => {
			document.removeEventListener("mousedown", padaKlik)
			document.removeEventListener("keydown", padaTombol)
		}
	}, [terbuka])

	const inisial =
		nama
			.split(" ")
			.map((bagian) => bagian[0])
			.filter(Boolean)
			.slice(0, 2)
			.join("")
			.toUpperCase() || "U"

	return (
		<div ref={wadahRef} className="relative">
			<button
				type="button"
				onClick={() => setTerbuka((nilai) => !nilai)}
				aria-haspopup="menu"
				aria-expanded={terbuka}
				aria-label="Menu akun"
				className="flex min-h-11 items-center gap-2 rounded-lg px-1.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-3 sm:px-2"
			>
				<span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-secondary-foreground">
					{inisial}
				</span>
				<span className="hidden min-w-0 text-left sm:block">
					<span className="block truncate text-sm font-semibold leading-tight">{nama}</span>
					<span className="block truncate text-xs text-muted-foreground">{labelPeran}</span>
				</span>
				<ChevronDown
					className={cn("size-4 shrink-0 text-muted-foreground transition-transform", terbuka && "rotate-180")}
					aria-hidden="true"
				/>
			</button>

			{terbuka ? (
				<div
					role="menu"
					aria-label="Menu akun"
					className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
				>
					<div className="border-b border-border px-4 py-3">
						<p className="truncate text-sm font-semibold text-foreground">{nama}</p>
						<p className="truncate font-mono text-xs text-muted-foreground">{email}</p>
					</div>
					<div className="p-1.5">
						<Link
							href={hrefProfil}
							role="menuitem"
							className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
							Profil Akun
						</Link>
						<form action={aksiKeluar}>
							<button
								type="submit"
								role="menuitem"
								className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<LogOut className="size-4 shrink-0" aria-hidden="true" />
								Keluar
							</button>
						</form>
					</div>
				</div>
			) : null}
		</div>
	)
}
