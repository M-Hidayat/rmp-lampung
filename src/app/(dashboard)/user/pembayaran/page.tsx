import type { Metadata } from "next"
import { FileText, Search, Filter, Download, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

import { JudulHalaman } from "@/components/kerangka"
import { LencanaStatusPembayaran } from "@/components/status-lencana"
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
import { statusPembayaranSaya } from "@/lib/layanan/pembayaran"
import { kelasSaya } from "@/lib/layanan/pendaftaran"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Pembayaran" }
export const dynamic = "force-dynamic"

type Props = { searchParams: Promise<{ order_id?: string }> }

export default async function HalamanPembayaranUser({ searchParams }: Props) {
	const { order_id: orderId } = await searchParams
	const sesi = await sesiPengguna()

	const [pendaftaran, pembayaranSorotan] = await Promise.all([
		kelasSaya(sesi),
		orderId ? statusPembayaranSaya(sesi, orderId) : Promise.resolve(null),
	])

	const daftarPembayaran = pendaftaran.filter((item) => item.payment)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Pembayaran
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Status pembayaran terverifikasi otomatis via gateway Pakasir. Invoice resmi terbit saat pembayaran lunas.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm" className="bg-white border-[#EFECE6] text-xs h-9 font-medium text-zinc-700 hover:bg-[#FAF8F5] rounded-xl shadow-xs">
						<Link href="/user/invoice">
							Daftar Invoice PDF
						</Link>
					</Button>
					<Button asChild size="sm" variant="gold" className="text-xs h-9 font-semibold rounded-xl shadow-xs">
						<Link href="/kelas">
							Pilih Kursus Baru <ArrowRight className="size-3.5 ml-1" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Sorotan Transaksi dari Redirect Pakasir */}
			{orderId ? (
				pembayaranSorotan ? (
					<div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-3">
						<div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
							<div>
								<h3 className="text-base font-bold text-zinc-950">
									Status Transaksi #{pembayaranSorotan.pakasirRef}
								</h3>
								<p className="text-xs text-zinc-500">
									Informasi status pembayaran terkini yang tercatat pada server.
								</p>
							</div>
							<LencanaStatusPembayaran status={pembayaranSorotan.status} />
						</div>

						<div className="grid gap-3 sm:grid-cols-2 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 text-xs">
							<div>
								<span className="text-zinc-500 block">Kelas Kuliner</span>
								<span className="font-semibold text-zinc-900 text-sm">
									{pembayaranSorotan.enrollment.kelas.judul}
								</span>
							</div>
							<div>
								<span className="text-zinc-500 block">Total Nominal</span>
								<span className="font-mono font-bold text-zinc-950 text-sm">
									{formatRupiah(pembayaranSorotan.nominal.toString())}
								</span>
							</div>
						</div>

						{pembayaranSorotan.status === "PENDING" ? (
							<Alert variant="peringatan" judul="Menunggu Konfirmasi Gateway">
								<p>
									Halaman kembali dari penyedia pembayaran bukan bukti pembayaran akhir. Muat ulang halaman ini beberapa saat lagi setelah transfer berhasil diverifikasi.
								</p>
							</Alert>
						) : null}

						{pembayaranSorotan.invoice ? (
							<div className="flex items-center justify-between pt-2">
								<span className="text-xs text-zinc-600">
									Invoice resmi telah diterbitkan otomatis:
								</span>
								<Button asChild size="sm" variant="outline" className="text-xs bg-white">
									<a
										href={`/api/invoice/${pembayaranSorotan.invoice.id}/pdf`}
										className="inline-flex items-center gap-1.5"
									>
										<FileText className="size-3.5 text-zinc-600" />
										Unduh {pembayaranSorotan.invoice.nomor}
									</a>
								</Button>
							</div>
						) : null}
					</div>
				) : (
					<Alert variant="gagal" judul="Transaksi tidak ditemukan">
						<p>
							Referensi pembayaran tersebut tidak terdaftar pada akun Anda.
						</p>
					</Alert>
				)
			) : null}

			{/* Main Data Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Riwayat Pembayaran ({daftarPembayaran.length})
						</h2>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari referensi..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
					</div>
				</div>

				{/* Table Container */}
				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Referensi</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Nominal</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Waktu bayar</TableHead>
								<TableHead className="text-right">Invoice</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{daftarPembayaran.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada riwayat transaksi pembayaran.
									</TableCell>
								</TableRow>
							) : (
								daftarPembayaran.map((item) =>
									item.payment ? (
										<TableRow key={item.payment.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
											<TableCell className="font-mono text-xs font-semibold text-zinc-900">
												{item.payment.pakasirRef}
											</TableCell>
											<TableCell className="font-medium text-zinc-900 text-sm">
												{item.kelas.judul}
											</TableCell>
											<TableCell className="font-mono font-semibold text-[#854D0E]">
												{formatRupiah(item.payment.nominal.toString())}
											</TableCell>
											<TableCell>
												<LencanaStatusPembayaran status={item.payment.status} />
											</TableCell>
											<TableCell className="text-xs text-zinc-500">
												{item.payment.dibayarPada
													? `${formatTanggalWaktu(item.payment.dibayarPada)} WIB`
													: "Belum dibayar"}
											</TableCell>
											<TableCell className="text-right text-xs">
												{item.payment.invoice ? (
													<a
														className="inline-flex items-center gap-1 font-medium text-zinc-900 hover:text-[#B47517] hover:underline"
														href={`/api/invoice/${item.payment.invoice.id}/pdf`}
													>
														<FileText className="size-3.5 text-[#D49A28]" />
														{item.payment.invoice.nomor}
													</a>
												) : (
													<span className="text-zinc-400 text-[11px]">Belum tersedia</span>
												)}
											</TableCell>
										</TableRow>
									) : null,
								)
							)}
						</TableBody>
					</Table>
				</TableWrapper>

				{/* Card Pagination Footer — Bodyshop Reference */}
				<div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs text-zinc-500">
					<span>Menampilkan {daftarPembayaran.length} data transaksi</span>
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="size-7 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 disabled:opacity-50"
							disabled
						>
							<ChevronLeft className="size-3.5" />
						</button>
						<button
							type="button"
							className="size-7 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 disabled:opacity-50"
							disabled
						>
							<ChevronRight className="size-3.5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
