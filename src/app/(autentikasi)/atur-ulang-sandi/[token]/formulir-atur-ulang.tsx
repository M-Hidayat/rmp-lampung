"use client"

import { useActionState } from "react"

import { aksiSimpanKataSandiBaru, type StatusAturUlang } from "../../aksi"
import { BidangKataSandi } from "@/components/bidang-kata-sandi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

export function FormulirAturUlang({ token }: { token: string }) {
	const [status, aksi, sedangProses] = useActionState<StatusAturUlang, FormData>(
		aksiSimpanKataSandiBaru,
		{},
	)
	const detail = status?.detail ?? {}

	return (
		<form action={aksi} noValidate>
			<input type="hidden" name="token" value={token} />

			<FieldGroup>
				{status?.pesan ? (
					<Alert variant="gagal" judul="Gagal menyimpan kata sandi">
						<p>{status.pesan}</p>
					</Alert>
				) : null}

				<Field data-invalid={detail.kataSandi ? true : undefined}>
					<FieldLabel htmlFor="kataSandi">Kata sandi baru</FieldLabel>
					<BidangKataSandi
						id="kataSandi"
						name="kataSandi"
						autoComplete="new-password"
						placeholder="Minimal 8 karakter"
						ariaInvalid={detail.kataSandi ? true : undefined}
						ariaDescribedBy={
							detail.kataSandi
								? "bantuan-kata-sandi galat-kata-sandi"
								: "bantuan-kata-sandi"
						}
					/>
					<FieldDescription id="bantuan-kata-sandi">
						Minimal 8 karakter, memuat minimal satu huruf dan satu angka.
					</FieldDescription>
					<FieldError id="galat-kata-sandi">{detail.kataSandi}</FieldError>
				</Field>

				<Field data-invalid={detail.kataSandiUlang ? true : undefined}>
					<FieldLabel htmlFor="kataSandiUlang">Ulangi kata sandi baru</FieldLabel>
					<BidangKataSandi
						id="kataSandiUlang"
						name="kataSandiUlang"
						autoComplete="new-password"
						placeholder="Ulangi kata sandi"
						ariaInvalid={detail.kataSandiUlang ? true : undefined}
						ariaDescribedBy={
							detail.kataSandiUlang ? "galat-kata-sandi-ulang" : undefined
						}
					/>
					<FieldError id="galat-kata-sandi-ulang">{detail.kataSandiUlang}</FieldError>
				</Field>

				<Field>
					<Button type="submit" variant="gold" className="w-full" disabled={sedangProses}>
						{sedangProses ? (
							<>
								<Spinner data-icon="inline-start" /> Menyimpan…
							</>
						) : (
							"Simpan kata sandi baru"
						)}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	)
}