"use server"

import { revalidatePath } from "next/cache"
import * as QRCode from "qrcode"

import { sesiPengguna } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import { konfigurasi } from "@/lib/konfigurasi"
import { buatSesiAbsensi, perbaruiTokenSesi } from "@/lib/layanan/absensi"
import { buatTokenAbsensi, urlScanAbsensi } from "@/lib/layanan/token-absensi"

export type HasilQrAbsensi = {
	pesan?: string
	sukses?: string
	qr?: {
		sessionId: string
		judulKelas?: string
		token: string
		url: string
		gambar: string
	}
}

function keHasilKesalahan(kesalahan: unknown): HasilQrAbsensi {
	if (kesalahan instanceof KesalahanDomain) {
		return { pesan: kesalahan.message }
	}
	console.error("[aksi-qr-absensi]", kesalahan)
	return { pesan: "Terjadi kesalahan pada server. Silakan coba lagi." }
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
		const token = buatTokenAbsensi()
		const url = urlScanAbsensi(konfigurasi().APP_URL, token)
		const gambar = await QRCode.toDataURL(url, { width: 320, margin: 1 })
		const hasil = await buatSesiAbsensi(sesi, {
			classId: String(data.get("classId") ?? ""),
		}, { buatToken: () => token })
		revalidatePath("/admin/absensi")

		return {
			sukses:
				"Sesi absensi dibuka tanpa batas waktu. Simpan atau tampilkan QR ini; token hanya ditampilkan sekali.",
			qr: {
				sessionId: hasil.sessionId,
				token: hasil.token,
				url,
				gambar,
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
		const token = buatTokenAbsensi()
		const url = urlScanAbsensi(konfigurasi().APP_URL, token)
		const gambar = await QRCode.toDataURL(url, { width: 320, margin: 1 })
		const hasil = await perbaruiTokenSesi(
			sesi,
			String(data.get("sessionId") ?? ""),
			{ buatToken: () => token },
		)
		revalidatePath("/admin/absensi")

		return {
			sukses: "QR berhasil diganti. QR lama tidak dapat dipakai lagi.",
			qr: {
				sessionId: hasil.sessionId,
				token: hasil.token,
				url,
				gambar,
			},
		}
	} catch (kesalahan) {
		return keHasilKesalahan(kesalahan)
	}
}
