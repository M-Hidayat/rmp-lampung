"use client"

import { useActionState, useState } from "react"
import { Check, Copy, KeyRound, MessageCircle } from "lucide-react"

import { aksiTerbitkanTautanAturUlang, type HasilTautanAturUlang } from "./aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/**
 * Terbitkan tautan atur ulang kata sandi untuk satu peserta.
 *
 * Dipakai karena email transaksional belum aktif: admin menyalin tautan lalu
 * mengirimkannya sendiri ke peserta. Tautan ditampilkan sekali dan tidak
 * disimpan di basis data dalam bentuk mentah.
 */
export function TombolTautanAturUlang({
	idPengguna,
	nama,
	telepon,
}: {
	idPengguna: string
	nama: string
	telepon: string | null
}) {
	const [hasil, aksi, sedangProses] = useActionState<HasilTautanAturUlang | undefined, FormData>(
		aksiTerbitkanTautanAturUlang,
		undefined,
	)
	const [tersalin, setTersalin] = useState(false)

	async function salinTautan(tautan: string) {
		try {
			await navigator.clipboard.writeText(tautan)
			setTersalin(true)
			window.setTimeout(() => setTersalin(false), 2500)
		} catch {
			setTersalin(false)
		}
	}

	// Nomor telepon dinormalkan ke format yang diterima wa.me (hanya angka).
	const nomorWa = telepon?.replace(/[^0-9]/g, "").replace(/^0/, "62") ?? null
	const pesanWa = hasil?.tautan
		? encodeURIComponent(
				`Halo ${nama}, berikut tautan untuk membuat kata sandi baru akun Rumah Mama Pintar Anda:\n\n${hasil.tautan}\n\nTautan ini hanya dapat dipakai sekali. Bila Anda tidak meminta ini, abaikan pesan ini.`,
			)
		: null

	return (
		<div className="flex flex-col gap-3">
			<form action={aksi} className="flex flex-col gap-2">
				<input type="hidden" name="idPengguna" value={idPengguna} />
				<Button
					type="submit"
					variant="outline"
					size="sm"
					disabled={sedangProses}
					title={`Buat tautan atur ulang kata sandi untuk ${nama}`}
				>
					{sedangProses ? (
						<Spinner data-icon="inline-start" />
					) : (
						<KeyRound data-icon="inline-start" />
					)}
					Atur ulang
				</Button>
			</form>

			{hasil?.pesan ? (
				<Alert variant="gagal" judul="Gagal membuat tautan">
					<p>{hasil.pesan}</p>
				</Alert>
			) : null}

			{hasil?.tautan ? (
				<Alert variant="sukses" judul={`${hasil.nama}: tautan siap`}>
					<div className="flex flex-col gap-3">
						<p>
							Salin tautan ini lalu kirimkan ke peserta. Demi keamanan, tautan hanya
							ditampilkan sekali dan tidak bisa dilihat lagi setelah halaman
							ditinggalkan.
						</p>
						<code className="block break-all rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground">
							{hasil.tautan}
						</code>
						<div className="flex flex-wrap gap-2">
							<Button
								type="button"
								size="sm"
								variant="default"
								onClick={() => salinTautan(hasil.tautan!)}
							>
								{tersalin ? (
									<Check data-icon="inline-start" />
								) : (
									<Copy data-icon="inline-start" />
								)}
								{tersalin ? "Tersalin" : "Salin tautan"}
							</Button>
							{nomorWa && pesanWa ? (
								<Button asChild size="sm" variant="brand">
									<a
										href={`https://wa.me/${nomorWa}?text=${pesanWa}`}
										target="_blank"
										rel="noreferrer noopener"
									>
										<MessageCircle data-icon="inline-start" />
										Kirim via WhatsApp
									</a>
								</Button>
							) : null}
						</div>
					</div>
				</Alert>
			) : null}
		</div>
	)
}