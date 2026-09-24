import type { Metadata } from "next"

import { FormulirKataSandi, FormulirProfil } from "../../formulir-profil"
import { sesiPengguna } from "@/lib/auth"
import { profilSaya } from "@/lib/layanan/profil"
import { formatTanggal } from "@/lib/uang"

export const metadata: Metadata = { title: "Profil akun" }
export const dynamic = "force-dynamic"

/**
 * Halaman profil bersama untuk peserta dan admin.
 * Keduanya dibedakan hanya oleh label peran yang ditampilkan.
 */
export default async function HalamanProfilAkun() {
	const sesi = await sesiPengguna()
	const profil = await profilSaya(sesi)
	const labelPeran = profil.peran === "ADMIN" ? "Admin" : "Peserta"

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
					Profil akun
				</h1>
				<p className="mt-0.5 text-xs text-muted-foreground">
					Ubah nama, telepon, dan kata sandi akun Anda.
				</p>
			</div>

			{/* Ringkasan akun yang tidak dapat diubah sendiri */}
			<div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
				<h2 className="border-b border-border pb-3 font-heading text-base font-bold text-foreground">
					Data akun
				</h2>
				<dl className="divide-y divide-border text-sm">
					<div className="flex flex-wrap items-center justify-between gap-2 py-3">
						<dt className="text-xs font-medium text-muted-foreground">Email</dt>
						<dd className="rounded-lg border border-border bg-muted px-2.5 py-1 font-mono text-xs text-foreground">
							{profil.email}
						</dd>
					</div>
					<div className="flex flex-wrap items-center justify-between gap-2 py-3">
						<dt className="text-xs font-medium text-muted-foreground">Peran akun</dt>
						<dd className="inline-flex items-center rounded-lg border border-border bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
							{labelPeran}
						</dd>
					</div>
					<div className="flex flex-wrap items-center justify-between gap-2 py-3">
						<dt className="text-xs font-medium text-muted-foreground">Terdaftar sejak</dt>
						<dd className="text-xs text-muted-foreground">{formatTanggal(profil.dibuatPada)}</dd>
					</div>
				</dl>
				<p className="text-xs text-muted-foreground">
					Email dan peran akun hanya dapat diubah oleh administrator sistem.
				</p>
			</div>

			{/* Ubah identitas */}
			<div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
				<div>
					<h2 className="font-heading text-base font-bold text-foreground">Identitas</h2>
					<p className="mt-0.5 text-xs text-muted-foreground">
						Nama yang Anda pakai pada absensi dan sertifikat.
					</p>
				</div>
				<FormulirProfil namaAwal={profil.nama} teleponAwal={profil.telepon ?? ""} />
			</div>

			{/* Ganti kata sandi */}
			<div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
				<div>
					<h2 className="font-heading text-base font-bold text-foreground">Keamanan</h2>
					<p className="mt-0.5 text-xs text-muted-foreground">
						Ganti kata sandi secara berkala. Kata sandi saat ini diperlukan sebagai konfirmasi.
					</p>
				</div>
				<FormulirKataSandi />
			</div>
		</div>
	)
}
