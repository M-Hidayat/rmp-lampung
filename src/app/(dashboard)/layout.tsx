import Link from "next/link"
import { redirect } from "next/navigation"
import {
	LogOut,
} from "lucide-react"

import { aksiKeluar } from "./aksi"
import { NavigasiMobile, TautanDashboard } from "./navigasi-mobile"
import { sesiPengguna } from "@/lib/auth"
import { identitasTampilan } from "@/lib/identitas-rmp"

type ItemMenu = {
	href: string
	label: string
	ikon: "dashboard" | "kelas" | "pembayaran" | "qr" | "dokumen" | "sertifikat" | "profil" | "peserta"
}

export default async function TataLetakDashboard({ children }: { children: React.ReactNode }) {
	const sesi = await sesiPengguna()
	if (!sesi) redirect("/masuk")

	const menuPeserta: ItemMenu[] = [
		{ href: "/user", label: "Dashboard", ikon: "dashboard" },
		{ href: "/user/kelas-saya", label: "Kelas Saya", ikon: "kelas" },
		{ href: "/user/pembayaran", label: "Pembayaran", ikon: "pembayaran" },
		{ href: "/user/absensi", label: "Absensi QR", ikon: "qr" },
		{ href: "/user/sertifikat", label: "Sertifikat", ikon: "sertifikat" },
		{ href: "/user/profil", label: "Profil Akun", ikon: "profil" },
	]
	const menuAdmin: ItemMenu[] = [
		{ href: "/admin", label: "Dashboard", ikon: "dashboard" },
		{ href: "/admin/kelas", label: "Kelola Kelas", ikon: "kelas" },
		{ href: "/admin/peserta", label: "Data Peserta", ikon: "peserta" },
		{ href: "/admin/pembayaran", label: "Pembayaran", ikon: "pembayaran" },
		{ href: "/admin/absensi", label: "Sesi & QR Absensi", ikon: "qr" },
		{ href: "/admin/kehadiran", label: "Rekap Kehadiran", ikon: "sertifikat" },
		{ href: "/admin/sertifikat", label: "Penerbitan Sertifikat", ikon: "sertifikat" },
		{ href: "/admin/laporan", label: "Laporan Bisnis", ikon: "dokumen" },
	]
	const daftarMenu = sesi.peran === "ADMIN" ? menuAdmin : menuPeserta
	const labelPeran = sesi.peran === "ADMIN" ? "Admin" : "Peserta"
	const inisialNama = sesi.nama?.split(" ").map((nama) => nama[0]).slice(0, 2).join("").toUpperCase() || "U"

	return (
		<div className="flex min-h-dvh bg-background text-foreground lg:h-dvh lg:overflow-hidden">
			<aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex lg:h-dvh lg:min-h-0">
				<div className="flex h-[72px] shrink-0 items-center border-b border-border px-6">
					<Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">RM</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold tracking-tight">{identitasTampilan.nama}</p>
							<p className="truncate text-xs text-muted-foreground">Panel {labelPeran}</p>
						</div>
					</Link>
				</div>
				<nav aria-label="Navigasi dashboard" className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
					{daftarMenu.map((item) => {
						return <TautanDashboard key={item.href} item={item} />
					})}
				</nav>
				<div className="shrink-0 border-t border-border p-3">
					<form action={aksiKeluar}>
						{/* min-h-11 (44px) agar konsisten dengan tombol Keluar di drawer mobile. */}
						<button type="submit" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-destructive transition-colors duration-200 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
							<LogOut className="size-4" aria-hidden="true" /> Keluar
						</button>
					</form>
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col lg:h-dvh lg:min-h-0 lg:overflow-hidden">
				<header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6">
					<div className="flex items-center gap-3">
						<NavigasiMobile items={daftarMenu} labelPeran={labelPeran} />
						<div className="lg:hidden">
							<p className="font-heading text-sm font-bold">Rumah Mama Pintar</p>
							<p className="text-xs text-muted-foreground">Panel {labelPeran}</p>
						</div>
						<p className="hidden text-sm text-muted-foreground lg:block">
							{sesi.peran === "ADMIN" ? "Kelola operasional kursus" : "Kelola aktivitas kursus Anda"}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-secondary-foreground" aria-hidden="true">{inisialNama}</div>
						<div className="hidden text-left sm:block">
							<p className="text-sm font-semibold leading-tight">{sesi.nama}</p>
							<p className="text-xs text-muted-foreground">{labelPeran}</p>
						</div>
					</div>
				</header>
				<main id="konten-utama" className="w-full flex-1 space-y-6 p-4 sm:p-6 lg:min-h-0 lg:overflow-y-auto">{children}</main>
			</div>
		</div>
	)
}
