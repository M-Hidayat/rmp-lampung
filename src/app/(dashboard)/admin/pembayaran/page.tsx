import type { Metadata } from "next"
import { Search, Radio, CheckCircle2, Copy, FileCode2 } from "lucide-react"

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
import { konfigurasi } from "@/lib/konfigurasi"
import { daftarPembayaranOperasional } from "@/lib/layanan/pembayaran"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Pembayaran & Webhook Gateway" }
export const dynamic = "force-dynamic"

export default async function HalamanPembayaranAdmin() {
	const sesi = await sesiPengguna()
	const pembayaran = await daftarPembayaranOperasional(sesi)
	const env = konfigurasi()

	const webhookUrl = `${env.APP_URL}/api/pakasir/webhook`

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Pembayaran &amp; Webhook Gateway
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Monitoring transaksi dan integrasi Webhook Payment Gateway Pakasir secara realtime.
					</p>
				</div>
			</div>

			{/* Webhook Configuration & Endpoint Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-[#F5F3EF] pb-3">
					<div className="flex items-center gap-2">
						<Radio className="size-4 text-[#D49A28] animate-pulse" />
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Informasi Webhook Pakasir
						</h2>
					</div>
					<span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FDE68A] bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#854D0E]">
						Mode: {env.PAKASIR_MODE.toUpperCase()}
					</span>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="space-y-1 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
						<span className="text-xs text-zinc-500 font-medium">Webhook URL (Pasang di Pakasir):</span>
						<p className="font-mono text-xs font-bold text-[#854D0E] break-all select-all">
							{webhookUrl}
						</p>
					</div>

					<div className="space-y-1 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
						<span className="text-xs text-zinc-500 font-medium">Project Slug:</span>
						<p className="font-mono text-xs font-bold text-zinc-900">
							{env.PAKASIR_SLUG || "rmp"}
						</p>
					</div>

					<div className="space-y-1 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3">
						<span className="text-xs text-zinc-500 font-medium">API Base Endpoint:</span>
						<p className="font-mono text-xs font-semibold text-zinc-700">
							{env.PAKASIR_BASE_URL}
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-[#E8DFC8] bg-[#FDF8ED] p-3.5 text-xs text-zinc-700 space-y-1.5">
					<p className="font-semibold text-[#854D0E] flex items-center gap-1.5">
						<CheckCircle2 className="size-3.5" /> Struktur Payload Webhook Resmi (HTTP POST JSON):
					</p>
					<pre className="font-mono text-[11px] bg-white p-2 rounded-lg border border-[#EFECE6] text-zinc-800 overflow-x-auto">
{`{
  "amount": 350000,
  "order_id": "RMP260830XXXX",
  "project": "${env.PAKASIR_SLUG || "rmp"}",
  "status": "completed",
  "payment_method": "qris",
  "completed_at": "${new Date().toISOString()}"
}`}
					</pre>
				</div>
			</div>

			{/* Main Data Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Log Transaksi &amp; Webhook Masuk ({pembayaran.length})
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
								<TableHead>Order ID / Ref</TableHead>
								<TableHead>Peserta</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Nominal</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Waktu / Webhook Log</TableHead>
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
											<div>
												{bayar.dibayarPada
													? `${formatTanggalWaktu(bayar.dibayarPada)} WIB`
													: "Belum dibayar"}
												{bayar.metode ? ` · ${bayar.metode}` : ""}
											</div>
											{bayar.payloadMentah ? (
												<details className="mt-1">
													<summary className="text-[10px] text-[#854D0E] font-semibold cursor-pointer hover:underline">
														Lihat raw payload webhook
													</summary>
													<pre className="mt-1 max-w-xs text-[10px] bg-[#FAF8F5] border border-[#EFECE6] p-1.5 rounded font-mono overflow-x-auto text-zinc-700">
														{JSON.stringify(bayar.payloadMentah, null, 2)}
													</pre>
												</details>
											) : null}
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
