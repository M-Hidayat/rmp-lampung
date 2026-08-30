import type { Metadata } from "next"
import { ExternalLink, Search } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { LencanaStatusSertifikat } from "@/components/status-lencana"
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
import { auditSertifikat } from "@/lib/layanan/sertifikat"
import { formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Audit sertifikat" }
export const dynamic = "force-dynamic"

export default async function HalamanAuditSertifikat() {
	const sesi = await sesiPengguna()
	const sertifikat = await auditSertifikat(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Audit sertifikat
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Jejak penerbitan, pembatalan, dan perubahan sertifikat. Data tidak dapat dihapus untuk menjaga integritas audit.
					</p>
				</div>
			</div>

			{/* Main Audit Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Audit Trail Dokumen ({sertifikat.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari nomor / peserta..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Nomor</TableHead>
								<TableHead>Peserta</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Hadir</TableHead>
								<TableHead>Terbit</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Perubahan terakhir</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sertifikat.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada data sertifikat pada sistem.
									</TableCell>
								</TableRow>
							) : (
								sertifikat.map((item) => (
									<TableRow key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-mono text-xs">
											<span className="font-semibold text-zinc-900 block">{item.nomor}</span>
											<a
												href={`/verifikasi/${encodeURIComponent(item.nomor)}`}
												className="inline-flex items-center gap-0.5 text-[11px] text-[#854D0E] hover:underline hover:text-[#713F12] mt-0.5"
											>
												<ExternalLink className="size-2.5" /> Verifikasi
											</a>
										</TableCell>
										<TableCell className="text-xs">
											<span className="font-semibold text-zinc-900 block">{item.attendance.enrollment.user.nama}</span>
											<span className="block text-zinc-400 font-mono text-[11px]">
												{item.attendance.enrollment.user.email}
											</span>
										</TableCell>
										<TableCell className="text-xs font-medium text-zinc-800">
											{item.attendance.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="text-xs text-zinc-600 font-medium">
											{formatTanggalWaktu(item.attendance.waktuScan)} WIB
										</TableCell>
										<TableCell className="text-xs text-zinc-600 font-medium">
											{formatTanggalWaktu(item.diterbitkanPada)} WIB
										</TableCell>
										<TableCell>
											<LencanaStatusSertifikat
												dibatalkan={Boolean(item.revokedAt)}
											/>
											{item.revokedAt ? (
												<span className="mt-1 block text-[11px] text-red-600 font-medium">
													Dibatalkan {formatTanggalWaktu(item.revokedAt)} WIB
												</span>
											) : null}
										</TableCell>
										<TableCell className="text-right text-xs text-zinc-500 font-medium">
											{formatTanggalWaktu(item.updatedAt)} WIB
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
