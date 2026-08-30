import { describe, expect, it, vi } from "vitest"

import { KesalahanDomain } from "@/lib/kesalahan"
import { daftarPengguna } from "@/lib/layanan/registrasi"
import type { KlienDb } from "@/lib/prisma"

/** Basis data palsu minimal: hanya operasi yang dipakai layanan registrasi. */
function dbPalsu(
	create: (args: { data: Record<string, unknown> }) => Promise<unknown>,
): KlienDb {
	return { user: { create } } as unknown as KlienDb
}

const masukanSah = {
	nama: "Peserta Contoh",
	email: "Peserta@Contoh.Test",
	telepon: "0811 7970 171",
	kataSandi: "KataSandi123",
}

describe("registrasi pengguna", () => {
	it("menyimpan hash kata sandi, bukan kata sandi asli", async () => {
		let dataTersimpan: Record<string, unknown> = {}
		const hash = vi.fn(async (kataSandi: string) => `hash:${kataSandi.length}`)

		const hasil = await daftarPengguna(masukanSah, {
			db: dbPalsu(async ({ data }) => {
				dataTersimpan = data
				return {
					id: "pengguna-1",
					nama: data.nama,
					email: data.email,
				}
			}),
			hash,
		})

		expect(hash).toHaveBeenCalledWith("KataSandi123")
		expect(dataTersimpan.passwordHash).toBe("hash:12")
		expect(Object.values(dataTersimpan)).not.toContain("KataSandi123")
		expect(hasil).toEqual({
			id: "pengguna-1",
			nama: "Peserta Contoh",
			email: "peserta@contoh.test",
			peran: "USER",
		})
	})

	it("menetapkan peran USER dan mengabaikan peran dari input", async () => {
		let dataTersimpan: Record<string, unknown> = {}
		await daftarPengguna(
			{ ...masukanSah, peran: "PEMILIK" },
			{
				db: dbPalsu(async ({ data }) => {
					dataTersimpan = data
					return { id: "pengguna-1", nama: data.nama, email: data.email }
				}),
				hash: async () => "hash",
			},
		)
		expect(dataTersimpan.peran).toBe("USER")
	})

	it("menolak email tidak valid dan kata sandi lemah dengan pesan Indonesia", async () => {
		const db = dbPalsu(async () => {
			throw new Error("tidak boleh dipanggil")
		})

		await expect(
			daftarPengguna(
				{ ...masukanSah, email: "bukan-email" },
				{ db, hash: async () => "hash" },
			),
		).rejects.toBeInstanceOf(KesalahanDomain)

		try {
			await daftarPengguna(
				{ ...masukanSah, kataSandi: "pendek" },
				{ db, hash: async () => "hash" },
			)
			expect.unreachable("seharusnya melempar kesalahan validasi")
		} catch (kesalahan) {
			const galat = kesalahan as KesalahanDomain
			expect(galat.kode).toBe("VALIDASI")
			expect(galat.message).toBe(
				"Data registrasi belum lengkap atau tidak valid.",
			)
			expect(galat.detail?.kataSandi).toBe("Kata sandi minimal 8 karakter")
		}
	})

	it("menolak nama terlalu pendek", async () => {
		await expect(
			daftarPengguna(
				{ ...masukanSah, nama: "Ab" },
				{
					db: dbPalsu(async () => ({})),
					hash: async () => "hash",
				},
			),
		).rejects.toBeInstanceOf(KesalahanDomain)
	})
})
