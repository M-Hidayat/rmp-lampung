import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { aksiUbahStatusKelas } from "../../aksi"
import { FormulirAksi } from "@/components/formulir-aksi"
import { LencanaAktif } from "@/components/status-lencana"
import { Alert } from "@/components/ui/alert"
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

export default async function HalamanKelolaKelas() {
	const sesi = await sesiPengguna()
	const kelas = await daftarKelasOperasional(sesi)
	const jumlahAktif = kelas.filter((item) => item.aktif).length
	const jumlahNonaktif = kelas.length - jumlahAktif
	const jumlahPesertaAktif = kelas.reduce((total, item) => total + item._count.enrollments, 0)

	return (
		<div className="flex flex-col gap-6">
			{/* Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
						Kelola kelas
					</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Kelas tidak dapat dihapus. Kelas yang tidak lagi dijual cukup dinonaktifkan agar riwayat tetap utuh.
					</p>
				</div>
				<Link
					href="/admin/kelas/baru"
					className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<Plus className="size-4" aria-hidden="true" />
					Tambah Kelas
				</Link>
			</div>

			<Alert variant="info" judul="Aturan kuota">
				<p>
					Kuota tidak dapat diturunkan di bawah jumlah pendaftar aktif
					(menunggu pembayaran dan lunas).
				</p>
			</Alert>

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{[
					["Total kelas", kelas.length],
					["Aktif", jumlahAktif],
					["Nonaktif", jumlahNonaktif],
					["Peserta menggunakan kuota", jumlahPesertaAktif],
				].map(([label, nilai]) => (
					<div key={label} className="rounded-lg border border-border bg-card p-4 ">
						<p className="text-xs font-medium text-muted-foreground">{label}</p>
						<p className="mt-1 text-2xl font-bold text-foreground">{nilai}</p>
					</div>
				))}
			</div>

			{/* Main Catalog Table Card */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				{/* Card Toolbar */}
				<div className="pb-2">
					<h2 className="text-base font-bold text-foreground font-heading">
						Daftar Kelas ({kelas.length})
					</h2>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-background rounded-lg">
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
										<p>Belum ada kelas.</p>
										<Link
											href="/admin/kelas/baru"
											className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Tambah kelas pertama
										</Link>
									</TableCell>
								</TableRow>
							) : (
								kelas.map((item) => (
									<TableRow key={item.id} className="hover:bg-background/60 transition-colors">
										<TableCell>
											<span className="font-semibold text-foreground block text-sm">{item.judul}</span>
											<span className="block font-mono text-xs text-muted-foreground">
												/{item.slug}
											</span>
										</TableCell>
										<TableCell className="font-mono text-xs font-semibold text-foreground">
											{formatRupiah(item.harga.toString())}
										</TableCell>
										<TableCell className="text-xs">
											<span className="font-semibold text-foreground">{item._count.enrollments} / {item.kuota} terpakai</span>
											<span className="block text-muted-foreground text-xs">
												Sisa {sisaKuota(item.kuota, item._count.enrollments)} kursi
											</span>
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{formatTanggalWaktu(item.jadwalMulai)} WIB
										</TableCell>
										<TableCell>
											<LencanaAktif aktif={item.aktif} />
										</TableCell>
										<TableCell className="text-right">
											<div className="flex flex-wrap items-center justify-end gap-2">
												<Link
													href={`/admin/kelas/${item.id}/ubah`}
													className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												>
													Edit
												</Link>
											<FormulirAksi
												aksi={aksiUbahStatusKelas}
												nilai={{
													classId: item.id,
													aktif: item.aktif ? "false" : "true",
												}}
												label={item.aktif ? "Nonaktifkan" : "Aktifkan"}
												variant="outline"
												kelas="[&_button]:min-h-11"
											/>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>
		</div>
	)
}
