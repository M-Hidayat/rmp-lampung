import { KakiHalaman, KepalaHalaman } from "@/components/kerangka"
import { Button } from "@/components/ui/button"
import { sesiPengguna } from "@/lib/auth"
import { berandaDashboard } from "@/lib/rbac"
import Link from "next/link"

const tautan = [
	{ href: "/", label: "Beranda" },
	{ href: "/kelas", label: "Kelas" },
	{ href: "/cara-pendaftaran", label: "Jadwal" },
	{ href: "/profil", label: "Tentang" },
]

export default async function TataLetakPublik({
	children,
}: {
	children: React.ReactNode
}) {
	const sesi = await sesiPengguna()

	return (
		<div className="flex min-h-dvh flex-col bg-[#FAF8F5]">
			<KepalaHalaman
				tautan={tautan}
				aksi={
					sesi ? (
						<div className="flex items-center gap-2">
							<Button asChild size="sm" variant="gold" className="rounded-lg font-semibold shadow-xs">
								<Link href={berandaDashboard(sesi.peran)}>
									Dashboard {sesi.peran === "PEMILIK" ? "Pemilik" : sesi.peran === "ADMIN" ? "Admin" : "Saya"}
								</Link>
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex text-zinc-600 hover:text-zinc-950">
								<Link href="/masuk">Masuk</Link>
							</Button>
							<Button asChild size="sm" variant="gold" className="rounded-lg font-semibold shadow-xs px-4">
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
