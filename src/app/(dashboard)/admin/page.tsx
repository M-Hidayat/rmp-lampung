import type { Metadata } from "next"
import Link from "next/link"
import {
	Award,
	BookOpen,
	CheckCircle2,
	Clock,
	QrCode,
	ShieldCheck,
	TrendingUp,
	Users,
	ArrowRight,
	Calendar,
} from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { Button } from "@/components/ui/button"
import { sesiPengguna } from "@/lib/auth"
import { daftarSesiAbsensi } from "@/lib/layanan/absensi"
import { statistikOperasional } from "@/lib/layanan/laporan"
import { formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Statistik operasional" }
export const dynamic = "force-dynamic"

export default async function HalamanStatistikAdmin() {
	const sesi = await sesiPengguna()
	const [data, sesiAbsensi] = await Promise.all([
		statistikOperasional(sesi),
		daftarSesiAbsensi(sesi),
	])

	const sesiAktif = sesiAbsensi.filter((s) => s.aktif)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Statistik operasional
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Pantauan metrik harian aktivitas kursus kuliner RMP Lampung, kuota kelas, pendaftaran, kehadiran, dan sertifikat.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm" className="bg-white border-[#EFECE6] text-xs h-9 font-medium text-zinc-700 hover:bg-[#FAF8F5] rounded-xl shadow-xs">
						<Link href="/admin/absensi">
							Sesi &amp; QR Absensi
						</Link>
					</Button>
					<Button asChild size="sm" variant="gold" className="text-xs h-9 font-semibold rounded-xl shadow-xs">
						<Link href="/admin/kelas">
							Kelola Kelas <ArrowRight className="size-3.5 ml-1" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Operational Metric Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Total Peserta Terdaftar
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<Users className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{data.totalPeserta}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Akun aktif peran USER
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Kelas Aktif
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<BookOpen className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{data.totalKelasAktif}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Tersedia di katalog publik
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Pendaftaran Menunggu Bayar
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#92400E]">
							<Clock className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{data.pendaftaranMenunggu}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Belum lunas via gateway
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Pendaftaran Lunas
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
							<CheckCircle2 className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{data.pendaftaranLunas}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Siap mengikuti sesi pelatihan
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Kehadiran Terverifikasi
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<QrCode className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{data.totalKehadiran}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Tercatat melalui QR LMS
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-xs transition-all hover:border-[#D49A28]/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
							Sertifikat Aktif
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-[#FDF8ED] text-[#D49A28]">
							<Award className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 font-heading">
						{data.sertifikatAktif}
					</p>
					<p className="mt-1 text-xs text-zinc-400">
						Dokumen sah terverifikasi publik
					</p>
				</div>
			</div>

			{/* Sesi Absensi Aktif Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-3">
				<div className="flex flex-row items-center justify-between border-b border-[#F5F3EF] pb-3">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Sesi Absensi Aktif Saat Ini
						</h2>
						<p className="text-xs text-zinc-500">
							Sesi QR dinamis yang sedang dibuka untuk absensi fisik peserta.
						</p>
					</div>
					<Button asChild size="sm" variant="outline" className="text-xs bg-white border-[#EFECE6] rounded-lg">
						<Link href="/admin/absensi">
							<QrCode className="size-3.5 mr-1.5 text-[#D49A28]" />
							Buka Panel QR
						</Link>
					</Button>
				</div>

				<div className="pt-2">
					{sesiAktif.length === 0 ? (
						<div className="py-6 text-center text-xs text-zinc-500 space-y-1">
							<p>Tidak ada sesi absensi yang sedang aktif.</p>
							<p className="text-zinc-400">
								Buka menu &quot;Sesi &amp; QR absensi&quot; untuk memulai sesi absensi saat kelas berlangsung.
							</p>
						</div>
					) : (
						<ul className="divide-y divide-[#F5F3EF] text-xs sm:text-sm">
							{sesiAktif.map((item) => (
								<li
									key={item.id}
									className="flex flex-wrap items-center justify-between gap-3 py-3"
								>
									<div className="flex items-center gap-2">
										<span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
										<span className="font-semibold text-zinc-900">{item.kelas.judul}</span>
									</div>
									<div className="flex items-center gap-3">
										<span className="text-xs text-zinc-500 font-mono">
											Kedaluwarsa {formatTanggalWaktu(item.kedaluwarsaPada)} WIB
										</span>
										<Button asChild size="sm" variant="gold" className="h-7 text-xs font-semibold rounded-lg shadow-xs">
											<Link href="/admin/absensi">Lihat QR</Link>
										</Button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	)
}
