import type { Metadata } from "next"
import { ArrowRight, UserPlus, BookOpen, CreditCard, CheckCheck, QrCode, Award } from "lucide-react"
import Link from "next/link"

import { JudulHalaman } from "@/components/kerangka"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardTitle,
} from "@/components/ui/card"
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
		<div className="space-y-8 max-w-4xl">
			<JudulHalaman
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

			<div className="space-y-3">
				{langkah.map((item, indeks) => {
					const Ikon = item.ikon
					return (
						<Card key={item.judul} className="p-4 sm:p-5 rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
							<div className="flex items-start gap-4">
								<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FDF8ED] text-xs font-bold text-[#854D0E] border border-[#F5D68B]">
									{indeks + 1}
								</span>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<Ikon className="size-4 text-[#D49A28] shrink-0" />
										<CardTitle className="text-sm font-bold text-zinc-950 font-heading">
											Langkah {indeks + 1}: {item.judul}
										</CardTitle>
									</div>
									<p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
										{item.isi}
									</p>
								</div>
							</div>
						</Card>
					)
				})}
			</div>

			<div className="rounded-2xl border border-[#EFECE6] bg-white p-6 space-y-3 shadow-xs">
				<h3 className="text-base font-bold text-zinc-950 font-heading">Siap Mengikuti Pelatihan?</h3>
				<p className="text-xs sm:text-sm text-zinc-600">
					Lihat jadwal kelas aktif dan daftarkan diri Anda sebelum kuota penuh.
				</p>
				<Button asChild variant="gold" className="rounded-xl font-semibold shadow-xs">
					<Link href="/kelas">
						Jelajahi Katalog Kursus <ArrowRight className="size-4 ml-1" />
					</Link>
				</Button>
			</div>
		</div>
	)
}
