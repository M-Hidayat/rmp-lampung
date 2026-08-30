import type { Metadata } from "next"

import { FormulirAdmin } from "./formulir-admin"
import { aksiUbahStatusAdmin } from "../../aksi"
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
import { daftarAdmin } from "@/lib/layanan/admin"
import { formatTanggal } from "@/lib/uang"

export const metadata: Metadata = { title: "Kelola admin" }
export const dynamic = "force-dynamic"

export default async function HalamanKelolaAdmin() {
	const sesi = await sesiPengguna()
	const akun = await daftarAdmin(sesi)

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
						Kelola admin
					</h1>
					<p className="text-xs text-zinc-500 mt-0.5">
						Akun admin dinonaktifkan, tidak dihapus, agar jejak audit tetap utuh.
					</p>
				</div>
			</div>

			<Alert variant="info" judul="Batas kemampuan">
				<p>
					Hanya pemilik yang dapat membuat dan menonaktifkan akun admin. Akun
					pemilik tidak dapat diubah dari halaman ini.
				</p>
			</Alert>

			{/* Create Admin Form Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="border-b border-[#F5F3EF] pb-3">
					<h2 className="text-base font-bold text-zinc-950 font-heading">Tambah akun admin</h2>
					<p className="text-xs text-zinc-500">
						Peran ditetapkan server sebagai ADMIN dan tidak diambil dari input.
					</p>
				</div>
				<div className="pt-2">
					<FormulirAdmin />
				</div>
			</div>

			{/* Team List Table Card */}
			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-[#F5F3EF] pb-2">
					<h2 className="text-base font-bold text-zinc-950 font-heading">
						Daftar Akun Operasional ({akun.length})
					</h2>
				</div>

				<TableWrapper>
					<Table>
						<TableHeader className="bg-[#FAF8F5] rounded-lg">
							<TableRow>
								<TableHead>Nama</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Peran</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Dibuat</TableHead>
								<TableHead className="text-right">Tindakan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{akun.map((orang) => (
								<TableRow key={orang.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
									<TableCell className="font-semibold text-zinc-900 text-sm">{orang.nama}</TableCell>
									<TableCell className="font-mono text-xs text-zinc-600">{orang.email}</TableCell>
									<TableCell className="text-xs">
										<span className="inline-flex items-center rounded-lg border border-[#F5D68B] bg-[#FDF8ED] px-2.5 py-0.5 text-xs font-semibold text-[#854D0E]">
											{orang.peran === "PEMILIK" ? "Pemilik" : "Admin"}
										</span>
									</TableCell>
									<TableCell>
										<LencanaAktif aktif={orang.aktif} />
									</TableCell>
									<TableCell className="text-xs text-zinc-500">
										{formatTanggal(orang.createdAt)}
									</TableCell>
									<TableCell className="text-right">
										{orang.peran === "ADMIN" ? (
											<FormulirAksi
												aksi={aksiUbahStatusAdmin}
												nilai={{
													userId: orang.id,
													aktif: orang.aktif ? "false" : "true",
												}}
												label={orang.aktif ? "Nonaktifkan" : "Aktifkan"}
												variant="outline"
											/>
										) : (
											<span className="text-xs text-zinc-400">
												Tidak dapat diubah
											</span>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableWrapper>
			</div>
		</div>
	)
}
