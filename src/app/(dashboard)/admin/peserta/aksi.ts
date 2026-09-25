"use server"

import { sesiPengguna } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import { terbitkanTokenAturUlangOlehAdmin } from "@/lib/layanan/atur-ulang-sandi"
import { wajibKemampuan } from "@/lib/rbac"

export type HasilTautanAturUlang = {
	pesan?: string
	sukses?: string
	tautan?: string
	nama?: string
	kedaluwarsa?: string
}

/**
 * Terbitkan tautan atur ulang kata sandi untuk seorang peserta.
 *
 * Disediakan karena pengiriman email belum dikonfigurasi: admin menyalin tautan
 * ini lalu mengirimkannya ke peserta lewat kanal yang sudah dipakai RMP
 * (WhatsApp). Otorisasi diperiksa di lapisan ini (`wajibKemampuan`), jadi
 * endpoint ini tidak bisa dipakai peserta biasa.
 */
export async function aksiTerbitkanTautanAturUlang(
	_sebelumnya: HasilTautanAturUlang | undefined,
	data: FormData,
): Promise<HasilTautanAturUlang> {
	try {
		const sesi = await sesiPengguna()
		wajibKemampuan(sesi, "kelola_peserta")

		const idPengguna = String(data.get("idPengguna") ?? "")
		const hasil = await terbitkanTokenAturUlangOlehAdmin(idPengguna)

		return {
			sukses: `Tautan atur ulang untuk ${hasil.nama} sudah dibuat. Kirimkan tautan di bawah kepada peserta.`,
			tautan: hasil.tautan,
			nama: hasil.nama,
			kedaluwarsa: hasil.kedaluwarsaPada.toISOString(),
		}
	} catch (kesalahan) {
		if (kesalahan instanceof KesalahanDomain) {
			return { pesan: kesalahan.message }
		}
		console.error("[aksi-tautan-atur-ulang]", kesalahan)
		return { pesan: "Terjadi kesalahan pada server. Silakan coba lagi." }
	}
}
