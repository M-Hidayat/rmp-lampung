"use client"

import { useActionState } from "react"

import { aksiDaftar, type StatusFormulir } from "../aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** Pesan galat per bidang. Satu gaya, satu warna (token destructive). */
function PesanGalat({ pesan, id }: { pesan?: string; id: string }) {
	if (!pesan) return null
	return (
		<p id={id} className="text-xs font-medium text-destructive" role="alert">
			{pesan}
		</p>
	)
}

export function FormulirDaftar() {
	const [status, aksi, sedangProses] = useActionState<StatusFormulir, FormData>(
		aksiDaftar,
		undefined,
	)
	const detail = status?.detail ?? {}

	return (
		<form action={aksi} className="flex flex-col gap-4" noValidate>
			{status?.pesan ? (
				<Alert variant="gagal" judul="Pendaftaran akun gagal">
					<p>{status.pesan}</p>
				</Alert>
			) : null}

			<div className="flex flex-col gap-2">
				<Label htmlFor="nama">Nama lengkap</Label>
				<Input
					id="nama"
					name="nama"
					required
					autoComplete="name"
					placeholder="Nama lengkap Anda"
					aria-invalid={detail.nama ? true : undefined}
					aria-describedby={detail.nama ? "galat-nama" : undefined}
				/>
				<PesanGalat pesan={detail.nama} id="galat-nama" />
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					autoComplete="email"
					placeholder="nama@email.com"
					aria-invalid={detail.email ? true : undefined}
					aria-describedby={detail.email ? "galat-email" : undefined}
				/>
				<PesanGalat pesan={detail.email} id="galat-email" />
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="telepon">Nomor telepon (opsional)</Label>
				<Input
					id="telepon"
					name="telepon"
					autoComplete="tel"
					placeholder="08xxxxxxxxxx"
					aria-invalid={detail.telepon ? true : undefined}
					aria-describedby={detail.telepon ? "galat-telepon" : undefined}
				/>
				<PesanGalat pesan={detail.telepon} id="galat-telepon" />
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="kataSandi">Kata sandi</Label>
				<Input
					id="kataSandi"
					name="kataSandi"
					type="password"
					required
					autoComplete="new-password"
					placeholder="Minimal 8 karakter"
					aria-invalid={detail.kataSandi ? true : undefined}
					aria-describedby={
						detail.kataSandi ? "bantuan-kata-sandi galat-kata-sandi" : "bantuan-kata-sandi"
					}
				/>
				<p id="bantuan-kata-sandi" className="text-xs text-muted-foreground">
					Minimal 8 karakter, memuat minimal satu huruf dan satu angka.
				</p>
				<PesanGalat pesan={detail.kataSandi} id="galat-kata-sandi" />
			</div>

			<Button type="submit" variant="gold" className="w-full" disabled={sedangProses}>
				{sedangProses ? "Memproses…" : "Daftar akun"}
			</Button>
		</form>
	)
}