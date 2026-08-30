import type { Metadata } from "next"
import Link from "next/link"
import { Plus, BookOpen, Search, ArrowRight } from "lucide-react"

import { FormulirKelas, type NilaiAwalKelas } from "./formulir-kelas"
import { aksiUbahStatusKelas } from "../../aksi"
import { FormulirAksi } from "@/components/formulir-aksi"
import { JudulHalaman } from "@/components/kerangka"
import { LencanaAktif } from "@/components/status-lencana"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableWrapper,
} from "@/components/ui/table"
import { sesiPengguna } from "@/lib/auth"
import { daftarKelasOperasional, sisaKuota } from "@/lib/layanan/kelas"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Kelola kelas" }
export const dynamic = "force-dynamic"

/** Nilai untuk input datetime-local (menit terdekat, zona waktu WIB). */
function keNilaiWaktuLokal(tanggal: Date | null): string {
	if (!tanggal) return ""
	const wib = new Date(tanggal.getTime() + 7 * 60 * 60 * 1000)
	return wib.toISOString().slice(0, 16)
}

export default async function HalamanKelolaKelas() {
	const sesi = await sesiPengguna()
	const kelas = await daftarKelasOperasional(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Kelola kelas
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Kelas tidak dapat dihapus. Kelas yang tidak lagi dijual cukup dinonaktifkan agar riwayat tetap utuh.
					</p>
				</div>
			</div>

			<Alert variant="info" judul="Aturan kuota">
				<p>
					Kuota tidak dapat diturunkan di bawah jumlah pendaftar aktif
					(menunggu pembayaran dan lunas).
				</p>
			</Alert>

			{/* Create Class Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="border-b border-[#F5F3EF] pb-3">
					<h2 className="text-base font-bold text-zinc-950 font-heading flex items-center gap-2">
						<Plus className="size-4 text-[#D49A28]" />
						Tambah kelas baru
					</h2>
					<p className="text-xs text-zinc-500 mt-0.5">
						Slug dipakai pada tautan publik /kelas/&lt;slug&gt; dan harus unik.
					</p>
				</div>
				<div className="pt-2">
					<FormulirKelas mode="buat" />
				</div>
			</div>

			{/* Main Catalog Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Daftar Kelas ({kelas.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari kelas..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Kelas</TableHead>
								<TableHead>Harga</TableHead>
								<TableHead>Kuota</TableHead>
								<TableHead>Jadwal mulai</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{kelas.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada kelas. Tambahkan kelas pertama pada formulir di atas.
									</TableCell>
								</TableRow>
							) : (
								kelas.map((item) => (
									<TableRow key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell>
											<span className="font-semibold text-zinc-900 block text-sm">{item.judul}</span>
											<span className="block font-mono text-xs text-zinc-400">
												/{item.slug}
											</span>
										</TableCell>
										<TableCell className="font-mono font-semibold text-[#854D0E] text-xs">
											{formatRupiah(item.harga.toString())}
										</TableCell>
										<TableCell className="text-xs">
											<span className="font-semibold text-zinc-800">{item._count.enrollments} / {item.kuota} terpakai</span>
											<span className="block text-zinc-400 text-[11px]">
												Sisa {sisaKuota(item.kuota, item._count.enrollments)} kursi
											</span>
										</TableCell>
										<TableCell className="text-xs text-zinc-600">
											{formatTanggalWaktu(item.jadwalMulai)} WIB
										</TableCell>
										<TableCell>
											<LencanaAktif aktif={item.aktif} />
										</TableCell>
										<TableCell className="text-right">
											<FormulirAksi
												aksi={aksiUbahStatusKelas}
												nilai={{
													classId: item.id,
													aktif: item.aktif ? "false" : "true",
												}}
												label={item.aktif ? "Nonaktifkan" : "Aktifkan"}
												variant="outline"
											/>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>

			{/* Edit Class Cards */}
			<div className="space-y-4">
				<h2 className="text-base font-bold text-zinc-950 font-heading">
					Ubah data kelas
				</h2>
				<div className="grid gap-4">
					{kelas.map((item) => {
						const nilaiAwal: NilaiAwalKelas = {
							classId: item.id,
							judul: item.judul,
							slug: item.slug,
							deskripsi: item.deskripsi,
							harga: item.harga.toString(),
							kuota: item.kuota,
							jadwalMulai: keNilaiWaktuLokal(item.jadwalMulai),
							jadwalSelesai: keNilaiWaktuLokal(item.jadwalSelesai),
							lokasi: item.lokasi,
							gambarUrl: item.gambarUrl ?? "",
							aktif: item.aktif,
						}
						return (
							<div key={item.id} className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
								<div className="flex items-center justify-between border-b border-[#F5F3EF] pb-3">
									<div>
										<h3 className="text-base font-bold text-zinc-950 font-heading">{item.judul}</h3>
										<p className="text-xs text-zinc-500">Perubahan berlaku langsung pada katalog publik.</p>
									</div>
									<LencanaAktif aktif={item.aktif} />
								</div>
								<div className="pt-2">
									<FormulirKelas mode="ubah" nilaiAwal={nilaiAwal} />
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
