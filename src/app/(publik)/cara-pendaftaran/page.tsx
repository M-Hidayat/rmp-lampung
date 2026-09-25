import type { Metadata } from "next"
import { ArrowRight, Award, BookOpen, CheckCheck, CreditCard, QrCode, UserPlus } from "lucide-react"
import Link from "next/link"

import { JudulHalaman, LabelBagian } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { identitasRmp } from "@/lib/identitas-rmp"

export const metadata: Metadata = { title: "Cara pendaftaran" }

const langkah = [
	{
		judul: "Buat akun peserta",
		isi: "Isi nama, email, dan kata sandi pada halaman daftar akun. Peran akun baru selalu peserta.",
		ikon: UserPlus,
	},
	{
		judul: "Pilih kelas pada katalog",
		isi: "Periksa jadwal, biaya, dan sisa kuota. Satu akun hanya dapat memiliki satu pendaftaran per kelas.",
		ikon: BookOpen,
	},
	{
		judul: "Selesaikan pembayaran",
		isi: "Sistem membuat pendaftaran berstatus menunggu pembayaran dan mengarahkan Anda ke halaman pembayaran Pakasir.",
		ikon: CreditCard,
	},
	{
		judul: "Tunggu konfirmasi resmi",
		isi: "Status berubah menjadi lunas hanya setelah konfirmasi resmi diterima server. Halaman kembali dari pembayaran bersifat informasi.",
		ikon: CheckCheck,
	},
	{
		judul: "Absen saat kelas berlangsung",
		isi: "Pindai QR absensi yang ditampilkan admin. Setiap pendaftaran hanya dapat absen satu kali.",
		ikon: QrCode,
	},
	{
		judul: "Unduh invoice dan sertifikat",
		isi: "Invoice tersedia setelah pembayaran lunas. Sertifikat tersedia setelah kehadiran tercatat dan diterbitkan admin.",
		ikon: Award,
	},
]

export default function HalamanCaraPendaftaran() {
	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-8">
			<JudulHalaman
				labels={<LabelBagian>Panduan</LabelBagian>}
				judul="Cara pendaftaran"
				keterangan="Alur pendaftaran kelas melalui sistem ini dari registrasi hingga sertifikat terbit."
			/>

			<Alert variant="info" judul="Pola pendaftaran yang berjalan saat ini">
				<p>
					{identitasRmp.polaPendaftaranSaatIni.nilai}. Sistem ini melengkapi
					alur tersebut dengan pendaftaran mandiri, pencatatan pembayaran,
					absensi, dan sertifikat.
				</p>
			</Alert>

			<ol className="flex flex-col gap-4">
				{langkah.map((item, indeks) => {
					const Ikon = item.ikon
					return (
						<li key={item.judul}>
							<Card>
								<CardContent className="flex items-start gap-4 p-5">
									<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary font-bold text-foreground">
										{indeks + 1}
									</span>
									<div className="flex min-w-0 flex-col gap-1.5">
										<div className="flex items-center gap-2">
											<Ikon aria-hidden="true" className="size-4 shrink-0 text-brand" />
											<h2 className="font-heading text-base font-bold text-foreground">
												{item.judul}
											</h2>
										</div>
										<p className="text-sm leading-6 text-muted-foreground">{item.isi}</p>
									</div>
								</CardContent>
							</Card>
						</li>
					)
				})}
			</ol>

			<Card>
				<CardHeader>
					<CardTitle>Siap mengikuti pelatihan?</CardTitle>
					<CardDescription>
						Lihat jadwal kelas aktif dan daftarkan diri Anda sebelum kuota penuh.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild variant="default">
						<Link href="/kelas">
							Jelajahi Katalog Kursus <ArrowRight aria-hidden="true" />
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}