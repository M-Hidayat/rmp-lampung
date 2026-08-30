import type { Metadata } from "next"
import Link from "next/link"
import {
	Award,
	BookOpen,
	CheckCircle2,
	Clock,
	QrCode,
	HelpCircle,
	ArrowRight,
	Search,
	Filter,
	Download,
} from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { LencanaStatusPendaftaran } from "@/components/status-lencana"
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
import { sesiAbsensiUntukPengguna } from "@/lib/layanan/absensi"
import { kelasSaya } from "@/lib/layanan/pendaftaran"
import { formatTanggalWaktu, formatRupiah } from "@/lib/uang"

export const metadata: Metadata = { title: "Ringkasan saya" }
export const dynamic = "force-dynamic"

export default async function HalamanRingkasanUser() {
	const sesi = await sesiPengguna()
	const [pendaftaran, sesiAbsensi] = await Promise.all([
		kelasSaya(sesi),
		sesiAbsensiUntukPengguna(sesi),
	])

	const lunas = pendaftaran.filter((item) => item.status === "PAID").length
	const menunggu = pendaftaran.filter((item) => item.status === "PENDING").length
	const hadir = pendaftaran.filter((item) => item.attendance).length
	const sertifikat = pendaftaran.filter(
		(item) => item.attendance?.certificate && !item.attendance.certificate.revokedAt,
	).length

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Ringkasan saya
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Status aktivitas kursus kuliner, transaksi, kehadiran, dan sertifikasi resmi Anda.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm" className="bg-white border-[#EFECE6] text-xs h-9 font-medium text-zinc-700 hover:bg-[#FAF8F5] rounded-xl shadow-xs">
						<Link href="/user/pembayaran">
							Riwayat Transaksi
						</Link>
					</Button>
					<Button asChild size="sm" variant="gold" className="text-xs h-9 font-semibold rounded-xl shadow-xs">
						<Link href="/kelas">
							Jelajahi Kelas Baru <ArrowRight className="size-3.5 ml-1" />
						</Link>
					</Button>
				</div>
			</div>

			{/* KPI Summary Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Kelas Terdaftar
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<BookOpen className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{pendaftaran.length}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						{lunas} lunas · {menunggu} pending
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Menunggu Bayar
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#92400E]">
							<Clock className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{menunggu}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						{menunggu > 0 ? "Menunggu pelunasan" : "Semua tagihan lunas"}
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Kehadiran Fisik
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
							<CheckCircle2 className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{hadir}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Tercatat via QR scanner
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Sertifikat Terbit
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<Award className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{sertifikat}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Dokumen kelulusan resmi
					</p>
				</div>
			</div>

			{/* Sesi Absensi Live Banner */}
			{sesiAbsensi.length > 0 ? (
				<div className="bg-linear-to-r from-[#FDF8ED] to-[#FFFDF9] rounded-2xl border border-[#F3DC9B] p-5 shadow-xs">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="space-y-1">
							<div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#854D0E]">
								<span className="size-2 rounded-full bg-[#D49A28] animate-ping" />
								<span>SESI ABSENSI KELAS DIBUKA</span>
							</div>
							<h3 className="text-sm font-bold text-zinc-950 font-heading">
								Sesi QR absensi aktif saat ini untuk kelas yang Anda ikuti
							</h3>
							<ul className="space-y-0.5 text-xs text-zinc-600">
								{sesiAbsensi.map((item) => (
									<li key={item.id}>
										<span className="font-semibold text-zinc-950">{item.kelas.judul}</span> · Kedaluwarsa {formatTanggalWaktu(item.kedaluwarsaPada)} WIB
									</li>
								))}
							</ul>
						</div>
						<Button asChild size="sm" variant="gold" className="shrink-0 text-xs font-semibold rounded-xl shadow-xs">
							<Link href="/user/absensi">
								<QrCode className="size-3.5 mr-1.5" />
								Buka Kamera Absensi
							</Link>
						</Button>
					</div>
				</div>
			) : null}

			{/* Main Data Card with Toolbar */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Pendaftaran Saya ({pendaftaran.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<div className="relative w-48 hidden sm:block">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari kelas..."
								className="w-full pl-8 pr-3 py-1 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
						<Button asChild variant="outline" size="sm" className="h-8 text-xs bg-white border-[#EFECE6] rounded-lg">
							<Link href="/user/kelas-saya">
								Lihat Semua
							</Link>
						</Button>
					</div>
				</div>

				{/* Table */}
				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Kelas</TableHead>
								<TableHead>Biaya</TableHead>
								<TableHead>Jadwal</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Kehadiran</TableHead>
								<TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pendaftaran.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-8 text-center text-xs">
										Belum ada pendaftaran kelas aktif.
									</TableCell>
								</TableRow>
							) : (
								pendaftaran.slice(0, 5).map((item) => (
									<TableRow key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-semibold text-zinc-900 text-sm">
											{item.kelas.judul}
										</TableCell>
										<TableCell className="font-mono font-medium text-xs text-[#854D0E]">
											{formatRupiah(item.kelas.harga.toString())}
										</TableCell>
										<TableCell className="text-xs text-zinc-500">
											{formatTanggalWaktu(item.kelas.jadwalMulai)} WIB
										</TableCell>
										<TableCell>
											<LencanaStatusPendaftaran status={item.status} />
										</TableCell>
										<TableCell className="text-xs font-medium">
											{item.attendance ? (
												<span className="text-emerald-700 font-semibold">
													Hadir
												</span>
											) : (
												<span className="text-zinc-400">Belum absen</span>
											)}
										</TableCell>
										<TableCell className="text-right">
											{item.status === "PENDING" ? (
												<Button asChild size="sm" variant="gold" className="h-7 text-xs font-semibold rounded-lg shadow-xs">
													<Link href={`/user/pembayaran?order_id=${item.payment?.pakasirRef || ''}`}>
														Bayar
													</Link>
												</Button>
											) : item.status === "PAID" && !item.attendance ? (
												<Button asChild size="sm" variant="outline" className="h-7 text-xs border-[#EFECE6] rounded-lg">
													<Link href="/user/absensi">Absen QR</Link>
												</Button>
											) : item.attendance?.certificate ? (
												<Button asChild size="sm" variant="outline" className="h-7 text-xs border-[#D49A28] text-[#854D0E] hover:bg-[#FDF8ED] rounded-lg">
													<Link href="/user/sertifikat">Sertifikat</Link>
												</Button>
											) : (
												<span className="text-xs text-zinc-400">-</span>
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
