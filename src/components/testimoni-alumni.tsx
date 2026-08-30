"use client"

import * as React from "react"
import Image from "next/image"
import { Quote } from "lucide-react"

export type TestimoniItem = {
	id: string
	nama: string
	peran: string
	komentar: string
	foto: string
}

const daftarTestimoniDefault: TestimoniItem[] = [
	{
		id: "1",
		nama: "Dewi Anggraini",
		peran: "Alumni Baking Dasar",
		komentar:
			"Materinya lengkap, praktiknya banyak, instruktur ramah dan berpengalaman. Sekarang saya sudah membuka usaha sendiri!",
		foto: "/images/alumni-dewi.jpg",
	},
	{
		id: "2",
		nama: "Rian Hidayat",
		peran: "Alumni Tata Boga Profesional",
		komentar:
			"Pelatihan yang sangat aplikatif untuk dapur komersial. Pemahaman hitung HPP dan teknik memasak sangat membantu bisnis kuliner saya.",
		foto: "/images/alumni-dewi.jpg",
	},
	{
		id: "3",
		nama: "Siti Rahmawati",
		peran: "Alumni Kue Tradisional",
		komentar:
			"Resep autentik dengan teknik modern yang higienis. Dari yang awalnya ragu, kini pesanan kue basah saya selalu ramai setiap hari.",
		foto: "/images/alumni-dewi.jpg",
	},
	{
		id: "4",
		nama: "Budi Santoso",
		peran: "Alumni Wirausaha Kuliner",
		komentar:
			"Sertifikat resmi dan bimbingan mentor yang responsif memberi rasa percaya diri tinggi untuk membuka cabang usaha kuliner baru.",
		foto: "/images/alumni-dewi.jpg",
	},
]

export function TestimoniAlumni({
	items = daftarTestimoniDefault,
}: {
	items?: TestimoniItem[]
}) {
	const [aktif, setAktif] = React.useState(0)

	const itemAktif = items[aktif] || items[0]

	return (
		<div className="flex h-full flex-col justify-between rounded-2xl border border-[#EFECE6] bg-white p-6 shadow-xs transition-all hover:shadow-md">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-bold text-zinc-950 font-heading">
						Testimoni Alumni
					</h3>
					<div className="flex size-7 items-center justify-center rounded-full bg-[#FDF8ED] text-[#D49A28]">
						<Quote className="size-4 rotate-180 fill-current" />
					</div>
				</div>

				<blockquote className="text-sm leading-relaxed text-zinc-700 min-h-[90px]">
					&ldquo;{itemAktif.komentar}&rdquo;
				</blockquote>
			</div>

			<div className="pt-6 space-y-4 border-t border-[#F5F3EF]">
				<div className="flex items-center gap-3">
					<div className="relative size-11 overflow-hidden rounded-full ring-2 ring-[#D49A28]/30 shadow-xs shrink-0">
						<Image
							src={itemAktif.foto}
							alt={itemAktif.nama}
							fill
							className="object-cover"
							sizes="44px"
						/>
					</div>
					<div className="min-w-0">
						<p className="text-sm font-bold text-zinc-950 truncate">
							{itemAktif.nama}
						</p>
						<p className="text-xs text-zinc-500 truncate">
							{itemAktif.peran}
						</p>
					</div>
				</div>

				{/* Carousel indicator dots */}
				<div className="flex items-center justify-center gap-1.5 pt-1" aria-label="Navigasi testimoni">
					{items.map((item, index) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setAktif(index)}
							aria-label={`Lihat testimoni dari ${item.nama}`}
							className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
								aktif === index
									? "w-6 bg-[#D49A28]"
									: "w-2 bg-zinc-200 hover:bg-zinc-300"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
