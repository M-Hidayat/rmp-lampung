"use client"

import { useActionState, useMemo, useState } from "react"
import { CheckCircle2, Search } from "lucide-react"

import { aksiAbsensiManual } from "../../aksi"
import type { HasilAksi } from "@/components/formulir-aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type PesertaBelumHadir = {
	enrollmentId: string
	classId: string
	nama: string
	email: string
	judulKelas: string
	punyaSesiAktif: boolean
}

/**
 * Formulir absensi manual: admin memilih kelas, lalu peserta yang benar-benar
 * hadir. Kehadiran tetap tunduk pada aturan server (PAID, satu kehadiran per
 * pendaftaran, dan kelas wajib punya sesi absensi aktif).
 */
export function FormulirAbsensiManual({ peserta }: { peserta: PesertaBelumHadir[] }) {
	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksiAbsensiManual,
		undefined,
	)

	const [classId, setClassId] = useState("")
	const [cari, setCari] = useState("")

	const daftarKelas = useMemo(() => {
		const peta = new Map<string, { classId: string; judulKelas: string; punyaSesiAktif: boolean; jumlah: number }>()
		for (const p of peserta) {
			const ada = peta.get(p.classId)
			if (ada) {
				ada.jumlah += 1
			} else {
				peta.set(p.classId, {
					classId: p.classId,
					judulKelas: p.judulKelas,
					punyaSesiAktif: p.punyaSesiAktif,
					jumlah: 1,
				})
			}
		}
		return [...peta.values()]
	}, [peserta])

	const kelasTerpilih = daftarKelas.find((k) => k.classId === classId)
	const pesertaTerlihat = useMemo(() => {
		const kata = cari.trim().toLowerCase()
		return peserta
			.filter((p) => p.classId === classId)
			.filter((p) => (kata ? p.nama.toLowerCase().includes(kata) || p.email.toLowerCase().includes(kata) : true))
			.sort((a, b) => a.nama.localeCompare(b.nama, "id"))
	}, [peserta, classId, cari])

	if (peserta.length === 0) {
		return (
			<Alert variant="info" judul="Tidak ada peserta yang menunggu">
				<p>
					Semua peserta berstatus lunas sudah tercatat hadir. Absensi manual hanya
					tersedia untuk pendaftaran lunas yang belum memiliki catatan kehadiran.
				</p>
			</Alert>
		)
	}

	return (
		<div className="space-y-4">
			{status?.pesan ? (
				<Alert variant="gagal" judul="Absensi manual gagal">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{status?.sukses ? (
				<Alert variant="sukses" judul="Kehadiran tercatat">
					<p>{status.sukses}</p>
				</Alert>
			) : null}

			<div className="grid gap-3 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="kelas-manual" className="text-xs font-medium text-foreground">
						Kelas
					</Label>
					<Select
						id="kelas-manual"
						value={classId}
						onChange={(e) => {
							setClassId(e.target.value)
							setCari("")
						}}
					>
						<option value="">Pilih kelas terlebih dahulu</option>
						{daftarKelas.map((k) => (
							<option key={k.classId} value={k.classId}>
								{k.judulKelas} — {k.jumlah} peserta belum hadir
								{k.punyaSesiAktif ? "" : " (sesi belum aktif)"}
							</option>
						))}
					</Select>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="cari-peserta" className="text-xs font-medium text-foreground">
						Cari peserta
					</Label>
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
						<Input
							id="cari-peserta"
							value={cari}
							onChange={(e) => setCari(e.target.value)}
							placeholder="Nama atau email"
							disabled={!classId}
							className="pl-9"
						/>
					</div>
				</div>
			</div>

			{!classId ? (
				<p className="text-xs text-muted-foreground">Pilih kelas untuk menampilkan daftar peserta.</p>
			) : kelasTerpilih && !kelasTerpilih.punyaSesiAktif ? (
				<Alert variant="peringatan" judul="Sesi absensi belum aktif">
					<p>
						Kelas ini belum memiliki sesi absensi aktif. Buka sesi absensi lebih dulu
						di menu <span className="font-semibold">Sesi &amp; QR Absensi</span>, lalu
						kembali ke halaman ini.
					</p>
				</Alert>
			) : null}

			{pesertaTerlihat.length === 0 && classId ? (
				<p className="text-xs text-muted-foreground">Tidak ada peserta yang cocok pada kelas ini.</p>
			) : null}

			<ul className="space-y-2">
				{pesertaTerlihat.map((p) => (
					<li
						key={p.enrollmentId}
						className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
					>
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold text-foreground">{p.nama}</p>
							<p className="truncate font-mono text-xs text-muted-foreground">{p.email}</p>
						</div>
						<form action={jalankan} className="shrink-0">
							<input type="hidden" name="enrollmentId" value={p.enrollmentId} />
							<Button
								type="submit"
								variant="outline"
								size="sm"
								className="min-h-11 w-full font-semibold sm:w-auto"
								disabled={sedangProses || !p.punyaSesiAktif}
							>
								<CheckCircle2 className="mr-1.5 size-3.5" aria-hidden="true" />
								Catat hadir
							</Button>
						</form>
					</li>
				))}
			</ul>
		</div>
	)
}
