import { describe, expect, it, vi } from "vitest"

import { gantiKataSandiSaya, perbaruiProfilSaya, profilSaya } from "@/lib/layanan/profil"
import { hashKataSandi } from "@/lib/kata-sandi"

const sesiUser = { id: "u-1", nama: "Budi", email: "budi@example.com", peran: "USER" as const }
const sesiAdmin = { id: "a-1", nama: "Admin", email: "admin@example.com", peran: "ADMIN" as const }

describe("profilSaya", () => {
	it("mengembalikan profil pengguna yang sedang masuk", async () => {
		const db = {
			user: {
				findUnique: vi.fn(async () => ({
					id: "u-1",
					nama: "Budi",
					email: "budi@example.com",
					telepon: "0812",
					peran: "USER",
					createdAt: new Date("2026-01-01"),
				})),
			},
		} as never
		const hasil = await profilSaya(sesiUser, { db })
		expect(hasil.nama).toBe("Budi")
		expect(hasil.peran).toBe("USER")
	})

	it("menolak saat belum masuk", async () => {
		const db = { user: { findUnique: vi.fn() } } as never
		await expect(profilSaya(null, { db })).rejects.toMatchObject({
			kode: "TIDAK_TERAUTENTIKASI",
		})
	})
})

describe("perbaruiProfilSaya", () => {
	it("menyimpan nama dan telepon untuk peserta", async () => {
		const update = vi.fn(async () => ({ id: "u-1", nama: "Budi Baru", telepon: "0813" }))
		const db = { user: { update } } as never
		await perbaruiProfilSaya(sesiUser, { nama: "Budi Baru", telepon: "0813" }, { db })
		expect(update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: "u-1" },
				data: { nama: "Budi Baru", telepon: "0813" },
			}),
		)
	})

	it("juga berlaku untuk admin", async () => {
		const update = vi.fn(async () => ({ id: "a-1", nama: "Admin Baru", telepon: null }))
		const db = { user: { update } } as never
		await perbaruiProfilSaya(sesiAdmin, { nama: "Admin Baru", telepon: "" }, { db })
		// Telepon kosong dinormalkan menjadi null.
		expect(update).toHaveBeenCalledWith(
			expect.objectContaining({ data: { nama: "Admin Baru", telepon: null } }),
		)
	})

	it("menolak nama terlalu pendek", async () => {
		const db = { user: { update: vi.fn() } } as never
		await expect(
			perbaruiProfilSaya(sesiUser, { nama: "ab", telepon: "" }, { db }),
		).rejects.toMatchObject({ kode: "VALIDASI" })
	})
})

describe("gantiKataSandiSaya", () => {
	it("mengganti kata sandi bila kata sandi lama benar", async () => {
		const hashLama = await hashKataSandi("LamaRahasia123")
		const update = vi.fn(async (_arg: { data: { passwordHash: string } }) => ({ id: "u-1" }))
		const db = {
			user: {
				findUnique: vi.fn(async () => ({ id: "u-1", passwordHash: hashLama })),
				update,
			},
		} as never

		await gantiKataSandiSaya(
			sesiUser,
			{ kataSandiLama: "LamaRahasia123", kataSandiBaru: "BaruRahasia456" },
			{ db },
		)

		const arg = update.mock.calls[0][0]
		expect(arg.data.passwordHash).not.toBe(hashLama)
		expect(arg.data.passwordHash.startsWith("$2")).toBe(true)
	})

	it("menolak bila kata sandi lama salah", async () => {
		const hashLama = await hashKataSandi("LamaRahasia123")
		const db = {
			user: {
				findUnique: vi.fn(async () => ({ id: "u-1", passwordHash: hashLama })),
				update: vi.fn(),
			},
		} as never

		await expect(
			gantiKataSandiSaya(
				sesiUser,
				{ kataSandiLama: "SalahSekali999", kataSandiBaru: "BaruRahasia456" },
				{ db },
			),
		).rejects.toMatchObject({ kode: "TIDAK_BERWENANG" })
	})

	it("menolak kata sandi baru yang sama dengan yang lama", async () => {
		const hashLama = await hashKataSandi("SamaRahasia123")
		const db = {
			user: {
				findUnique: vi.fn(async () => ({ id: "u-1", passwordHash: hashLama })),
				update: vi.fn(),
			},
		} as never

		await expect(
			gantiKataSandiSaya(
				sesiUser,
				{ kataSandiLama: "SamaRahasia123", kataSandiBaru: "SamaRahasia123" },
				{ db },
			),
		).rejects.toMatchObject({ kode: "VALIDASI" })
	})

	it("menolak kata sandi baru yang terlalu lemah", async () => {
		const hashLama = await hashKataSandi("LamaRahasia123")
		const db = {
			user: {
				findUnique: vi.fn(async () => ({ id: "u-1", passwordHash: hashLama })),
				update: vi.fn(),
			},
		} as never

		await expect(
			gantiKataSandiSaya(
				sesiUser,
				{ kataSandiLama: "LamaRahasia123", kataSandiBaru: "pendek" },
				{ db },
			),
		).rejects.toMatchObject({ kode: "VALIDASI" })
	})
})
