import type { Metadata } from "next"
import { FileDown, FileText, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

import { JudulHalaman } from "@/components/kerangka"
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
import { invoiceSaya } from "@/lib/layanan/invoice"
import { formatRupiah, formatTanggal } from "@/lib/uang"

export const metadata: Metadata = { title: "Invoice saya" }
export const dynamic = "force-dynamic"

export default async function HalamanInvoiceUser() {
	const sesi = await sesiPengguna()
	const daftar = await invoiceSaya(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header — Bodyshop Reference */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950">
						Invoice
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Bukti transaksi pembayaran kelas yang diterbitkan otomatis dalam format PDF resmi.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm" className="bg-white text-xs h-9 font-medium">
						<Link href="/user/pembayaran">
							Riwayat Pembayaran
						</Link>
					</Button>
				</div>
			</div>

			{/* Main Table Card — Bodyshop Reference */}
			<div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-bold text-zinc-950">
							Dokumen Invoice ({daftar.length})
						</h2>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari nomor invoice..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950"
							/>
						</div>
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-zinc-100/80 rounded-lg">
							<TableRow>
								<TableHead>Nomor invoice</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Nominal</TableHead>
								<TableHead>Tanggal terbit</TableHead>
								<TableHead className="text-right">Unduh</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{daftar.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada invoice yang diterbitkan. Invoice otomatis terbit setelah pembayaran lunas.
									</TableCell>
								</TableRow>
							) : (
								daftar.map((item) => {
									const kelas = item.snapshotKelas as { judul?: string }
									return (
										<TableRow key={item.id}>
											<TableCell className="font-mono text-xs font-semibold text-zinc-900">
												{item.nomor}
											</TableCell>
											<TableCell className="font-medium text-zinc-900 text-sm">
												{kelas?.judul ?? "Kelas Kuliner"}
											</TableCell>
											<TableCell className="font-mono font-semibold text-zinc-950">
												{formatRupiah(item.nominal.toString())}
											</TableCell>
											<TableCell className="text-xs text-zinc-500">
												{formatTanggal(item.dibayarPada)}
											</TableCell>
											<TableCell className="text-right">
												<a
													className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline"
													href={`/api/invoice/${item.id}/pdf`}
												>
													<FileDown className="size-3.5 text-zinc-600" />
													Unduh PDF
												</a>
											</TableCell>
										</TableRow>
									)
								})
							)}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>
		</div>
	)
}
