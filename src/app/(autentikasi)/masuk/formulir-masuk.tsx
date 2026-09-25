"use client"

import { useActionState } from "react"

import { aksiMasuk, type StatusFormulir } from "../aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormulirMasuk({ lanjut }: { lanjut?: string }) {
	const [status, aksi, sedangProses] = useActionState<StatusFormulir, FormData>(
		aksiMasuk,
		undefined,
	)

	return (
		<form action={aksi} className="flex flex-col gap-4" noValidate>
			<input type="hidden" name="lanjut" value={lanjut ?? ""} />
			{status?.pesan ? (
				<Alert variant="gagal" judul="Gagal masuk">
					<p>{status.pesan}</p>
				</Alert>
			) : null}

			<div className="flex flex-col gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					placeholder="nama@email.com"
					autoComplete="email"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="kataSandi">Kata sandi</Label>
				<Input
					id="kataSandi"
					name="kataSandi"
					type="password"
					required
					placeholder="••••••••"
					autoComplete="current-password"
				/>
			</div>

			<Button type="submit" variant="gold" className="w-full" disabled={sedangProses}>
				{sedangProses ? "Memproses…" : "Masuk"}
			</Button>
		</form>
	)
}