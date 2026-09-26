import Link from "next/link"

import { KakiHalaman } from "@/components/kerangka"
import { NavigasiPublik } from "@/components/navigasi-publik"
import { Button } from "@/components/ui/button"
import { sesiPengguna } from "@/lib/auth"
import { berandaDashboard } from "@/lib/rbac"

const tautan = [
	{ href: "/#beranda", label: "Beranda" },
	{ href: "/#program", label: "Program" },
	{ href: "/#ulasan", label: "Ulasan" },
	{ href: "/#bukti", label: "Rekam Jejak" },
	{ href: "/#cara-daftar", label: "Cara Daftar" },
]

export default async function TataLetakPublik({
	children,
}: {
	children: React.ReactNode
}) {
	const sesi = await sesiPengguna()

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<NavigasiPublik
				tautan={tautan}
				tombolMasuk={sesi ? undefined : { href: "/masuk", label: "Masuk" }}
				aksi={
					sesi ? (
						<Button asChild size="sm" variant="gold">
							<Link href={berandaDashboard(sesi.peran)}>
								Dashboard {sesi.peran === "ADMIN" ? "Admin" : "Saya"}
							</Link>
						</Button>
					) : (
						<>
							<Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
								<Link href="/masuk">Masuk</Link>
							</Button>
							{/* Tombol "Daftar Sekarang" disembunyikan di layar sempit agar header
							    tidak berdesakan dengan tombol buka-menu. Pendaftaran tetap
							    terjangkau dari mobile lewat halaman /masuk ("Daftar akun
							    peserta") dan /cara-pendaftaran ("Buat Akun"). */}
							<Button asChild size="sm" variant="gold" className="hidden sm:inline-flex">
								<Link href="/daftar">Daftar Sekarang</Link>
							</Button>
						</>
					)
				}
			/>
			<main
				id="konten-utama"
				className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
			>
				{children}
			</main>
			<KakiHalaman />
		</div>
	)
}