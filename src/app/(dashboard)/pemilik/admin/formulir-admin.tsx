"use client"

import { useActionState } from "react"
import { UserPlus } from "lucide-react"

import { aksiBuatAdmin } from "../../aksi"
import type { HasilAksi } from "@/components/formulir-aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** Formulir pembuatan akun admin. Peran ditetapkan di server. */
export function FormulirAdmin() {
	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksiBuatAdmin,
		undefined,
	)
	const detail = status?.detail ?? {}

	return (
		<form action={jalankan} className="space-y-4" noValidate>
			{status?.pesan ? (
				<Alert variant="gagal" judul="Akun admin belum dibuat">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{status?.sukses ? (
				<Alert variant="sukses">
					<p>{status.sukses}</p>
				</Alert>
			) : null}

			<div className="space-y-1.5">
				<Label htmlFor="nama-admin" className="text-xs font-medium text-zinc-700">Nama Admin</Label>
				<Input id="nama-admin" name="nama" required autoComplete="name" placeholder="Nama lengkap admin" className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]" />
				{detail.nama ? (
					<p className="text-xs text-red-600 font-medium" role="alert">
						{detail.nama}
					</p>
				) : null}
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="email-admin" className="text-xs font-medium text-zinc-700">Email Resmi</Label>
				<Input
					id="email-admin"
					name="email"
					type="email"
					required
					autoComplete="email"
					placeholder="admin@rmp-lampung.test"
					className="font-mono text-xs rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
				/>
				{detail.email ? (
					<p className="text-xs text-red-600 font-medium" role="alert">
						{detail.email}
					</p>
				) : null}
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="kataSandi-admin" className="text-xs font-medium text-zinc-700">Kata Sandi Awal</Label>
				<Input
					id="kataSandi-admin"
					name="kataSandi"
					type="password"
					required
					autoComplete="new-password"
					aria-describedby="bantuan-sandi-admin"
					placeholder="Minimal 8 karakter"
					className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
				/>
				<p id="bantuan-sandi-admin" className="text-[11px] text-zinc-500">
					Minimal 8 karakter. Wajib diganti oleh admin setelah masuk pertama kali.
				</p>
				{detail.kataSandi ? (
					<p className="text-xs text-red-600 font-medium" role="alert">
						{detail.kataSandi}
					</p>
				) : null}
			</div>

			<Button type="submit" variant="gold" className="rounded-xl font-semibold shadow-xs" disabled={sedangProses}>
				<UserPlus className="size-4 mr-1.5" />
				{sedangProses ? "Menyimpan…" : "Buat akun admin"}
			</Button>
		</form>
	)
}
