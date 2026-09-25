"use client"

import { useActionState } from "react"

import { aksiMintaAturUlang, type StatusLupaSandi } from "../aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function FormulirLupaSandi() {
	const [status, aksi, sedangProses] = useActionState<StatusLupaSandi, FormData>(
		aksiMintaAturUlang,
		undefined,
	)

	// Setelah permintaan diterima, formulir diganti keterangan — bukan
	// menampilkan form lagi, supaya tidak ada pengiriman berulang tanpa sadar.
	if (status?.terkirim) {
		return (
			<div className="flex flex-col gap-4">
				<Alert variant="sukses" judul="Permintaan diterima">
					<p>
						Bila email tersebut terdaftar, kami sudah mengirim tautan untuk membuat
						kata sandi baru. Periksa kotak masuk dan folder spam Anda.
					</p>
				</Alert>
				{status.emailDimatikan ? (
					<Alert variant="peringatan" judul="Email belum aktif">
						<p>
							Pengiriman email belum diaktifkan di server ini, sehingga tautan tidak
							terkirim. Hubungi admin Rumah Mama Pintar untuk mengatur ulang kata sandi
							Anda.
						</p>
					</Alert>
				) : null}
			</div>
		)
	}

	return (
		<form action={aksi} noValidate>
			<FieldGroup>
				{status?.pesan ? (
					<Alert variant="gagal" judul="Permintaan gagal">
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
						autoComplete="email"
						placeholder="nama@email.com"
					/>
					<FieldDescription>
						Masukkan email yang Anda pakai saat mendaftar. Kami akan mengirim tautan
						untuk membuat kata sandi baru.
					</FieldDescription>
				</Field>

				<Field>
					<Button type="submit" variant="gold" className="w-full" disabled={sedangProses}>
						{sedangProses ? (
							<>
								<Spinner data-icon="inline-start" /> Mengirim…
							</>
						) : (
							"Kirim tautan atur ulang"
						)}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	)
}