import type { Metadata } from "next"
import { Search } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { LencanaStatusPembayaran } from "@/components/status-lencana"
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
import { daftarPembayaranOperasional } from "@/lib/layanan/pembayaran"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Pembayaran masuk" }
export const dynamic = "force-dynamic"

export default async function HalamanPembayaranAdmin() {
	const sesi = await sesiPengguna()
	const pembayaran = await daftarPembayaranOperasional(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Pembayaran masuk
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Riwayat transaksi pembayaran kursus kuliner yang diproses melalui gateway Pakasir.
					</p>
				</div>
			</div>

			{/* Main Data Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Transaksi Pembayaran ({pembayaran.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari referensi / peserta..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Referensi</TableHead>
								<TableHead>Peserta</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Nominal</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Waktu bayar</TableHead>
								<TableHead className="text-right">Invoice</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pembayaran.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada transaksi pembayaran.
									</TableCell>
								</TableRow>
							) : (
								pembayaran.map((bayar) => (
									<TableRow key={bayar.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-mono text-xs font-semibold text-zinc-900">
											{bayar.pakasirRef}
										</TableCell>
										<TableCell className="text-xs">
											<span className="font-semibold text-zinc-900 block text-sm">{bayar.enrollment.user.nama}</span>
											<span className="block text-zinc-400 font-mono text-[11px]">
												{bayar.enrollment.user.email}
											</span>
										</TableCell>
										<TableCell className="text-xs font-medium text-zinc-800">
											{bayar.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="font-mono font-semibold text-[#854D0E] text-xs">
											{formatRupiah(bayar.nominal.toString())}
										</TableCell>
										<TableCell>
											<LencanaStatusPembayaran status={bayar.status} />
										</TableCell>
										<TableCell className="text-xs text-zinc-500">
											{bayar.dibayarPada
												? `${formatTanggalWaktu(bayar.dibayarPada)} WIB`
												: "Belum dibayar"}
										</TableCell>
										<TableCell className="text-right text-xs">
											{bayar.invoice ? (
												<a
													className="text-[#854D0E] font-medium hover:text-[#713F12] hover:underline"
													href={`/api/invoice/${bayar.invoice.id}/pdf`}
												>
													{bayar.invoice.nomor}
												</a>
											) : (
												<span className="text-zinc-400 text-[11px]">Belum terbit</span>
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
