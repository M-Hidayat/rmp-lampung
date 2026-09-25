import type { Metadata } from "next"
import Link from "next/link"
import {
	Award,
	BookOpen,
	CheckCircle2,
	Clock,
	QrCode,
	Users,
	ArrowRight,
	} from "lucide-react"

import { Button } from "@/components/ui/button"
import { sesiPengguna } from "@/lib/auth"
import { daftarSesiAbsensi } from "@/lib/layanan/absensi"
import { statistikOperasional } from "@/lib/layanan/laporan"

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
		<div className="flex flex-col gap-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
						Statistik operasional
					</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Pantauan metrik harian aktivitas kursus kuliner Rumah Mama Pintar, kuota kelas, pendaftaran, kehadiran, dan sertifikat.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm" className="bg-card border-border text-xs h-9 font-medium text-muted-foreground hover:bg-background rounded-md ">
						<Link href="/admin/absensi">
							Sesi &amp; QR Absensi
						</Link>
					</Button>
					<Button asChild size="sm" variant="gold" className="text-xs h-9 font-semibold rounded-md ">
						<Link href="/admin/kelas">
							Kelola Kelas <ArrowRight className="size-3.5 ml-1" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Operational Metric Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Total Peserta Terdaftar
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground font-semibold">
							<Users className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground font-heading">
						{data.totalPeserta}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Akun aktif peran USER
					</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Kelas Aktif
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground font-semibold">
							<BookOpen className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground font-heading">
						{data.totalKelasAktif}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Tersedia di katalog publik
					</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Pendaftaran Menunggu Bayar
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-warning-surface text-warning">
							<Clock className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground font-heading">
						{data.pendaftaranMenunggu}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Belum lunas via gateway
					</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Pendaftaran Lunas
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
							<CheckCircle2 className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground font-heading">
						{data.pendaftaranLunas}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Siap mengikuti sesi pelatihan
					</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Kehadiran Terverifikasi
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground font-semibold">
							<QrCode className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground font-heading">
						{data.totalKehadiran}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Tercatat melalui QR LMS
					</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-5 transition-all hover:border-primary/40">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Sertifikat Aktif
						</span>
						<div className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground font-semibold">
							<Award className="size-4" />
						</div>
					</div>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground font-heading">
						{data.sertifikatAktif}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Dokumen sah terverifikasi publik
					</p>
				</div>
			</div>

			{/* Sesi Absensi Aktif Card */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-3">
				<div className="flex flex-row items-center justify-between border-b border-border pb-3">
					<div>
						<h2 className="text-base font-bold text-foreground font-heading">
							Sesi Absensi Aktif Saat Ini
						</h2>
						<p className="text-xs text-muted-foreground">
							Sesi QR dinamis yang sedang dibuka untuk absensi fisik peserta.
						</p>
					</div>
					<Button asChild size="sm" variant="outline" className="text-xs bg-card border-border rounded-lg">
						<Link href="/admin/absensi">
							<QrCode className="size-3.5 mr-1.5 text-foreground font-semibold" />
							Buka Panel QR
						</Link>
					</Button>
				</div>

				<div className="pt-2">
					{sesiAktif.length === 0 ? (
						<div className="py-6 text-center text-xs text-muted-foreground flex flex-col gap-1">
							<p>Tidak ada sesi absensi yang sedang aktif.</p>
							<p className="text-muted-foreground">
								Buka menu &quot;Sesi &amp; QR absensi&quot; untuk memulai sesi absensi saat kelas berlangsung.
							</p>
						</div>
					) : (
						<ul className="divide-y divide-border text-xs sm:text-sm">
							{sesiAktif.map((item) => (
								<li
									key={item.id}
									className="flex flex-wrap items-center justify-between gap-3 py-3"
								>
									<div className="flex items-center gap-2">
										<span className="size-2 rounded-full bg-muted0 animate-pulse" />
										<span className="font-semibold text-foreground">{item.kelas.judul}</span>
									</div>
									<div className="flex items-center gap-3">
										<span className="text-xs text-muted-foreground">
											Aktif tanpa batas waktu
										</span>
										<Button asChild size="sm" variant="gold" className="min-h-11 text-xs font-semibold rounded-lg ">
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
