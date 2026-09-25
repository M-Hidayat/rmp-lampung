import type { Metadata } from "next"
import { Radio, CheckCircle2 } from "lucide-react"

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
		<div className="flex flex-col gap-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
						Pembayaran &amp; Webhook Gateway
					</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Monitoring transaksi dan integrasi Webhook Payment Gateway Pakasir secara realtime.
					</p>
				</div>
			</div>

			{/* Webhook Configuration & Endpoint Card */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				<div className="flex items-center justify-between border-b border-border pb-3">
					<div className="flex items-center gap-2">
						<Radio className="size-4 text-foreground font-semibold animate-pulse" />
						<h2 className="text-base font-bold text-foreground font-heading">
							Informasi Webhook Pakasir
						</h2>
					</div>
					<span className="inline-flex items-center gap-1.5 rounded-lg border border-warning/30 bg-warning-surface px-2.5 py-1 text-xs font-semibold text-foreground font-semibold">
						Mode: {env.PAKASIR_MODE.toUpperCase()}
					</span>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="flex flex-col gap-1 rounded-md border border-border bg-background p-3">
						<span className="text-xs text-muted-foreground font-medium">Webhook URL (Pasang di Pakasir):</span>
						<p className="font-mono text-xs font-bold text-foreground font-semibold break-all select-all">
							{webhookUrl}
						</p>
					</div>

					<div className="flex flex-col gap-1 rounded-md border border-border bg-background p-3">
						<span className="text-xs text-muted-foreground font-medium">Project Slug:</span>
						<p className="font-mono text-xs font-bold text-foreground">
							{env.PAKASIR_SLUG || "rmp"}
						</p>
					</div>

					<div className="flex flex-col gap-1 rounded-md border border-border bg-background p-3">
						<span className="text-xs text-muted-foreground font-medium">API Base Endpoint:</span>
						<p className="font-mono text-xs font-semibold text-muted-foreground">
							{env.PAKASIR_BASE_URL}
						</p>
					</div>
				</div>

				<div className="rounded-md border border-warning/30 bg-accent p-3.5 text-xs text-muted-foreground flex flex-col gap-1.5">
					<p className="font-semibold text-foreground font-semibold flex items-center gap-1.5">
						<CheckCircle2 className="size-3.5" /> Struktur Payload Webhook Resmi (HTTP POST JSON):
					</p>
					<pre className="font-mono text-xs bg-card p-2 rounded-lg border border-border text-foreground overflow-x-auto">
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
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-foreground font-heading">
							Log Transaksi &amp; Webhook Masuk ({pembayaran.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-background rounded-lg">
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
									<TableRow key={bayar.id} className="hover:bg-background/60 transition-colors">
										<TableCell className="font-mono text-xs font-semibold text-foreground">
											{bayar.pakasirRef}
										</TableCell>
										<TableCell className="text-xs">
											<span className="font-semibold text-foreground block text-sm">{bayar.enrollment.user.nama}</span>
											<span className="block text-muted-foreground font-mono text-xs">
												{bayar.enrollment.user.email}
											</span>
										</TableCell>
										<TableCell className="text-xs font-medium text-foreground">
											{bayar.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="font-mono font-semibold text-foreground font-semibold text-xs">
											{formatRupiah(bayar.nominal.toString())}
										</TableCell>
										<TableCell>
											<LencanaStatusPembayaran status={bayar.status} />
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											<div>
												{bayar.dibayarPada
													? `${formatTanggalWaktu(bayar.dibayarPada)} WIB`
													: "Belum dibayar"}
												{bayar.metode ? ` · ${bayar.metode}` : ""}
											</div>
											{bayar.payloadMentah ? (
												<details className="mt-1">
													<summary className="text-xs text-foreground font-semibold font-semibold cursor-pointer hover:underline">
														Lihat raw payload webhook
													</summary>
													<pre className="mt-1 max-w-xs text-xs bg-background border border-border p-1.5 rounded font-mono overflow-x-auto text-muted-foreground">
														{JSON.stringify(bayar.payloadMentah, null, 2)}
													</pre>
												</details>
											) : null}
										</TableCell>
										<TableCell className="text-right text-xs">
											{bayar.invoice ? (
												<a
													className="text-foreground font-semibold font-medium hover:text-muted-foreground hover:underline"
													href={`/api/invoice/${bayar.invoice.id}/pdf`}
												>
													{bayar.invoice.nomor}
												</a>
											) : (
												<span className="text-muted-foreground text-xs">Belum terbit</span>
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
