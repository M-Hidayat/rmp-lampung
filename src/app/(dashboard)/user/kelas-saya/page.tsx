import type { Metadata } from "next"
import Link from "next/link"
import { FileText, Award, Clock, MapPin, QrCode, ArrowRight } from "lucide-react"

import {
	aksiBatalkanPendaftaran,
	aksiLanjutkanPembayaran,
} from "../../aksi"
import { FormulirAksi } from "@/components/formulir-aksi"
import {
	LencanaStatusPembayaran,
	LencanaStatusPendaftaran,
} from "@/components/status-lencana"
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
import { kelasSaya } from "@/lib/layanan/pendaftaran"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Kelas saya" }
export const dynamic = "force-dynamic"

export default async function HalamanKelasSaya() {
	const sesi = await sesiPengguna()
	const pendaftaran = await kelasSaya(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Kelas saya
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Satu akun hanya dapat memiliki satu pendaftaran per kelas. Pantau status pembayaran, kehadiran fisik, dan dokumen resmi.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm" className="bg-white border-[#E2E8F0] text-xs h-9 font-medium text-zinc-700 hover:bg-[#F8FAFC] rounded-md shadow-sm">
						<Link href="/user/pembayaran">
							Riwayat Tagihan
						</Link>
					</Button>
					<Button asChild size="sm" variant="gold" className="text-xs h-9 font-semibold rounded-md shadow-sm">
						<Link href="/kelas">
							Daftar Kelas Baru <ArrowRight className="size-3.5 ml-1" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Main Table Card */}
			<div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Daftar Kelas ({pendaftaran.length})
						</h2>
					</div>

					<div className="flex flex-wrap items-center gap-2">
					</div>
				</div>

				{/* Table Container */}
				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#F8FAFC] rounded-lg">
							<TableRow>
								<TableHead>Kelas</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Pembayaran</TableHead>
								<TableHead>Kehadiran</TableHead>
								<TableHead>Dokumen</TableHead>
								<TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pendaftaran.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada pendaftaran kelas kuliner.
									</TableCell>
								</TableRow>
							) : (
								pendaftaran.map((item) => (
									<TableRow key={item.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
										<TableCell>
											<span className="font-semibold text-zinc-900 block text-sm">
												{item.kelas.judul}
											</span>
											<div className="space-y-0.5 text-xs text-zinc-500 mt-1">
												<span className="flex items-center gap-1">
													<Clock className="size-3 text-foreground font-semibold" />
													{formatTanggalWaktu(item.kelas.jadwalMulai)} WIB
												</span>
												<span className="flex items-center gap-1 truncate max-w-xs">
													<MapPin className="size-3 text-foreground font-semibold" />
													{item.kelas.lokasi}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<LencanaStatusPendaftaran status={item.status} />
										</TableCell>
										<TableCell>
											{item.payment ? (
												<div className="space-y-1">
													<LencanaStatusPembayaran status={item.payment.status} />
													<span className="block text-xs font-mono font-medium text-foreground font-semibold">
														{formatRupiah(item.payment.nominal.toString())}
													</span>
													<span className="block text-xs font-mono text-zinc-400">
														{item.payment.pakasirRef}
													</span>
												</div>
											) : (
												<span className="text-xs text-zinc-400">
													Tidak ada data
												</span>
											)}
										</TableCell>
										<TableCell className="text-xs font-medium">
											{item.attendance ? (
												<span className="text-zinc-800 font-semibold flex items-center gap-1">
													<span className="size-1.5 rounded-full bg-emerald-600" />
													Hadir ({formatTanggalWaktu(item.attendance.waktuScan)} WIB)
												</span>
											) : (
												<span className="text-zinc-400">Belum absen</span>
											)}
										</TableCell>
										<TableCell className="space-y-1.5 text-xs">
											{item.payment?.invoice ? (
												<a
													className="inline-flex items-center gap-1 font-medium text-zinc-900 hover:text-foreground font-semibold hover:underline"
													href={`/api/invoice/${item.payment.invoice.id}/pdf`}
												>
													<FileText className="size-3.5 text-foreground font-semibold" />
													Invoice {item.payment.invoice.nomor}
												</a>
											) : (
												<span className="block text-zinc-400 text-xs">
													Invoice belum terbit
												</span>
											)}
											{item.attendance?.certificate &&
											!item.attendance.certificate.revokedAt ? (
												<a
													className="inline-flex items-center gap-1 font-medium text-zinc-800 hover:underline block"
													href={`/api/sertifikat/${item.attendance.certificate.id}/pdf`}
												>
													<Award className="size-3.5 text-emerald-600" />
													Sertifikat {item.attendance.certificate.nomor}
												</a>
											) : null}
											{item.attendance?.certificate?.revokedAt ? (
												<span className="block text-red-500 text-xs">
													Sertifikat dibatalkan
												</span>
											) : null}
										</TableCell>
										<TableCell className="text-right">
											{item.payment?.status === "PENDING" ? (
												<div className="flex flex-col items-end gap-1.5">
													<FormulirAksi
														aksi={aksiLanjutkanPembayaran}
														nilai={{ enrollmentId: item.id }}
														label="Lanjutkan pembayaran"
														variant="gold"
													/>
													<FormulirAksi
														aksi={aksiBatalkanPendaftaran}
														nilai={{ enrollmentId: item.id }}
														label="Batalkan"
														variant="outline"
														konfirmasi="Batalkan pendaftaran yang belum dibayar ini?"
													/>
												</div>
											) : item.status === "PAID" && !item.attendance ? (
												<Button asChild size="sm" variant="outline" className="h-8 text-xs bg-white border-[#E2E8F0] rounded-lg">
													<Link href="/user/absensi">
														<QrCode className="size-3.5 mr-1 text-foreground font-semibold" />
														Absensi QR
													</Link>
												</Button>
											) : (
												<span className="text-xs text-zinc-400">
													-
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
