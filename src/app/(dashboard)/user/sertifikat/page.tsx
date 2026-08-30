import type { Metadata } from "next"
import { ExternalLink, FileDown, Search } from "lucide-react"
import Link from "next/link"

import { JudulHalaman } from "@/components/kerangka"
import { LencanaStatusSertifikat } from "@/components/status-lencana"
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
import { sertifikatSaya } from "@/lib/layanan/sertifikat"
import { formatTanggal } from "@/lib/uang"

export const metadata: Metadata = { title: "Sertifikat saya" }
export const dynamic = "force-dynamic"

export default async function HalamanSertifikatUser() {
	const sesi = await sesiPengguna()
	const daftar = await sertifikatSaya(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Sertifikat
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Sertifikat pelatihan kuliner resmi yang diterbitkan setelah Anda hadir fisik dan menyelesaikan kelas.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm" className="bg-white border-[#EFECE6] text-xs h-9 font-medium text-zinc-700 hover:bg-[#FAF8F5] rounded-xl shadow-xs">
						<Link href="/verifikasi">
							Verifikasi Publik
						</Link>
					</Button>
				</div>
			</div>

			{/* Main Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Sertifikat Resmi ({daftar.length})
						</h2>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari nomor sertifikat..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Nomor sertifikat</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Tanggal terbit</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Tautan &amp; Unduh</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{daftar.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada sertifikat. Sertifikat diterbitkan setelah absensi kehadiran Anda tercatat di kelas.
									</TableCell>
								</TableRow>
							) : (
								daftar.map((item) => (
									<TableRow key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-mono text-xs font-semibold text-zinc-900">
											{item.nomor}
										</TableCell>
										<TableCell className="font-medium text-zinc-900 text-sm">
											{item.attendance.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="text-xs text-zinc-500">
											{formatTanggal(item.diterbitkanPada)}
										</TableCell>
										<TableCell>
											<LencanaStatusSertifikat
												dibatalkan={Boolean(item.revokedAt)}
											/>
										</TableCell>
										<TableCell className="text-right space-x-3 text-xs">
											{!item.revokedAt ? (
												<>
													<a
														className="inline-flex items-center gap-1 font-semibold text-[#854D0E] hover:text-[#713F12] hover:underline"
														href={`/api/sertifikat/${item.id}/pdf`}
													>
														<FileDown className="size-3.5 text-[#D49A28]" />
														Unduh PDF
													</a>
													<Link
														className="inline-flex items-center gap-1 font-medium text-zinc-600 hover:underline hover:text-zinc-950"
														href={`/verifikasi/${encodeURIComponent(item.nomor)}`}
													>
														<ExternalLink className="size-3.5" />
														Verifikasi
													</Link>
												</>
											) : (
												<span className="text-red-600 font-medium">Dibatalkan</span>
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
