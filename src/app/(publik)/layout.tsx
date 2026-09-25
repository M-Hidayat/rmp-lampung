import { KakiHalaman } from "@/components/kerangka"
import { NavigasiPublik } from "@/components/navigasi-publik"
import { Button } from "@/components/ui/button"
import { sesiPengguna } from "@/lib/auth"
import { berandaDashboard } from "@/lib/rbac"
import Link from "next/link"

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
		<div className="flex min-h-dvh flex-col bg-[#F8FAFC]">
			<NavigasiPublik
				tautan={tautan}
				tautanAksiMobile={sesi ? undefined : { href: "/masuk", label: "Masuk" }}
				aksi={
					sesi ? (
						<div className="flex items-center gap-2">
							<Button asChild size="sm" variant="gold" className="min-h-11 rounded-lg font-semibold shadow-sm">
								<Link href={berandaDashboard(sesi.peran)}>
									Dashboard {sesi.peran === "ADMIN" ? "Admin" : "Saya"}
								</Link>
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button asChild size="sm" variant="ghost" className="min-h-11 hidden sm:inline-flex text-zinc-600 hover:text-zinc-950">
								<Link href="/masuk">Masuk</Link>
							</Button>
							<Button asChild size="sm" variant="gold" className="min-h-11 rounded-lg font-semibold shadow-sm px-4">
								<Link href="/daftar">Daftar Sekarang</Link>
							</Button>
						</div>
					)
				}
			/>
			<main
				id="konten-utama"
				className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
			>
				{children}
			</main>
			<KakiHalaman />
		</div>
	)
}
