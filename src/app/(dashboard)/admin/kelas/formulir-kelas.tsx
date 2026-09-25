"use client"

import { useActionState, useState, useEffect } from "react"
import Link from "next/link"

import { aksiBuatKelas, aksiPerbaruiKelas } from "../../aksi"
import type { HasilAksi } from "@/components/formulir-aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type NilaiAwalKelas = {
	classId?: string
	judul?: string
	slug?: string
	deskripsi?: string
	harga?: string
	kuota?: number
	jadwalMulai?: string
	jadwalSelesai?: string
	lokasi?: string
	gambarUrl?: string
	aktif?: boolean
}

function PesanGalat({ pesan }: { pesan?: string }) {
	if (!pesan) return null
	return (
		<p className="text-xs text-destructive font-medium" role="alert">
			{pesan}
		</p>
	)
}

function buatSlugOtomatis(judul: string): string {
	return judul
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.slice(0, 80)
}

export function FormulirKelas({
	mode,
	nilaiAwal = {},
	hrefBatal = "/admin/kelas",
}: {
	mode: "buat" | "ubah"
	nilaiAwal?: NilaiAwalKelas
	hrefBatal?: string
}) {
	const aksiServer = mode === "buat" ? aksiBuatKelas : aksiPerbaruiKelas
	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksiServer,
		undefined,
	)

	const [judul, setJudul] = useState(nilaiAwal.judul ?? "")
	const [slug, setSlug] = useState(nilaiAwal.slug ?? "")
	const [slugManual, setSlugManual] = useState(mode === "ubah")

	useEffect(() => {
		if (mode === "buat" && !slugManual) {
			setSlug(buatSlugOtomatis(judul))
		}
	}, [judul, mode, slugManual])

	const detail = status?.detail ?? {}

	return (
		<form action={jalankan} className="flex flex-col gap-4" noValidate>
			{mode === "ubah" && nilaiAwal.classId ? (
				<input type="hidden" name="classId" value={nilaiAwal.classId} />
			) : null}

			{status?.pesan ? (
				<Alert variant="gagal" judul="Data kelas belum tersimpan">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{status?.sukses ? (
				<Alert variant="sukses">
					<p>{status.sukses}</p>
				</Alert>
			) : null}

			<fieldset className="flex flex-col gap-4">
				<legend className="text-sm font-semibold text-foreground">Informasi kelas</legend>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`judul-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
						Judul kelas
					</Label>
					<Input
						id={`judul-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="judul"
						value={judul}
						onChange={(e) => setJudul(e.target.value)}
						required
						placeholder="Contoh: Pelatihan Usaha Ayam Geprek"
						className="rounded-md border-input focus:border-primary"
					/>
					<PesanGalat pesan={detail.judul} />
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`slug-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
						Slug URL
					</Label>
					<Input
						id={`slug-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="slug"
						value={slug}
						onChange={(e) => {
							setSlugManual(true)
							setSlug(e.target.value)
						}}
						required
						placeholder="pelatihan-usaha-ayam-geprek"
						className="font-mono text-xs rounded-md border-input focus:border-primary"
					/>
					<PesanGalat pesan={detail.slug} />
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`deskripsi-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
					Deskripsi & silabus
				</Label>
				<Textarea
					id={`deskripsi-${mode}-${nilaiAwal.classId ?? "baru"}`}
					name="deskripsi"
					defaultValue={nilaiAwal.deskripsi ?? ""}
					rows={3}
					placeholder="Rincian materi, teknik memasak, fasilitas bahan baku, dan target pelatihan..."
					className="rounded-md border-input focus:border-primary"
				/>
				<PesanGalat pesan={detail.deskripsi} />
			</div>
			</fieldset>

			<fieldset className="flex flex-col gap-4 border-t border-border pt-5">
				<legend className="text-sm font-semibold text-foreground">Harga dan kapasitas</legend>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`harga-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
						Biaya investasi (Rupiah)
					</Label>
					<Input
						id={`harga-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="harga"
						type="number"
						min={0}
						step={1000}
						defaultValue={nilaiAwal.harga ?? "350000"}
						required
						placeholder="350000"
						className="font-mono rounded-md border-input focus:border-primary"
					/>
					<PesanGalat pesan={detail.harga} />
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`kuota-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
						Kuota maksimal peserta
					</Label>
					<Input
						id={`kuota-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="kuota"
						type="number"
						min={1}
						defaultValue={nilaiAwal.kuota ?? 15}
						required
						placeholder="15"
						className="rounded-md border-input focus:border-primary"
					/>
					<PesanGalat pesan={detail.kuota} />
				</div>
			</div>
			</fieldset>

			<fieldset className="flex flex-col gap-4 border-t border-border pt-5">
				<legend className="text-sm font-semibold text-foreground">Jadwal dan lokasi</legend>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`jadwalMulai-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
						Jadwal mulai (WIB)
					</Label>
					<Input
						id={`jadwalMulai-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="jadwalMulai"
						type="datetime-local"
						defaultValue={nilaiAwal.jadwalMulai ?? ""}
						required
						className="rounded-md border-input focus:border-primary"
					/>
					<PesanGalat pesan={detail.jadwalMulai} />
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`jadwalSelesai-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
						Jadwal selesai (opsional)
					</Label>
					<Input
						id={`jadwalSelesai-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="jadwalSelesai"
						type="datetime-local"
						defaultValue={nilaiAwal.jadwalSelesai ?? ""}
						className="rounded-md border-input focus:border-primary"
					/>
					<PesanGalat pesan={detail.jadwalSelesai} />
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`lokasi-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-muted-foreground">
					Lokasi pelatihan
				</Label>
				<Input
					id={`lokasi-${mode}-${nilaiAwal.classId ?? "baru"}`}
					name="lokasi"
					defaultValue={
						nilaiAwal.lokasi ??
						"Jl. Kapten Abdul Haq No. 03, Rajabasa, Bandar Lampung"
					}
					required
					placeholder="Alamat dapur/workshop pelatihan"
					className="rounded-md border-input focus:border-primary"
				/>
				<PesanGalat pesan={detail.lokasi} />
			</div>
			</fieldset>

			<div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
				<Button asChild variant="outline" className="min-h-11">
					<Link href={hrefBatal}>Batal</Link>
				</Button>
				<Button type="submit" variant="gold" className="min-h-11 rounded-md font-semibold " disabled={sedangProses}>
					{sedangProses
						? "Menyimpan…"
						: mode === "buat"
							? "Buat kelas baru"
							: "Simpan perubahan kelas"}
				</Button>
			</div>
		</form>
	)
}
