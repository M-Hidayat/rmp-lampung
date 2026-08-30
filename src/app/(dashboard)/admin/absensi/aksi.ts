"use server"

import { revalidatePath } from "next/cache"
import * as QRCode from "qrcode"

import { sesiPengguna } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import { konfigurasi } from "@/lib/konfigurasi"
import { buatSesiAbsensi, perbaruiTokenSesi } from "@/lib/layanan/absensi"
import { urlScanAbsensi } from "@/lib/layanan/token-absensi"

export type HasilQrAbsensi = {
	pesan?: string
	sukses?: string
	qr?: {
		sessionId: string
		judulKelas?: string
		token: string
		url: string
		gambar: string
		kedaluwarsaPada: string
	}
}

function keHasilKesalahan(kesalahan: unknown): HasilQrAbsensi {
	if (kesalahan instanceof KesalahanDomain) {
		return { pesan: kesalahan.message }
	}
	console.error("[aksi-buka-sesi-qr]", kesalahan)
	return { pesan: `Terjadi kesalahan: ${kesalahan instanceof Error ? kesalahan.message : String(kesalahan)}` }
}

/**
 * Membuka sesi absensi lalu mengembalikan QR sekali tampil.
 * Token hanya ada di memori respons ini; basis data menyimpan hash-nya saja.
 */
export async function aksiBukaSesiQr(
	_sebelumnya: HasilQrAbsensi | undefined,
	data: FormData,
): Promise<HasilQrAbsensi> {
	try {
		const sesi = await sesiPengguna()
		const hasil = await buatSesiAbsensi(sesi, {
			classId: String(data.get("classId") ?? ""),
			masaBerlakuMenit: Number(data.get("masaBerlakuMenit") ?? 10),
		})

		const url = urlScanAbsensi(konfigurasi().APP_URL, hasil.token)
		const gambar = await QRCode.toDataURL(url, { width: 320, margin: 1 })
		revalidatePath("/admin/absensi")

		return {
			sukses:
				"Sesi absensi dibuka. Tampilkan QR ini kepada peserta sebelum kedaluwarsa.",
			qr: {
				sessionId: hasil.sessionId,
				token: hasil.token,
				url,
				gambar,
				kedaluwarsaPada: hasil.kedaluwarsaPada.toISOString(),
			},
		}
	} catch (kesalahan) {
		return keHasilKesalahan(kesalahan)
	}
}

/** Memperbarui token sesi yang masih aktif dan mengembalikan QR baru. */
export async function aksiPerbaruiTokenQr(
	_sebelumnya: HasilQrAbsensi | undefined,
	data: FormData,
): Promise<HasilQrAbsensi> {
	try {
		const sesi = await sesiPengguna()
		const hasil = await perbaruiTokenSesi(
			sesi,
			String(data.get("sessionId") ?? ""),
			Number(data.get("masaBerlakuMenit") ?? 10),
		)

		const url = urlScanAbsensi(konfigurasi().APP_URL, hasil.token)
		const gambar = await QRCode.toDataURL(url, { width: 320, margin: 1 })
		revalidatePath("/admin/absensi")

		return {
			sukses: "Token diperbarui. QR lama tidak dapat dipakai lagi.",
			qr: {
				sessionId: hasil.sessionId,
				token: hasil.token,
				url,
				gambar,
				kedaluwarsaPada: hasil.kedaluwarsaPada.toISOString(),
			},
		}
	} catch (kesalahan) {
		return keHasilKesalahan(kesalahan)
	}
}
