"use client"

import { useActionState } from "react"

import { Alert } from "@/components/ui/alert"
import { Button, type VariasiTombol } from "@/components/ui/button"

export type HasilAksi =
	| { sukses?: string; pesan?: string; detail?: Record<string, string> }
	| undefined

export type AksiFormulir = (
	status: HasilAksi,
	formData: FormData,
) => Promise<HasilAksi>

/**
 * Pembungkus formulir untuk server action sederhana (satu tombol + field
 * tersembunyi). Pesan sukses/gagal ditampilkan sebagai teks, bukan hanya warna.
 */
export function FormulirAksi({
	aksi,
	nilai = {},
	label,
	labelProses,
	variant = "default",
	konfirmasi,
	kelas,
}: {
	aksi: AksiFormulir
	nilai?: Record<string, string>
	label: string
	labelProses?: string
	variant?: VariasiTombol
	konfirmasi?: string
	kelas?: string
}) {
	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksi,
		undefined,
	)

	return (
		<form action={jalankan} className={kelas ?? "space-y-2"}>
			{Object.entries(nilai).map(([kunci, isi]) => (
				<input key={kunci} type="hidden" name={kunci} value={isi} />
			))}
			<Button
				type="submit"
				size="sm"
				variant={variant}
				disabled={sedangProses}
				onClick={(peristiwa) => {
					if (konfirmasi && !window.confirm(konfirmasi)) {
						peristiwa.preventDefault()
					}
				}}
			>
				{sedangProses ? (labelProses ?? "Memproses…") : label}
			</Button>
			{status?.pesan ? (
				<Alert variant="gagal">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{status?.sukses ? (
				<Alert variant="sukses">
					<p>{status.sukses}</p>
				</Alert>
			) : null}
		</form>
	)
}
