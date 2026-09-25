import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { FormulirKelas, type NilaiAwalKelas } from "../../formulir-kelas"
import { LencanaAktif } from "@/components/status-lencana"
import { sesiPengguna } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import { ambilKelasOperasional } from "@/lib/layanan/kelas"

export const metadata: Metadata = { title: "Ubah kelas" }
export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

/** Nilai datetime-local dalam zona WIB. */
function keNilaiWaktuLokal(tanggal: Date | null): string {
	if (!tanggal) return ""
	const wib = new Date(tanggal.getTime() + 7 * 60 * 60 * 1000)
	return wib.toISOString().slice(0, 16)
}

export default async function HalamanUbahKelas({ params }: Props) {
	const { id } = await params
	const sesi = await sesiPengguna()
	let kelas
	try {
		kelas = await ambilKelasOperasional(sesi, id)
	} catch (kesalahan) {
		if (
			kesalahan instanceof KesalahanDomain &&
			kesalahan.kode === "TIDAK_DITEMUKAN"
		) {
			notFound()
		}
		throw kesalahan
	}

	const nilaiAwal: NilaiAwalKelas = {
		classId: kelas.id,
		judul: kelas.judul,
		slug: kelas.slug,
		deskripsi: kelas.deskripsi,
		harga: kelas.harga.toString(),
		kuota: kelas.kuota,
		jadwalMulai: keNilaiWaktuLokal(kelas.jadwalMulai),
		jadwalSelesai: keNilaiWaktuLokal(kelas.jadwalSelesai),
		lokasi: kelas.lokasi,
		gambarUrl: kelas.gambarUrl ?? "",
		aktif: kelas.aktif,
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<Link
					href="/admin/kelas"
					className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
					Kembali ke kelola kelas
				</Link>
				<div className="flex flex-wrap items-center gap-3">
					<h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
						Ubah kelas
					</h1>
					<LencanaAktif aktif={kelas.aktif} />
				</div>
				<p className="mt-1 text-sm text-muted-foreground">
					{kelas.judul} · {kelas._count.enrollments} dari {kelas.kuota} kursi digunakan
				</p>
			</div>

			<div className="rounded-lg border border-border bg-card p-5 sm:p-6">
				<FormulirKelas mode="ubah" nilaiAwal={nilaiAwal} />
			</div>
		</div>
	)
}
