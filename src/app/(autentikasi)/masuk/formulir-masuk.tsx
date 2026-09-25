"use client"

import { useActionState } from "react"
import Link from "next/link"

import { aksiMasuk, type StatusFormulir } from "../aksi"
import { BidangKataSandi } from "@/components/bidang-kata-sandi"
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
					<div className="flex items-center justify-between gap-3">
						<FieldLabel htmlFor="kataSandi">Kata sandi</FieldLabel>
						<Link
							href="/lupa-sandi"
							className="text-sm font-semibold text-accent-foreground underline underline-offset-4 hover:text-foreground"
						>
							Lupa kata sandi?
						</Link>
					</div>
					<BidangKataSandi
						id="kataSandi"
						name="kataSandi"
						autoComplete="current-password"
						placeholder="••••••••"
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