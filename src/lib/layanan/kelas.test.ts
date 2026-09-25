import { describe, expect, it, vi } from "vitest"

import { ambilKelasOperasional, buatKelas, perbaruiKelas } from "@/lib/layanan/kelas"
import { statusPendaftaranMemakaiKuota } from "@/lib/layanan/status"
import type { SesiPengguna } from "@/lib/rbac"

const admin: SesiPengguna = {
	id: "admin-1",
	nama: "Admin",
	email: "admin@contoh.test",
	peran: "ADMIN",
}

const masukanKelas = {
	judul: "Kelas Roti",
	slug: "kelas-roti",
	deskripsi: "Belajar membuat roti untuk usaha rumahan.",
	harga: 350000,
	kuota: 15,
	jadwalMulai: new Date("2026-09-22T03:00:00.000Z"),
	lokasi: "Dapur RMP Lampung",
}

describe("mutasi kelas", () => {
	it("membuat kelas aktif secara default", async () => {
		const create = vi.fn().mockImplementation(({ data }) => data)
		await buatKelas(admin, masukanKelas, { db: { courseClass: { create } } as never })
		expect(create.mock.calls[0][0].data.aktif).toBe(true)
	})

	it("tidak mengubah status dan mempertahankan gambar ketika input gambar tidak ada", async () => {
		const update = vi.fn().mockImplementation(({ data }) => data)
		const db = {
			courseClass: {
				findUnique: vi.fn().mockResolvedValue({ id: "kelas-1", gambarUrl: "https://contoh.test/lama.jpg", aktif: false }),
				update,
			},
			enrollment: { count: vi.fn().mockResolvedValue(0) },
		} as never
		await perbaruiKelas(admin, "kelas-1", { ...masukanKelas, aktif: true }, { db })
		const data = update.mock.calls[0][0].data
		expect(data).not.toHaveProperty("aktif")
		expect(data).not.toHaveProperty("gambarUrl")
	})
})

describe("ambilKelasOperasional", () => {
	it("mengambil kelas operasional berdasarkan id", async () => {
		const findUnique = vi.fn().mockResolvedValue({ id: "kelas-1", judul: "Kelas Roti", _count: { enrollments: 2 } })
		const hasil = await ambilKelasOperasional(admin, "kelas-1", { db: { courseClass: { findUnique } } as never })
		expect(hasil.id).toBe("kelas-1")
		expect(findUnique).toHaveBeenCalledWith({
			where: { id: "kelas-1" },
			include: { _count: { select: { enrollments: { where: { status: { in: statusPendaftaranMemakaiKuota } } } } } },
		})
	})

	it("menolak id kelas yang tidak ditemukan", async () => {
		const db = { courseClass: { findUnique: vi.fn().mockResolvedValue(null) } } as never
		await expect(ambilKelasOperasional(admin, "hilang", { db })).rejects.toMatchObject({ kode: "TIDAK_DITEMUKAN", message: "Kelas tidak ditemukan." })
	})

	it("memeriksa kemampuan sebelum mengakses basis data", async () => {
		const findUnique = vi.fn()
		const pengguna = { ...admin, peran: "USER" as const }
		await expect(ambilKelasOperasional(pengguna, "kelas-1", { db: { courseClass: { findUnique } } as never })).rejects.toMatchObject({ kode: "TIDAK_BERWENANG" })
		expect(findUnique).not.toHaveBeenCalled()
	})
})
