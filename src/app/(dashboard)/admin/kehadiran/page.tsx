import type { Metadata } from "next"

import { FormulirAbsensiManual } from "./formulir-absensi-manual"
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
import { pesertaBelumHadir, rekapKehadiran } from "@/lib/layanan/absensi"
import { formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Rekap kehadiran" }
export const dynamic = "force-dynamic"

export default async function HalamanKehadiranAdmin() {
	const sesi = await sesiPengguna()
	const [daftar, menunggu] = await Promise.all([
		rekapKehadiran(sesi),
		pesertaBelumHadir(sesi),
	])

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Rekap kehadiran
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
					Kehadiran tercatat otomatis melalui pemindaian QR, atau dicatat manual oleh admin
					ketika peserta tidak dapat memindai.
				</p>
				</div>
			</div>

			{/* Absensi manual oleh admin */}
			<div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm space-y-4">
				<div>
					<h2 className="text-base font-bold text-zinc-950 font-heading">
						Absensi manual
					</h2>
					<p className="text-xs text-zinc-500 mt-0.5">
						Catat kehadiran peserta yang lunas namun tidak sempat memindai QR. Kehadiran tetap
						satu kali per pendaftaran.
					</p>
				</div>
				<FormulirAbsensiManual peserta={menunggu} />
			</div>

			{/* Main Data Table Card */}
			<div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Data Kehadiran Peserta ({daftar.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#F8FAFC] rounded-lg">
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
									<TableRow key={item.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
										<TableCell>
											<span className="font-semibold text-zinc-900 block text-sm">{item.enrollment.user.nama}</span>
											<span className="block text-zinc-400 font-mono text-xs">
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
												<span className="text-zinc-800 font-semibold">
													{item.certificate.nomor}
												</span>
											) : (
												<span className="text-zinc-400 text-xs">
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
