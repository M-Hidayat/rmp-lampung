"use server"

import { redirect } from "next/navigation"

import { sesiPengguna } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import { daftarKelas } from "@/lib/layanan/pendaftaran"

export type StatusAksi = { pesan?: string } | undefined

/**
 * Server action pendaftaran kelas.
 * Boundary UI: hanya membaca sesi, memanggil layanan domain, lalu mengarahkan
 * pengguna. Seluruh aturan bisnis berada pada layanan domain.
 */
export async function aksiDaftarKelas(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	const slugKelas = String(formData.get("slugKelas") ?? "")
	const sesi = await sesiPengguna()

	if (!sesi) {
		redirect(`/masuk?lanjut=/kelas/${encodeURIComponent(slugKelas)}`)
	}

	let urlPembayaran: string
	try {
		const hasil = await daftarKelas(sesi, { slugKelas })
		urlPembayaran = hasil.urlPembayaran
	} catch (kesalahan) {
		if (kesalahan instanceof KesalahanDomain) {
			return { pesan: kesalahan.message }
		}
		console.error("[aksi-daftar-kelas]", kesalahan)
		return {
			pesan: "Terjadi kesalahan pada server. Silakan coba lagi.",
		}
	}

	redirect(urlPembayaran)
}
