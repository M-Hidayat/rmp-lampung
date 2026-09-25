import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { FormulirKelas } from "../formulir-kelas"

export const metadata: Metadata = { title: "Tambah kelas" }

export default function HalamanTambahKelas() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<Link
					href="/admin/kelas"
					className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
					Kembali ke kelola kelas
				</Link>
				<h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
					Tambah kelas
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Lengkapi informasi kelas yang akan tersedia dalam katalog.
				</p>
			</div>

			<div className="rounded-lg border border-border bg-card p-5 sm:p-6">
				<FormulirKelas mode="buat" />
			</div>
		</div>
	)
}
