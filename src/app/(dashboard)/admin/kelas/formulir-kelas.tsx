"use client"

import { useActionState, useState, useEffect } from "react"

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
		<p className="text-xs text-red-600 font-medium" role="alert">
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
}: {
	mode: "buat" | "ubah"
	nilaiAwal?: NilaiAwalKelas
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
		<form action={jalankan} className="space-y-4" noValidate>
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

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor={`judul-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
						Judul kelas
					</Label>
					<Input
						id={`judul-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="judul"
						value={judul}
						onChange={(e) => setJudul(e.target.value)}
						required
						placeholder="Contoh: Pelatihan Usaha Ayam Geprek"
						className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
					<PesanGalat pesan={detail.judul} />
				</div>

				<div className="space-y-1.5">
					<Label htmlFor={`slug-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
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
						className="font-mono text-xs rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
					<PesanGalat pesan={detail.slug} />
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={`deskripsi-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
					Deskripsi & silabus
				</Label>
				<Textarea
					id={`deskripsi-${mode}-${nilaiAwal.classId ?? "baru"}`}
					name="deskripsi"
					defaultValue={nilaiAwal.deskripsi ?? ""}
					rows={3}
					placeholder="Rincian materi, teknik memasak, fasilitas bahan baku, dan target pelatihan..."
					className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
				/>
				<PesanGalat pesan={detail.deskripsi} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor={`harga-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
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
						className="font-mono rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
					<PesanGalat pesan={detail.harga} />
				</div>

				<div className="space-y-1.5">
					<Label htmlFor={`kuota-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
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
						className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
					<PesanGalat pesan={detail.kuota} />
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor={`jadwalMulai-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
						Jadwal mulai (WIB)
					</Label>
					<Input
						id={`jadwalMulai-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="jadwalMulai"
						type="datetime-local"
						defaultValue={nilaiAwal.jadwalMulai ?? ""}
						required
						className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
					<PesanGalat pesan={detail.jadwalMulai} />
				</div>

				<div className="space-y-1.5">
					<Label htmlFor={`jadwalSelesai-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
						Jadwal selesai (opsional)
					</Label>
					<Input
						id={`jadwalSelesai-${mode}-${nilaiAwal.classId ?? "baru"}`}
						name="jadwalSelesai"
						type="datetime-local"
						defaultValue={nilaiAwal.jadwalSelesai ?? ""}
						className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
					<PesanGalat pesan={detail.jadwalSelesai} />
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={`lokasi-${mode}-${nilaiAwal.classId ?? "baru"}`} className="text-xs font-medium text-zinc-700">
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
					className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
				/>
				<PesanGalat pesan={detail.lokasi} />
			</div>

			<Button type="submit" variant="gold" className="rounded-xl font-semibold shadow-xs" disabled={sedangProses}>
				{sedangProses
					? "Menyimpan…"
					: mode === "buat"
						? "Buat kelas baru"
						: "Simpan perubahan kelas"}
			</Button>
		</form>
	)
}
