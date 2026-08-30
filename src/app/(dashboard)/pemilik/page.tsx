import type { Metadata } from "next"
import { TrendingUp, CreditCard, Receipt, Calendar, Trophy, ArrowRight } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
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

export default async function HalamanLaporanPemilik({ searchParams }: Props) {
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
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Laporan bisnis
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Pantauan omzet finansial, rata-rata transaksi, dan performa setiap kelas pelatihan kuliner RMP Lampung.
					</p>
				</div>
			</div>

			{/* Filter Periode Laporan */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="border-b border-[#F5F3EF] pb-3">
					<h2 className="text-base font-bold text-zinc-950 font-heading flex items-center gap-2">
						<Calendar className="size-4 text-[#D49A28]" />
						Periode Laporan Finansial
					</h2>
					<p className="text-xs text-zinc-500 mt-0.5">
						Menampilkan data transaksi dari {formatTanggal(laporan.periode.dari)} sampai{" "}
						{formatTanggal(laporan.periode.sampai)}
					</p>
				</div>
				<div>
					<form
						method="get"
						className="flex flex-wrap items-end gap-3"
						action="/pemilik"
					>
						<div className="space-y-1.5 min-w-[160px]">
							<Label htmlFor="dari" className="text-xs font-semibold text-zinc-700">Dari Tanggal</Label>
							<Input
								id="dari"
								name="dari"
								type="date"
								defaultValue={keNilaiTanggal(laporan.periode.dari)}
								className="h-9 text-xs rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
							/>
						</div>
						<div className="space-y-1.5 min-w-[160px]">
							<Label htmlFor="sampai" className="text-xs font-semibold text-zinc-700">Sampai Tanggal</Label>
							<Input
								id="sampai"
								name="sampai"
								type="date"
								defaultValue={keNilaiTanggal(laporan.periode.sampai)}
								className="h-9 text-xs rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
							/>
						</div>
						<Button type="submit" variant="gold" size="sm" className="h-9 font-semibold rounded-xl shadow-xs">
							Terapkan Filter
						</Button>
					</form>
				</div>
			</div>

			{/* KPI Financial Cards */}
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Total Pendapatan (Omzet)
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
							<TrendingUp className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{formatRupiah(laporan.totalPendapatan)}
					</p>
					<p className="mt-1 text-[11px] text-zinc-400">
						Pembayaran lunas via gateway Pakasir
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Transaksi Berhasil
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<Receipt className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{laporan.jumlahTransaksiBerhasil}
					</p>
					<p className="mt-1 text-[11px] text-zinc-400">
						Peserta terkonfirmasi lunas
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Rata-rata Nilai Transaksi
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<CreditCard className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{formatRupiah(laporan.rataRataNilaiTransaksi)}
					</p>
					<p className="mt-1 text-[11px] text-zinc-400">
						Average order value (AOV)
					</p>
				</div>
			</div>

			{/* Breakdown Pendapatan per Kelas */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="border-b border-[#F5F3EF] pb-2">
					<h2 className="text-base font-bold text-zinc-950 font-heading">
						Peserta dan Kehadiran per Kelas
					</h2>
				</div>
				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
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
									<TableRow key={baris.classId} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-semibold text-zinc-900 text-sm">
											{baris.judul}
										</TableCell>
										<TableCell className="text-zinc-700 text-xs font-medium">{baris.pesertaAktif}</TableCell>
										<TableCell className="text-zinc-700 text-xs font-medium">{baris.pesertaLunas}</TableCell>
										<TableCell className="text-zinc-700 text-xs font-medium">{baris.kehadiran}</TableCell>
										<TableCell className="font-mono font-semibold text-[#854D0E] text-xs text-right">{formatRupiah(baris.pendapatan)}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>

			{/* Kelas Populer Leaderboard */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="border-b border-[#F5F3EF] pb-3">
					<h2 className="text-base font-bold text-zinc-950 font-heading flex items-center gap-2">
						<Trophy className="size-4 text-[#D49A28]" />
						Kelas Terpopuler (Berdasarkan Peserta Lunas)
					</h2>
					<p className="text-xs text-zinc-500 mt-0.5">
						Peringkat kelas kuliner dengan peminat tertinggi pada periode ini.
					</p>
				</div>
				<div className="pt-1 text-xs sm:text-sm">
					{laporan.kelasPopuler.length === 0 ? (
						<p className="text-zinc-400 py-4 text-center text-xs">Belum ada data transaksi lunas.</p>
					) : (
						<ol className="space-y-2">
							{laporan.kelasPopuler.map((item, idx) => (
								<li key={item.judul} className="flex items-center justify-between rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
									<div className="flex items-center gap-3">
										<span className="flex size-6 items-center justify-center rounded-lg bg-[#D49A28] text-xs font-bold text-white shadow-2xs">
											{idx + 1}
										</span>
										<span className="font-semibold text-zinc-900 text-sm">{item.judul}</span>
									</div>
									<span className="text-[#854D0E] text-xs font-semibold bg-white px-2.5 py-1 rounded-lg border border-[#E8DFC8]">
										{item.pesertaLunas} peserta lunas
									</span>
								</li>
							))}
						</ol>
					)}
				</div>
			</div>

			{/* Buku Besar Transaksi Berhasil */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="border-b border-[#F5F3EF] pb-2">
					<h2 className="text-base font-bold text-zinc-950 font-heading">
						Transaksi Berhasil (Ledger)
					</h2>
				</div>
				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
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
									<TableRow key={bayar.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-mono text-xs font-semibold text-zinc-900">
											{bayar.pakasirRef}
										</TableCell>
										<TableCell className="text-xs">
											<span className="font-semibold text-zinc-900 block text-sm">{bayar.enrollment.user.nama}</span>
										</TableCell>
										<TableCell className="text-xs font-medium text-zinc-800">
											{bayar.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="font-mono font-semibold text-xs text-[#854D0E]">
											{formatRupiah(bayar.nominal.toString())}
										</TableCell>
										<TableCell className="text-xs text-zinc-500">
											{bayar.dibayarPada
												? `${formatTanggalWaktu(bayar.dibayarPada)} WIB`
												: "-"}
											{bayar.metode ? ` · ${bayar.metode}` : ""}
										</TableCell>
										<TableCell className="font-mono text-xs font-medium text-right">
											{bayar.invoice ? (
												<a
													className="text-[#854D0E] font-medium hover:text-[#713F12] hover:underline"
													href={`/api/invoice/${bayar.invoice.id}/pdf`}
												>
													{bayar.invoice.nomor}
												</a>
											) : (
												<span className="text-zinc-400 text-[11px]">-</span>
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
