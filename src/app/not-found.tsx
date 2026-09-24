import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"

export const metadata: Metadata = { title: "Halaman tidak ditemukan" }

export default function TidakDitemukan() {
	return (
		<main
			id="konten-utama"
			className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6"
		>
			<div className="flex size-14 items-center justify-center rounded-xl bg-slate-950 text-white">
				<Compass className="size-7" aria-hidden="true" />
			</div>

			<div className="space-y-3">
				<p className="font-heading text-xs font-semibold uppercase tracking-wider text-zinc-500">
					Kesalahan 404
				</p>
				<h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
					Halaman tidak ditemukan
				</h1>
				<p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-600">
					Alamat yang Anda buka tidak tersedia atau sudah dipindahkan. Periksa kembali
					tautan Anda, atau kembali ke halaman utama untuk melanjutkan.
				</p>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row">
				<Link
					href="/"
					className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
					Kembali ke halaman utama
				</Link>
				<Link
					href="/kelas"
					className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Lihat katalog kursus
				</Link>
			</div>
		</main>
	)
}
