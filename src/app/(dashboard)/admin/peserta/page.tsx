import type { Metadata } from "next"
import { Users, Search, Download } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
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
import { daftarPeserta } from "@/lib/layanan/admin"
import { formatTanggal } from "@/lib/uang"

export const metadata: Metadata = { title: "Daftar peserta" }
export const dynamic = "force-dynamic"

export default async function HalamanPesertaAdmin() {
	const sesi = await sesiPengguna()
	const peserta = await daftarPeserta(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Daftar peserta
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Pengguna terdaftar dengan peran peserta kursus kuliner RMP Lampung.
					</p>
				</div>
			</div>

			{/* Main Data Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				{/* Card Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
					<div>
						<h2 className="text-base font-bold text-zinc-950 font-heading">
							Peserta ({peserta.length})
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<div className="relative w-52">
							<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Cari nama / email..."
								className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28]"
							/>
						</div>
					</div>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
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
									<TableRow key={orang.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
										<TableCell className="font-semibold text-zinc-900 text-sm">{orang.nama}</TableCell>
										<TableCell className="font-mono text-xs text-zinc-600">{orang.email}</TableCell>
										<TableCell className="font-mono text-xs text-zinc-600">{orang.telepon ?? "-"}</TableCell>
										<TableCell className="text-xs text-zinc-700 font-medium">
											{orang.enrollments.length} kelas
										</TableCell>
										<TableCell className="text-xs text-zinc-700 font-medium">
											{orang.enrollments.filter((e) => e.attendance).length} sesi
										</TableCell>
										<TableCell className="text-right text-xs text-zinc-500">
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
