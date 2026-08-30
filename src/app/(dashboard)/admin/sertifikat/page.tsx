import type { Metadata } from "next"
import { Search } from "lucide-react"

import {
	aksiBatalkanSertifikat,
	aksiPulihkanSertifikat,
	aksiTerbitkanSertifikat,
} from "../../aksi"
import { FormulirAksi } from "@/components/formulir-aksi"
import { JudulHalaman } from "@/components/kerangka"
import { LencanaStatusSertifikat } from "@/components/status-lencana"
import { Alert } from "@/components/ui/alert"
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
import {
	kandidatSertifikat,
	daftarSertifikatOperasional,
} from "@/lib/layanan/sertifikat"
import { formatTanggal, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Penerbitan sertifikat" }
export const dynamic = "force-dynamic"

export default async function HalamanSertifikatAdmin() {
	const sesi = await sesiPengguna()
	const [kandidat, sertifikat] = await Promise.all([
		kandidatSertifikat(sesi),
		daftarSertifikatOperasional(sesi),
	])

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Penerbitan sertifikat
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Sertifikat diterbitkan per absensi kehadiran dan diverifikasi secara publik via QR.
					</p>
				</div>
			</div>

			<Alert variant="info" judul="Syarat penerbitan sertifikat">
				<p>
					Sertifikat hanya dapat diterbitkan untuk peserta yang status
					pendaftarannya PAID dan kehadirannya sudah tercatat.
				</p>
			</Alert>

			{/* Candidate Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-[#F5F3EF] pb-2">
					<h2 className="text-base font-bold text-zinc-950 font-heading">
						Peserta Berhak Menerima Sertifikat ({kandidat.length})
					</h2>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Peserta</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Waktu hadir</TableHead>
								<TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{kandidat.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="text-muted-foreground py-8 text-center text-xs">
										Tidak ada kandidat penerbitan saat ini.
									</TableCell>
								</TableRow>
							) : (
								kandidat.map((item) => (
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
										<TableCell className="text-xs text-zinc-600">
											{formatTanggalWaktu(item.waktuScan)} WIB
										</TableCell>
										<TableCell className="text-right">
											<FormulirAksi
												aksi={aksiTerbitkanSertifikat}
												nilai={{ attendanceId: item.id }}
												label="Terbitkan sertifikat"
												variant="gold"
											/>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>

			{/* Issued Certificates Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F5F3EF] pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Sertifikat Terbit ({sertifikat.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
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
								<TableHead>Nomor</TableHead>
								<TableHead>Peserta</TableHead>
								<TableHead>Kelas</TableHead>
								<TableHead>Tanggal terbit</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sertifikat.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-8 text-center text-xs">
										Belum ada sertifikat yang diterbitkan.
									</TableCell>
								</TableRow>
							) : (
								sertifikat.map((item) => (
									<TableRow key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-mono text-xs font-semibold text-zinc-900">
											{item.nomor}
										</TableCell>
										<TableCell>
											<span className="font-semibold text-zinc-900 block text-sm">{item.attendance.enrollment.user.nama}</span>
											<span className="block text-zinc-400 font-mono text-[11px]">
												{item.attendance.enrollment.user.email}
											</span>
										</TableCell>
										<TableCell className="text-xs font-medium text-zinc-800">
											{item.attendance.enrollment.kelas.judul}
										</TableCell>
										<TableCell className="text-xs text-zinc-600">
											{formatTanggal(item.diterbitkanPada)}
										</TableCell>
										<TableCell>
											<LencanaStatusSertifikat
												dibatalkan={Boolean(item.revokedAt)}
											/>
										</TableCell>
										<TableCell className="text-right">
											{item.revokedAt ? (
												<FormulirAksi
													aksi={aksiPulihkanSertifikat}
													nilai={{ certificateId: item.id }}
													label="Pulihkan"
													variant="outline"
													konfirmasi="Pulihkan sertifikat yang dibatalkan ini?"
												/>
											) : (
												<FormulirAksi
													aksi={aksiBatalkanSertifikat}
													nilai={{ certificateId: item.id }}
													label="Batalkan"
													variant="outline"
													konfirmasi="Batalkan sertifikat ini? Sertifikat yang dibatalkan akan gagal verifikasi publik."
												/>
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
