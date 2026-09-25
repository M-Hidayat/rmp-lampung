import type { Metadata } from "next"
import { ExternalLink } from "lucide-react"

import { JudulHalaman, LabelBagian } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { identitasRmp } from "@/lib/identitas-rmp"

export const metadata: Metadata = { title: "Kontak" }

function BarisKontak({ label, nilai, mono }: { label: string; nilai: string; mono?: boolean }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-sm font-semibold text-foreground">{label}</span>
			<p className={mono ? "font-mono text-sm text-muted-foreground" : "text-sm leading-relaxed text-muted-foreground"}>
				{nilai}
			</p>
		</div>
	)
}

export default function HalamanKontak() {
	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-8">
			<JudulHalaman
				labels={<LabelBagian>Hubungi kami</LabelBagian>}
				judul="Kontak"
				keterangan="Kontak berikut dikutip dari kanal publik resmi Rumah Mama Pintar."
			/>

			<div className="grid gap-6 sm:grid-cols-2">
				<Card className="h-full">
					<CardHeader>
						<CardTitle>Kontak utama</CardTitle>
						<CardDescription>
							Kanal resmi yang paling cepat direspons untuk pertanyaan pendaftaran.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<BarisKontak label="Alamat" nilai={identitasRmp.alamat.nilai} />
						<Separator />
						<BarisKontak label="Telepon" nilai={identitasRmp.telepon.nilai} mono />
						<Separator />
						<BarisKontak label="Email" nilai={identitasRmp.email.nilai} mono />
						<Separator />
						<Button asChild variant="gold" className="w-full">
							<a
								href={identitasRmp.whatsapp.nilai}
								rel="noreferrer noopener"
								target="_blank"
							>
								Kirim pesan WhatsApp
							</a>
						</Button>
					</CardContent>
				</Card>

				<Card className="h-full">
					<CardHeader>
						<CardTitle>Media sosial</CardTitle>
						<CardDescription>
							Kanal publik yang dapat Anda periksa sendiri.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-3">
							{identitasRmp.mediaSosial.nilai.map((akun) => (
								<li
									key={akun.url}
									className="flex flex-col gap-1 rounded-md border border-border bg-muted p-3"
								>
									<span className="text-sm font-semibold text-foreground">{akun.nama}</span>
									<a
										className="inline-flex items-center gap-1 break-all text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
										href={akun.url}
										rel="noreferrer noopener nofollow"
										target="_blank"
									>
										<span>{akun.url}</span>
										<ExternalLink aria-hidden="true" className="size-3 shrink-0 opacity-60" />
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