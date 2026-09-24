import Link from "next/link"
import { redirect } from "next/navigation"

import { MenuAkun } from "./menu-akun"
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
	const admin = sesi.peran === "ADMIN"
	const daftarMenu = admin ? menuAdmin : menuPeserta
	const labelPeran = admin ? "Admin" : "Peserta"
	const hrefProfil = admin ? "/admin/profil" : "/user/profil"

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
				{/* Navigasi memuat menu peran saja. Profil dan Keluar dipindahkan ke
				    menu akun di header agar tidak terduplikasi. */}
				<nav aria-label="Navigasi dashboard" className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
					{daftarMenu.map((item) => {
						return <TautanDashboard key={item.href} item={item} />
					})}
				</nav>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col lg:h-dvh lg:min-h-0 lg:overflow-hidden">
				<header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
					<div className="flex items-center gap-3">
						<NavigasiMobile items={daftarMenu} labelPeran={labelPeran} hrefProfil={hrefProfil} />
						<div className="lg:hidden">
							<p className="font-heading text-sm font-bold">Rumah Mama Pintar</p>
							<p className="text-xs text-muted-foreground">Panel {labelPeran}</p>
						</div>
						<p className="hidden text-sm text-muted-foreground lg:block">
							{admin ? "Kelola operasional kursus" : "Kelola aktivitas kursus Anda"}
						</p>
					</div>
					<MenuAkun
						nama={sesi.nama ?? ""}
						email={sesi.email ?? ""}
						labelPeran={labelPeran}
						hrefProfil={hrefProfil}
					/>
				</header>
				<main id="konten-utama" className="w-full flex-1 space-y-6 p-4 sm:p-6 lg:min-h-0 lg:overflow-y-auto">{children}</main>
			</div>
		</div>
	)
}
