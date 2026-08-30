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
		<form action={aksi} className="space-y-3">
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
				className="w-full font-bold rounded-xl shadow-xs"
				disabled={nonaktif || sedangProses}
			>
				{sedangProses ? "Memproses pendaftaran…" : "Daftar dan bayar"}
			</Button>
			<p className="text-xs text-zinc-500 leading-relaxed">
				Anda akan diarahkan ke halaman pembayaran Pakasir. Status pembayaran
				hanya berubah setelah konfirmasi resmi dari penyedia pembayaran.
			</p>
		</form>
	)
}
