import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, ChevronRight, MapPin, Utensils } from "lucide-react"

import { JudulHalaman, LabelBagian } from "@/components/kerangka"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { identitasRmp } from "@/lib/identitas-rmp"
import { daftarKelasPublik, sisaKuota } from "@/lib/layanan/kelas"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"

export const metadata: Metadata = { title: "Katalog Kelas" }
export const dynamic = "force-dynamic"

export default async function HalamanKatalog() {
	const kelas = await daftarKelasPublik()
	const whatsapp = identitasRmp.whatsapp.nilai

	return (
		<div className="flex flex-col gap-8">
			<JudulHalaman
				labels={<LabelBagian>Program pelatihan</LabelBagian>}
				judul="Katalog Kelas"
				keterangan="Kelas aktif yang dapat didaftarkan. Kuota dihitung dari pendaftaran yang masih berlaku."
			/>

			{kelas.length === 0 ? (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Utensils aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>Belum ada kelas aktif</EmptyTitle>
						<EmptyDescription>
							Jadwal kelas sedang disusun. Hubungi Rumah Mama Pintar untuk menanyakan
							program terbaru.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button asChild variant="gold">
							<a href={whatsapp} target="_blank" rel="noreferrer noopener">
								Hubungi via WhatsApp
							</a>
						</Button>
					</EmptyContent>
				</Empty>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{kelas.map((item) => {
						const sisa = sisaKuota(item.kuota, item._count.enrollments)
						return (
							<Card key={item.id} className="h-full">
								<CardHeader>
									<div className="flex items-start justify-between gap-3">
										<CardTitle className="text-lg">{item.judul}</CardTitle>
										<Badge variant={sisa > 0 ? "sukses" : "destructive"}>
											{sisa > 0 ? `Sisa ${sisa} kursi` : "Penuh"}
										</Badge>
									</div>
									<p className="font-heading text-xl font-bold text-foreground">
										{formatRupiah(item.harga.toString())}
									</p>
								</CardHeader>

								<CardContent className="flex flex-1 flex-col gap-4">
									<CardDescription className="line-clamp-3">
										{item.deskripsi ||
											"Pelatihan intensif praktik langsung dengan instruktur ahli di dapur komersial."}
									</CardDescription>
									<Separator />
									<div className="flex flex-col gap-2">
										<p className="flex items-center gap-2 text-sm text-muted-foreground">
											<Calendar aria-hidden="true" className="size-4 shrink-0 text-brand" />
											<span>{formatTanggalWaktu(item.jadwalMulai)} WIB</span>
										</p>
										<p className="flex items-center gap-2 text-sm text-muted-foreground">
											<MapPin aria-hidden="true" className="size-4 shrink-0 text-brand" />
											<span className="truncate">{item.lokasi}</span>
										</p>
									</div>
								</CardContent>

								<CardFooter className="mt-auto">
									<Button asChild variant="gold" className="w-full">
										<Link href={`/kelas/${item.slug}`}>
											Detail dan Pendaftaran <ChevronRight aria-hidden="true" />
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