import type { Metadata } from "next"
import { ExternalLink } from "lucide-react"

import { JudulHalaman } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { identitasRmp } from "@/lib/identitas-rmp"

export const metadata: Metadata = { title: "Kontak" }

export default function HalamanKontak() {
	return (
		<div className="space-y-8 max-w-4xl">
			<JudulHalaman
				judul="Kontak"
				keterangan="Kontak berikut dikutip dari kanal publik resmi RMP."
			/>

			<div className="grid gap-6 sm:grid-cols-2">
				{/* Kontak Utama Card */}
				<Card className="rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-bold text-zinc-950 font-heading">
							Kontak utama
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-xs sm:text-sm">
						<div className="space-y-1">
							<span className="font-semibold text-zinc-900 block">Alamat</span>
							<p className="text-zinc-600 leading-relaxed">{identitasRmp.alamat.nilai}</p>
						</div>

						<div className="space-y-1 pt-2 border-t border-[#F5F3EF]">
							<span className="font-semibold text-zinc-900 block">Telepon</span>
							<p className="text-zinc-600 font-mono">{identitasRmp.telepon.nilai}</p>
						</div>

						<div className="space-y-1 pt-2 border-t border-[#F5F3EF]">
							<span className="font-semibold text-zinc-900 block">Email</span>
							<p className="text-zinc-600 font-mono">{identitasRmp.email.nilai}</p>
						</div>

						<div className="pt-2 border-t border-[#F5F3EF]">
							<Button asChild variant="gold" className="w-full font-semibold rounded-xl shadow-xs">
								<a
									href={identitasRmp.whatsapp.nilai}
									rel="noreferrer noopener"
									target="_blank"
								>
									Kirim pesan WhatsApp
								</a>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Media Sosial Card */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold text-zinc-950">
							Media sosial
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<ul className="space-y-2.5 text-xs sm:text-sm">
							{identitasRmp.mediaSosial.nilai.map((akun) => (
								<li key={akun.url} className="rounded-md border border-zinc-200 bg-zinc-50/50 p-2.5 flex flex-col gap-0.5">
									<span className="font-semibold text-zinc-900">{akun.nama}</span>
									<a
										className="inline-flex items-center gap-1 text-zinc-600 hover:underline hover:text-zinc-950 break-all"
										href={akun.url}
										rel="noreferrer noopener nofollow"
										target="_blank"
									>
										<span>{akun.url}</span>
										<ExternalLink className="size-3 shrink-0 opacity-60" />
									</a>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<Alert variant="peringatan" judul="Catatan verifikasi">
				<p>
					{identitasRmp.email.catatan} {identitasRmp.mediaSosial.catatan}
				</p>
			</Alert>
		</div>
	)
}
