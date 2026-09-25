"use client"

import { useActionState } from "react"

import { aksiDaftar, type StatusFormulir } from "../aksi"
import { BidangKataSandi } from "@/components/bidang-kata-sandi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

/**
 * Formulir pendaftaran peserta.
 *
 * Disusun dengan primitif `Field` shadcn/ui (pola blok `signup-01`) agar setiap
 * bidang punya label, keterangan, dan pesan galat dengan struktur serta status
 * yang seragam: `data-invalid` pada `Field` mengatur gaya label dan keterangan,
 * `aria-invalid` pada kontrol mengatur gaya kontrolnya.
 *
 * Struktur dan urutan bidang tetap sesuai kebutuhan domain RMP (nama, email,
 * telepon opsional, kata sandi) — bukan formulir contoh registry, yang memakai
 * bidang "konfirmasi kata sandi" dan tombol masuk dengan Google yang tidak
 * dipakai aplikasi ini.
 */
export function FormulirDaftar() {
	const [status, aksi, sedangProses] = useActionState<StatusFormulir, FormData>(
		aksiDaftar,
		undefined,
	)
	const detail = status?.detail ?? {}

	return (
		<form action={aksi} noValidate>
			<FieldGroup>
				{status?.pesan ? (
					<Alert variant="gagal" judul="Pendaftaran akun gagal">
						<p>{status.pesan}</p>
					</Alert>
				) : null}

				<Field data-invalid={detail.nama ? true : undefined}>
					<FieldLabel htmlFor="nama">Nama lengkap</FieldLabel>
					<Input
						id="nama"
						name="nama"
						required
						autoComplete="name"
						placeholder="Nama lengkap Anda"
						aria-invalid={detail.nama ? true : undefined}
						aria-describedby={detail.nama ? "galat-nama" : undefined}
					/>
					<FieldError id="galat-nama">{detail.nama}</FieldError>
				</Field>

				<Field data-invalid={detail.email ? true : undefined}>
					<FieldLabel htmlFor="email">Email</FieldLabel>
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
					<FieldError id="galat-email">{detail.email}</FieldError>
				</Field>

				<Field data-invalid={detail.telepon ? true : undefined}>
					<FieldLabel htmlFor="telepon">Nomor telepon (opsional)</FieldLabel>
					<Input
						id="telepon"
						name="telepon"
						autoComplete="tel"
						placeholder="08xxxxxxxxxx"
						aria-invalid={detail.telepon ? true : undefined}
						aria-describedby={detail.telepon ? "galat-telepon" : undefined}
					/>
					<FieldError id="galat-telepon">{detail.telepon}</FieldError>
				</Field>

				<Field data-invalid={detail.kataSandi ? true : undefined}>
					<FieldLabel htmlFor="kataSandi">Kata sandi</FieldLabel>
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

				<Field>
					<Button type="submit" variant="gold" className="w-full" disabled={sedangProses}>
						{sedangProses ? (
							<>
								<Spinner data-icon="inline-start" /> Memproses…
							</>
						) : (
							"Daftar akun"
						)}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	)
}