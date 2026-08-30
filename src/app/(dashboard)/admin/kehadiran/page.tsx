import type { Metadata } from "next"
import { Search } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
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
import { rekapKehadiran } from "@/lib/layanan/absensi"
import { formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Rekap kehadiran" }
export const dynamic = "force-dynamic"

export default async function HalamanKehadiranAdmin() {
	const sesi = await sesiPengguna()
	const daftar = await rekapKehadiran(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Rekap kehadiran
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Kehadiran peserta hanya tercatat melalui pemindaian QR absensi yang valid.
					</p>
				</div>
			</div>

			{/* Main Data Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Data Kehadiran Peserta ({daftar.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari nama / kelas..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Peserta</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Waktu scan</TableHead>
								<TableHead className="text-right">Sertifikat</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{daftar.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada kehadiran tercatat.
									</TableCell>
								</TableRow>
							) : (
								daftar.map((item) => (
									<TableRow key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell>
											<span className="font-semibold text-zinc-900 block text-sm">{item.enrollment.user.nama}</span>
											<span className="block text-zinc-400 font-mono text-[11px]">
												{item.enrollment.user.email}
											</span>
										</TableCell>
										<TableCell className="text-xs font-medium text-zinc-800">
											{item.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="text-xs text-zinc-600 font-medium">
											{formatTanggalWaktu(item.waktuScan)} WIB
										</TableCell>
										<TableCell className="text-right font-mono text-xs">
											{item.certificate ? (
												<span className="text-emerald-700 font-semibold">
													{item.certificate.nomor}
												</span>
											) : (
												<span className="text-zinc-400 text-[11px]">
													Belum diterbitkan
												</span>
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
