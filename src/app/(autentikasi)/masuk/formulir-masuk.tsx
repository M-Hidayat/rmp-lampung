"use client"

import { useActionState } from "react"

import { aksiMasuk, type StatusFormulir } from "../aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function FormulirMasuk({ lanjut }: { lanjut?: string }) {
	const [status, aksi, sedangProses] = useActionState<StatusFormulir, FormData>(
		aksiMasuk,
		undefined,
	)

	return (
		<form action={aksi} noValidate>
			<input type="hidden" name="lanjut" value={lanjut ?? ""} />

			<FieldGroup>
				{status?.pesan ? (
					<Alert variant="gagal" judul="Gagal masuk">
						<p>{status.pesan}</p>
					</Alert>
				) : null}

				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						name="email"
						type="email"
						required
						placeholder="nama@email.com"
						autoComplete="email"
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor="kataSandi">Kata sandi</FieldLabel>
					<Input
						id="kataSandi"
						name="kataSandi"
						type="password"
						required
						placeholder="••••••••"
						autoComplete="current-password"
					/>
				</Field>

				<Field>
					<Button type="submit" variant="gold" className="w-full" disabled={sedangProses}>
						{sedangProses ? (
							<>
								<Spinner data-icon="inline-start" /> Memproses…
							</>
						) : (
							"Masuk"
						)}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	)
}