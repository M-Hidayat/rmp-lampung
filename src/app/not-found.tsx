import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Halaman tidak ditemukan" }

export default function TidakDitemukan() {
	return (
		<main
			id="konten-utama"
			className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6"
		>
			<div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
				<Compass aria-hidden="true" className="size-7" />
			</div>

			<div className="flex flex-col gap-3">
				<p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
					Kesalahan 404
				</p>
				<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
					Halaman tidak ditemukan
				</h1>
				<p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
					Alamat yang Anda buka tidak tersedia atau sudah dipindahkan. Periksa kembali
					tautan Anda, atau kembali ke halaman utama untuk melanjutkan.
				</p>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row">
				<Button asChild size="lg">
					<Link href="/">
						<ArrowLeft aria-hidden="true" />
						Kembali ke halaman utama
					</Link>
				</Button>
				<Button asChild size="lg" variant="outline">
					<Link href="/kelas">Lihat katalog kursus</Link>
				</Button>
			</div>
		</main>
	)
}