import type { Metadata } from "next"
import Link from "next/link"

import { FormulirAturUlang } from "./formulir-atur-ulang"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { statusTokenAturUlang } from "@/lib/layanan/atur-ulang-sandi"

export const metadata: Metadata = { title: "Atur ulang kata sandi" }
// Token bersifat sekali pakai dan berbatas waktu: halaman tidak boleh di-cache.
export const dynamic = "force-dynamic"

type Props = { params: Promise<{ token: string }> }

/**
 * Halaman dari tautan email. Status token diperiksa di server sebelum formulir
 * dirender, sehingga tautan kedaluwarsa/terpakai tidak pernah menampilkan
 * formulir yang pasti gagal saat dikirim.
 */
export default async function HalamanAturUlang({ params }: Props) {
	const { token } = await params
	const tokenDidekode = decodeURIComponent(token)
	const status = await statusTokenAturUlang(tokenDidekode)

	if (!status.sah) {
		const pesan =
			status.alasan === "KEDALUWARSA"
				? "Tautan atur ulang sudah kedaluwarsa. Minta tautan baru untuk melanjutkan."
				: status.alasan === "SUDAH_DIPAKAI"
					? "Tautan atur ulang ini sudah pernah dipakai. Minta tautan baru bila perlu."
					: "Tautan atur ulang tidak valid. Pastikan Anda membuka tautan terbaru dari email."

		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Tautan tidak berlaku</CardTitle>
					<CardDescription>
						Demi keamanan, setiap tautan atur ulang hanya dapat dipakai sekali dan
						berlaku terbatas.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert variant="peringatan" judul="Tidak dapat melanjutkan">
						<p>{pesan}</p>
					</Alert>
				</CardContent>
				<CardFooter className="flex-col items-stretch gap-4">
					<Separator />
					<Button asChild variant="gold" className="w-full">
						<Link href="/lupa-sandi">Minta tautan baru</Link>
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						<Link
							className="font-semibold text-accent-foreground underline underline-offset-4 hover:text-foreground"
							href="/masuk"
						>
							Kembali ke halaman masuk
						</Link>
					</p>
				</CardFooter>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl">Buat kata sandi baru</CardTitle>
				<CardDescription>
					Halo {status.nama}, tentukan kata sandi baru untuk akun Anda.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormulirAturUlang token={tokenDidekode} />
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-4">
				<Separator />
				<p className="text-center text-sm text-muted-foreground">
					Sudah ingat kata sandi Anda?{" "}
					<Link
						className="font-semibold text-accent-foreground underline underline-offset-4 hover:text-foreground"
						href="/masuk"
					>
						Masuk di sini
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}