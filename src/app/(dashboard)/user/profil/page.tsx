import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { JudulHalaman } from "@/components/kerangka"
import { sesiPengguna } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { wajibSesi } from "@/lib/rbac"
import { formatTanggal } from "@/lib/uang"

export const metadata: Metadata = { title: "Profil saya" }
export const dynamic = "force-dynamic"

export default async function HalamanProfilUser() {
	const sesi = await sesiPengguna()
	const pengguna = wajibSesi(sesi)
	const data = await prisma.user.findUnique({
		where: { id: pengguna.id },
		select: {
			nama: true,
			email: true,
			telepon: true,
			peran: true,
			createdAt: true,
		},
	})

	if (!data) {
		redirect("/masuk")
	}

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading">
					Profil saya
				</h1>
				<p className="text-xs text-zinc-500 mt-0.5">
					Informasi akun terdaftar pada sistem kursus kuliner RMP Lampung.
				</p>
			</div>

			<div className="bg-white rounded-2xl border border-[#EFECE6] p-6 shadow-xs space-y-4">
				<h2 className="text-base font-bold text-zinc-950 font-heading border-b border-[#F5F3EF] pb-3">
					Data Akun Pengguna
				</h2>

				<dl className="divide-y divide-[#F5F3EF] text-sm">
					<div className="py-3 flex justify-between items-center">
						<dt className="text-zinc-500 text-xs font-medium">Nama lengkap</dt>
						<dd className="font-semibold text-zinc-950">{data.nama}</dd>
					</div>
					<div className="py-3 flex justify-between items-center">
						<dt className="text-zinc-500 text-xs font-medium">Email</dt>
						<dd className="font-mono text-xs text-zinc-950 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E5E0D8]">{data.email}</dd>
					</div>
					<div className="py-3 flex justify-between items-center">
						<dt className="text-zinc-500 text-xs font-medium">Telepon</dt>
						<dd className="font-medium text-zinc-950">{data.telepon ?? "Belum diisi"}</dd>
					</div>
					<div className="py-3 flex justify-between items-center">
						<dt className="text-zinc-500 text-xs font-medium">Peran akun</dt>
						<dd className="inline-flex items-center rounded-lg bg-[#FDF8ED] border border-[#F5D68B] px-2.5 py-0.5 text-xs font-bold text-[#854D0E]">
							{data.peran}
						</dd>
					</div>
					<div className="py-3 flex justify-between items-center">
						<dt className="text-zinc-500 text-xs font-medium">Terdaftar sejak</dt>
						<dd className="text-zinc-600 text-xs">{formatTanggal(data.createdAt)}</dd>
					</div>
				</dl>
			</div>
		</div>
	)
}
