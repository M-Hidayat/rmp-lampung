"use client"

import { useActionState } from "react"

import { aksiDaftar, type StatusFormulir } from "../aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function PesanGalat({ pesan }: { pesan?: string }) {
	if (!pesan) return null
	return (
		<p className="text-xs text-red-600 font-medium" role="alert">
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
		<form action={aksi} className="space-y-4" noValidate>
			{status?.pesan ? (
				<Alert variant="gagal" judul="Pendaftaran akun gagal">
					<p>{status.pesan}</p>
				</Alert>
			) : null}

			<div className="space-y-1.5">
				<Label htmlFor="nama" className="text-xs font-medium text-zinc-700">
					Nama lengkap
				</Label>
				<Input id="nama" name="nama" required autoComplete="name" placeholder="Nama lengkap Anda" className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]" />
				<PesanGalat pesan={detail.nama} />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="email" className="text-xs font-medium text-zinc-700">
					Email
				</Label>
				<Input id="email" name="email" type="email" required autoComplete="email" placeholder="nama@email.com" className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]" />
				<PesanGalat pesan={detail.email} />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="telepon" className="text-xs font-medium text-zinc-700">
					Nomor telepon (opsional)
				</Label>
				<Input id="telepon" name="telepon" autoComplete="tel" placeholder="08xxxxxxxxxx" className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]" />
				<PesanGalat pesan={detail.telepon} />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="kataSandi" className="text-xs font-medium text-zinc-700">
					Kata sandi
				</Label>
				<Input
					id="kataSandi"
					name="kataSandi"
					type="password"
					required
					autoComplete="new-password"
					aria-describedby="bantuan-kata-sandi"
					placeholder="Minimal 8 karakter"
					className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
				/>
				<p id="bantuan-kata-sandi" className="text-xs text-zinc-500">
					Minimal 8 karakter, memuat minimal satu huruf dan satu angka.
				</p>
				<PesanGalat pesan={detail.kataSandi} />
			</div>

			<Button type="submit" variant="gold" className="w-full font-semibold rounded-xl shadow-xs" disabled={sedangProses}>
				{sedangProses ? "Memproses…" : "Daftar akun"}
			</Button>
		</form>
	)
}
