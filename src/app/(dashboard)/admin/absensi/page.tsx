import type { Metadata } from "next"

import { PanelQrAbsensi } from "./panel-qr"
import { aksiTutupSesiAbsensi } from "../../aksi"
import { FormulirAksi } from "@/components/formulir-aksi"
import { JudulHalaman } from "@/components/kerangka"
import { LencanaAktif } from "@/components/status-lencana"
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
import { daftarSesiAbsensi } from "@/lib/layanan/absensi"
import { daftarKelasOperasional } from "@/lib/layanan/kelas"
import { formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Sesi absensi" }
export const dynamic = "force-dynamic"

export default async function HalamanAbsensiAdmin() {
	const sesi = await sesiPengguna()
	const [kelas, sesiAbsensi] = await Promise.all([
		daftarKelasOperasional(sesi),
		daftarSesiAbsensi(sesi),
	])

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Sesi absensi
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Token absensi hanya ditampilkan sekali saat dibuat atau diperbarui.
					</p>
				</div>
			</div>

			<Alert variant="peringatan" judul="Token tidak dapat ditampilkan ulang">
				<p>
					Basis data hanya menyimpan hash token. Bila QR hilang atau kedaluwarsa,
					perbarui token pada sesi yang masih aktif.
				</p>
			</Alert>

			{/* Open Session / Dynamic QR Studio Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="border-b border-[#F5F3EF] pb-3">
					<h2 className="text-base font-bold text-zinc-950 font-heading">Buka sesi absensi</h2>
					<p className="text-xs text-zinc-500">
						Membuka sesi baru akan menutup sesi aktif lain pada kelas yang sama.
					</p>
				</div>
				<div className="pt-2">
					<PanelQrAbsensi
						kelas={kelas.map((item) => ({ id: item.id, judul: item.judul }))}
					/>
				</div>
			</div>

			{/* Session History Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-[#F5F3EF] pb-2">
					<h2 className="text-base font-bold text-zinc-950 font-heading">
						Riwayat Sesi Absensi ({sesiAbsensi.length})
					</h2>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Kelas</TableHead>
								<TableHead>Dibuat</TableHead>
								<TableHead>Kedaluwarsa token</TableHead>
								<TableHead>Kehadiran</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sesiAbsensi.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-8 text-center text-xs">
										Belum ada sesi absensi.
									</TableCell>
								</TableRow>
							) : (
								sesiAbsensi.map((item) => (
									<TableRow key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="text-xs font-semibold text-zinc-900">
											{item.kelas.judul}
										</TableCell>
										<TableCell className="text-xs text-zinc-500">
											{formatTanggalWaktu(item.createdAt)} WIB
										</TableCell>
										<TableCell className="text-xs text-zinc-500">
											{formatTanggalWaktu(item.kedaluwarsaPada)} WIB
										</TableCell>
										<TableCell className="text-xs font-medium text-zinc-700">
											{item._count.attendances} peserta hadir
										</TableCell>
										<TableCell>
											<LencanaAktif aktif={item.aktif} />
										</TableCell>
										<TableCell className="text-right">
											{item.aktif ? (
												<FormulirAksi
													aksi={aksiTutupSesiAbsensi}
													nilai={{ sessionId: item.id }}
													label="Tutup sesi"
													variant="outline"
													konfirmasi="Tutup sesi absensi ini?"
												/>
											) : (
												<span className="text-xs text-zinc-400">Ditutup</span>
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
