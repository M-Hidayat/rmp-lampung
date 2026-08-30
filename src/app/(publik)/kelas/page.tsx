import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { daftarKelasPublik, sisaKuota } from "@/lib/layanan/kelas"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Katalog kelas" }
export const dynamic = "force-dynamic"

export default async function HalamanKatalog() {
	const kelas = await daftarKelasPublik()

	return (
		<div className="space-y-8">
			<JudulHalaman
				judul="Katalog kelas"
				keterangan="Kelas aktif yang dapat didaftarkan. Kuota dihitung dari pendaftaran yang masih berlaku."
			/>

			{kelas.length === 0 ? (
				<div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500">
					Belum ada kelas aktif saat ini. Silakan periksa kembali nanti.
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{kelas.map((item) => {
						const sisa = sisaKuota(item.kuota, item._count.enrollments)
						return (
							<Card
								key={item.id}
								className="flex h-full flex-col justify-between rounded-2xl border border-[#EFECE6] bg-white shadow-xs transition-all hover:border-[#D49A28]/50 hover:shadow-md"
							>
								<CardHeader className="space-y-2 pb-3">
									<div className="flex items-center justify-between gap-2">
										<Badge variant={sisa > 0 ? "menunggu" : "destructive"}>
											{sisa > 0 ? `Sisa ${sisa} Kursi` : "Penuh"}
										</Badge>
										<span className="font-mono text-sm font-bold text-[#854D0E]">
											{formatRupiah(item.harga.toString())}
										</span>
									</div>
									<CardTitle className="text-base font-bold text-zinc-950 font-heading">
										{item.judul}
									</CardTitle>
									<CardDescription className="line-clamp-3 text-xs text-zinc-500 leading-relaxed">
										{item.deskripsi || "Pelatihan intensif praktik langsung dengan instruktur ahli di dapur komersial."}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2 border-t border-[#F5F3EF] pt-3 text-xs text-zinc-600">
									<div className="flex items-center gap-2">
										<Calendar className="size-3.5 text-[#D49A28] shrink-0" />
										<span>{formatTanggalWaktu(item.jadwalMulai)} WIB</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin className="size-3.5 text-[#D49A28] shrink-0" />
										<span className="truncate">{item.lokasi}</span>
									</div>
								</CardContent>
								<CardFooter className="pt-2">
									<Button asChild variant="gold" className="w-full font-semibold rounded-xl shadow-xs">
										<Link href={`/kelas/${item.slug}`}>
											Detail dan Pendaftaran
										</Link>
									</Button>
								</CardFooter>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}
