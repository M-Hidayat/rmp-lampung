import type { Metadata } from "next"

import { PanelQrAbsensi, TombolGantiQr } from "./panel-qr"
import { aksiTutupSesiAbsensi } from "@/app/(dashboard)/aksi"
import { FormulirAksi } from "@/components/formulir-aksi"
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
	const sesiUtama = new Map<string, (typeof sesiAbsensi)[number]>()
	for (const item of sesiAbsensi) {
		if (!sesiUtama.has(item.kelas.id)) sesiUtama.set(item.kelas.id, item)
	}
	const sesiTerbaruPerKelas = [...sesiUtama.values()]
	const classIdPernahDipakai = new Set(sesiAbsensi.map((item) => item.kelas.id))
	const pilihanKelas = kelas.map((item) => ({
		id: item.id,
		judul: item.judul,
		sudahMemilikiSesi: classIdPernahDipakai.has(item.id),
	}))

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">Sesi absensi</h1>
				<p className="mt-0.5 text-xs text-muted-foreground">Token absensi hanya ditampilkan saat dibuat atau diganti.</p>
			</div>

			<Alert variant="peringatan" judul="Satu sesi permanen per kelas">
				<p>Setiap kelas hanya dapat memiliki satu sesi. QR aktif tanpa batas waktu sampai sesi ditutup permanen dan dapat diganti selama sesi masih aktif.</p>
			</Alert>

			<div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-6">
				<div className="border-b border-border pb-3">
					<h2 className="text-base font-bold text-foreground font-heading">Buka sesi absensi</h2>
					<p className="text-xs text-muted-foreground">Sesi hanya dapat dibuat sekali untuk setiap kelas.</p>
				</div>
				<PanelQrAbsensi kelas={pilihanKelas} />
			</div>

			<div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-6">
				<h2 className="border-b border-border pb-2 text-base font-bold text-foreground font-heading">
					Sesi Absensi per Kelas ({sesiTerbaruPerKelas.length})
				</h2>
				<TableWrapper>
					<Table>
						<TableHeader className="bg-background">
							<TableRow>
								<TableHead>Kelas</TableHead><TableHead>Dibuat</TableHead><TableHead>Masa berlaku</TableHead>
								<TableHead>Kehadiran</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sesiTerbaruPerKelas.length === 0 ? (
								<TableRow><TableCell colSpan={6} className="py-8 text-center text-xs text-muted-foreground">Belum ada sesi absensi.</TableCell></TableRow>
							) : sesiTerbaruPerKelas.map((item) => (
								<TableRow key={item.id} className="hover:bg-background/60">
									<TableCell className="text-xs font-semibold text-foreground">{item.kelas.judul}</TableCell>
									<TableCell className="text-xs text-muted-foreground">{formatTanggalWaktu(item.createdAt)} WIB</TableCell>
									<TableCell className="text-xs text-muted-foreground">{item.aktif ? "Tanpa batas waktu" : "Ditutup permanen"}</TableCell>
									<TableCell className="text-xs font-medium text-muted-foreground">{item._count.attendances} peserta hadir</TableCell>
									<TableCell><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.aktif ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{item.aktif ? "Aktif tanpa batas waktu" : "Ditutup permanen"}</span></TableCell>
									<TableCell className="text-right">{item.aktif ? (
										<div className="flex min-w-max justify-end gap-2"><TombolGantiQr sessionId={item.id} judulKelas={item.kelas.judul} /><FormulirAksi aksi={aksiTutupSesiAbsensi} nilai={{ sessionId: item.id }} label="Tutup sesi" variant="outline" konfirmasi="Tutup sesi absensi ini secara permanen?" kelas="[&_button]:min-h-11" /></div>
									) : <span className="text-xs text-muted-foreground">Ditutup permanen</span>}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>
		</div>
	)
}
