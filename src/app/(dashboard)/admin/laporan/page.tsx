import type { Metadata } from "next"
import { TrendingUp, CreditCard, Receipt, Calendar, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { laporanBisnis, transaksiBerhasil } from "@/lib/layanan/laporan"
import { formatRupiah, formatTanggal, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Laporan bisnis" }
export const dynamic = "force-dynamic"

type Props = { searchParams: Promise<{ dari?: string; sampai?: string }> }

/** Nilai tanggal untuk input type="date". */
function keNilaiTanggal(tanggal: Date): string {
	return tanggal.toISOString().slice(0, 10)
}

export default async function HalamanLaporanAdmin({ searchParams }: Props) {
	const { dari, sampai } = await searchParams
	const sesi = await sesiPengguna()

	const akhir = sampai ? new Date(`${sampai}T23:59:59.999Z`) : new Date()
	const awal = dari
		? new Date(`${dari}T00:00:00.000Z`)
		: new Date(akhir.getTime() - 29 * 24 * 60 * 60 * 1000)

	const periode = { dari: awal.toISOString(), sampai: akhir.toISOString() }
	const [laporan, transaksi] = await Promise.all([
		laporanBisnis(sesi, periode),
		transaksiBerhasil(sesi, periode),
	])

	return (
		<div className="flex flex-col gap-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
						Laporan bisnis
					</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Pantauan omzet finansial, rata-rata transaksi, dan performa setiap kelas pelatihan kuliner Rumah Mama Pintar.
					</p>
				</div>
			</div>

			{/* Filter Periode Laporan */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				<div className="border-b border-border pb-3">
					<h2 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
						<Calendar className="size-4 text-foreground font-semibold" />
						Periode Laporan Finansial
					</h2>
					<p className="text-xs text-muted-foreground mt-0.5">
						Menampilkan data transaksi dari {formatTanggal(laporan.periode.dari)} sampai{" "}
						{formatTanggal(laporan.periode.sampai)}
					</p>
				</div>
				<div>
					<form
						method="get"
						className="flex flex-wrap items-end gap-3"
						action="/admin/laporan"
					>
						<div className="flex flex-col gap-1.5 min-w-[160px]">
							<Label htmlFor="dari" className="text-xs font-semibold text-muted-foreground">Dari Tanggal</Label>
							<Input
								id="dari"
								name="dari"
								type="date"
								defaultValue={keNilaiTanggal(laporan.periode.dari)}
								className="h-9 text-xs rounded-md border-input focus:border-primary"
							/>
						</div>
						<div className="flex flex-col gap-1.5 min-w-[160px]">
							<Label htmlFor="sampai" className="text-xs font-semibold text-muted-foreground">Sampai Tanggal</Label>
							<Input
								id="sampai"
								name="sampai"
								type="date"
								defaultValue={keNilaiTanggal(laporan.periode.sampai)}
								className="h-9 text-xs rounded-md border-input focus:border-primary"
							/>
						</div>
						<Button type="submit" variant="gold" size="sm" className="h-9 font-semibold rounded-md ">
							Terapkan Filter
						</Button>
					</form>
				</div>
			</div>

			{/* KPI Financial Cards */}
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Total Pendapatan (Omzet)
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
							<TrendingUp className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground font-heading">
						{formatRupiah(laporan.totalPendapatan)}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Pembayaran lunas via gateway Pakasir
					</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Transaksi Berhasil
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground font-semibold">
							<Receipt className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground font-heading">
						{laporan.jumlahTransaksiBerhasil}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Peserta terkonfirmasi lunas
					</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Rata-rata Nilai Transaksi
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground font-semibold">
							<CreditCard className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground font-heading">
						{formatRupiah(laporan.rataRataNilaiTransaksi)}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Average order value (AOV)
					</p>
				</div>
			</div>

			{/* Breakdown Pendapatan per Kelas */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				<div className="border-b border-border pb-2">
					<h2 className="text-base font-bold text-foreground font-heading">
						Peserta dan Kehadiran per Kelas
					</h2>
				</div>
				<TableWrapper>
					<Table>
						<TableHeader className="bg-background rounded-lg">
							<TableRow>
								<TableHead>Kelas</TableHead>
								<TableHead>Peserta aktif</TableHead>
								<TableHead>Peserta lunas</TableHead>
								<TableHead>Kehadiran</TableHead>
								<TableHead className="text-right">Pendapatan periode</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{laporan.kelas.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-muted-foreground py-8 text-center text-xs">
										Belum ada data kelas pada periode ini.
									</TableCell>
								</TableRow>
							) : (
								laporan.kelas.map((baris) => (
									<TableRow key={baris.classId} className="hover:bg-background/60 transition-colors">
										<TableCell className="font-semibold text-foreground text-sm">
											{baris.judul}
										</TableCell>
										<TableCell className="text-muted-foreground text-xs font-medium">{baris.pesertaAktif}</TableCell>
										<TableCell className="text-muted-foreground text-xs font-medium">{baris.pesertaLunas}</TableCell>
										<TableCell className="text-muted-foreground text-xs font-medium">{baris.kehadiran}</TableCell>
										<TableCell className="font-mono font-semibold text-foreground font-semibold text-xs text-right">{formatRupiah(baris.pendapatan)}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>

			{/* Kelas Populer Leaderboard */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				<div className="border-b border-border pb-3">
					<h2 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
						<Trophy className="size-4 text-foreground font-semibold" />
						Kelas Terpopuler (Berdasarkan Peserta Lunas)
					</h2>
					<p className="text-xs text-muted-foreground mt-0.5">
						Peringkat kelas kuliner dengan peminat tertinggi pada periode ini.
					</p>
				</div>
				<div className="pt-1 text-xs sm:text-sm">
					{laporan.kelasPopuler.length === 0 ? (
						<p className="text-muted-foreground py-4 text-center text-xs">Belum ada data transaksi lunas.</p>
					) : (
						<ol className="flex flex-col gap-2">
							{laporan.kelasPopuler.map((item, idx) => (
								<li key={item.judul} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
									<div className="flex items-center gap-3">
										<span className="flex size-6 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground ">
											{idx + 1}
										</span>
										<span className="font-semibold text-foreground text-sm">{item.judul}</span>
									</div>
									<span className="text-foreground font-semibold text-xs font-semibold bg-card px-2.5 py-1 rounded-lg border border-warning/30">
										{item.pesertaLunas} peserta lunas
									</span>
								</li>
							))}
						</ol>
					)}
				</div>
			</div>

			{/* Buku Besar Transaksi Berhasil */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				<div className="border-b border-border pb-2">
					<h2 className="text-base font-bold text-foreground font-heading">
						Transaksi Berhasil (Ledger)
					</h2>
				</div>
				<TableWrapper>
					<Table>
						<TableHeader className="bg-background rounded-lg">
							<TableRow>
								<TableHead>Referensi</TableHead>
								<TableHead>Peserta</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Nominal</TableHead>
								<TableHead>Waktu bayar</TableHead>
								<TableHead className="text-right">Invoice</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transaksi.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-8 text-center text-xs">
										Tidak ada transaksi berhasil pada periode ini.
									</TableCell>
								</TableRow>
							) : (
								transaksi.map((bayar) => (
									<TableRow key={bayar.id} className="hover:bg-background/60 transition-colors">
										<TableCell className="font-mono text-xs font-semibold text-foreground">
											{bayar.pakasirRef}
										</TableCell>
										<TableCell className="text-xs">
											<span className="font-semibold text-foreground block text-sm">{bayar.enrollment.user.nama}</span>
										</TableCell>
										<TableCell className="text-xs font-medium text-foreground">
											{bayar.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="font-mono font-semibold text-xs text-foreground font-semibold">
											{formatRupiah(bayar.nominal.toString())}
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{bayar.dibayarPada
												? `${formatTanggalWaktu(bayar.dibayarPada)} WIB`
												: "-"}
											{bayar.metode ? ` · ${bayar.metode}` : ""}
										</TableCell>
										<TableCell className="font-mono text-xs font-medium text-right">
											{bayar.invoice ? (
												<a
													className="text-foreground font-semibold font-medium hover:text-muted-foreground hover:underline"
													href={`/api/invoice/${bayar.invoice.id}/pdf`}
												>
													{bayar.invoice.nomor}
												</a>
											) : (
												<span className="text-muted-foreground text-xs">-</span>
											)}
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
