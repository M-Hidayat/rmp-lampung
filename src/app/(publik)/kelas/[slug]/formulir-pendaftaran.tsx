"use client"

import { useActionState } from "react"

import { aksiDaftarKelas, type StatusAksi } from "./aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function FormulirPendaftaran({
	slugKelas,
	nonaktif,
	alasanNonaktif,
}: {
	slugKelas: string
	nonaktif: boolean
	alasanNonaktif?: string
}) {
	const [status, aksi, sedangProses] = useActionState<StatusAksi, FormData>(
		aksiDaftarKelas,
		undefined,
	)

	return (
		<form action={aksi} className="flex flex-col gap-3">
			<input type="hidden" name="slugKelas" value={slugKelas} />
			{status?.pesan ? (
				<Alert variant="gagal" judul="Pendaftaran tidak dapat dilanjutkan">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{nonaktif && alasanNonaktif ? (
				<Alert variant="peringatan">
					<p>{alasanNonaktif}</p>
				</Alert>
			) : null}
			<Button
				type="submit"
				size="lg"
				variant="gold"
				className="w-full"
				disabled={nonaktif || sedangProses}
			>
				{sedangProses ? "Memproses pendaftaran…" : "Daftar dan bayar"}
			</Button>
			<p className="text-xs leading-relaxed text-muted-foreground">
				Anda akan diarahkan ke halaman pembayaran Pakasir. Status pembayaran
				hanya berubah setelah konfirmasi resmi dari penyedia pembayaran.
			</p>
		</form>
	)
}