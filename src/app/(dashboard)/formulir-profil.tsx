"use client"

import { useActionState } from "react"
import { KeyRound, Save } from "lucide-react"

import { aksiGantiKataSandi, aksiPerbaruiProfil } from "./aksi"
import type { HasilAksi } from "@/components/formulir-aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** Formulir ubah nama dan telepon pemilik akun. */
export function FormulirProfil({
	namaAwal,
	teleponAwal,
}: {
	namaAwal: string
	teleponAwal: string
}) {
	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksiPerbaruiProfil,
		undefined,
	)

	return (
		<form action={jalankan} className="space-y-4">
			{status?.pesan ? (
				<Alert variant="gagal" judul="Profil gagal disimpan">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{status?.sukses ? (
				<Alert variant="sukses" judul="Berhasil">
					<p>{status.sukses}</p>
				</Alert>
			) : null}

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="nama" className="text-xs font-medium text-foreground">
						Nama lengkap
					</Label>
					<Input id="nama" name="nama" defaultValue={namaAwal} required minLength={3} maxLength={100} autoComplete="name" />
					<p className="text-xs text-muted-foreground">Nama ini tampil pada sertifikat dan absensi.</p>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="telepon" className="text-xs font-medium text-foreground">
						Telepon <span className="font-normal text-muted-foreground">(opsional)</span>
					</Label>
					<Input id="telepon" name="telepon" defaultValue={teleponAwal} maxLength={30} inputMode="tel" autoComplete="tel" placeholder="08xx" />
				</div>
			</div>

			<Button type="submit" variant="gold" className="min-h-11 font-semibold" disabled={sedangProses}>
				<Save className="mr-1.5 size-4" aria-hidden="true" />
				{sedangProses ? "Menyimpan…" : "Simpan perubahan"}
			</Button>
		</form>
	)
}

/** Formulir ganti kata sandi. Kata sandi saat ini wajib benar. */
export function FormulirKataSandi() {
	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksiGantiKataSandi,
		undefined,
	)

	return (
		<form action={jalankan} className="space-y-4">
			{status?.pesan ? (
				<Alert variant="gagal" judul="Kata sandi gagal diganti">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{status?.sukses ? (
				<Alert variant="sukses" judul="Berhasil">
					<p>{status.sukses}</p>
				</Alert>
			) : null}

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="kataSandiLama" className="text-xs font-medium text-foreground">
						Kata sandi saat ini
					</Label>
					<Input id="kataSandiLama" name="kataSandiLama" type="password" required autoComplete="current-password" />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="kataSandiBaru" className="text-xs font-medium text-foreground">
						Kata sandi baru
					</Label>
					<Input id="kataSandiBaru" name="kataSandiBaru" type="password" required minLength={8} maxLength={72} autoComplete="new-password" />
					<p className="text-xs text-muted-foreground">
						Minimal 8 karakter, memuat huruf dan angka.
					</p>
				</div>
			</div>

			<Button type="submit" variant="outline" className="min-h-11 font-semibold" disabled={sedangProses}>
				<KeyRound className="mr-1.5 size-4" aria-hidden="true" />
				{sedangProses ? "Mengganti…" : "Ganti kata sandi"}
			</Button>
		</form>
	)
}
