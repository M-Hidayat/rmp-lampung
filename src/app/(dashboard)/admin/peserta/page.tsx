import type { Metadata } from "next"

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
import { daftarPeserta } from "@/lib/layanan/admin"
import { formatTanggal } from "@/lib/uang"

export const metadata: Metadata = { title: "Daftar peserta" }
export const dynamic = "force-dynamic"

export default async function HalamanPesertaAdmin() {
	const sesi = await sesiPengguna()
	const peserta = await daftarPeserta(sesi)

	return (
		<div className="flex flex-col gap-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
						Daftar peserta
					</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Pengguna terdaftar dengan peran peserta kursus kuliner Rumah Mama Pintar.
					</p>
				</div>
			</div>

			{/* Main Data Table Card */}
			<div className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-foreground font-heading">
							Peserta ({peserta.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-background rounded-lg">
							<TableRow>
								<TableHead>Nama</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Telepon</TableHead>
								<TableHead>Pendaftaran</TableHead>
								<TableHead>Kehadiran</TableHead>
								<TableHead className="text-right">Terdaftar</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{peserta.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-xs">
										Belum ada peserta terdaftar.
									</TableCell>
								</TableRow>
							) : (
								peserta.map((orang) => (
									<TableRow key={orang.id} className="hover:bg-background/60 transition-colors">
										<TableCell className="font-semibold text-foreground text-sm">{orang.nama}</TableCell>
										<TableCell className="font-mono text-xs text-muted-foreground">{orang.email}</TableCell>
										<TableCell className="font-mono text-xs text-muted-foreground">{orang.telepon ?? "-"}</TableCell>
										<TableCell className="text-xs text-muted-foreground font-medium">
											{orang.enrollments.length} kelas
										</TableCell>
										<TableCell className="text-xs text-muted-foreground font-medium">
											{orang.enrollments.filter((e) => e.attendance).length} sesi
										</TableCell>
										<TableCell className="text-right text-xs text-muted-foreground">
											{formatTanggal(orang.createdAt)}
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
