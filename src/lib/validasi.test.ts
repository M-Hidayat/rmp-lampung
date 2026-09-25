import { describe, expect, it } from "vitest"

import { parseTanggalWib, skemaKelas } from "@/lib/validasi"

const dasarKelas = {
	judul: "Kelas Roti",
	slug: "kelas-roti",
	deskripsi: "Belajar membuat roti untuk usaha rumahan.",
	harga: 350000,
	kuota: 15,
	lokasi: "Dapur RMP Lampung",
}

describe("parseTanggalWib", () => {
	it("mengubah datetime-local WIB menjadi instant UTC dan dapat dibulatkan kembali", () => {
		const hasil = parseTanggalWib("2026-09-22T10:00")
		expect(hasil).toBeInstanceOf(Date)
		expect((hasil as Date).toISOString()).toBe("2026-09-22T03:00:00.000Z")
		expect(new Date((hasil as Date).getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16)).toBe("2026-09-22T10:00")
	})

	it.each(["", "2026-02-30T10:00", "2026-09-22 10:00", "bukan-tanggal"])(
		"meneruskan input tidak valid ke validasi field tanpa melempar: %s",
		(nilai) => {
			expect(() => parseTanggalWib(nilai)).not.toThrow()
			const hasil = skemaKelas.safeParse({ ...dasarKelas, jadwalMulai: parseTanggalWib(nilai) })
			expect(hasil.success).toBe(false)
			if (!hasil.success) expect(hasil.error.issues.some((isu) => isu.path[0] === "jadwalMulai")).toBe(true)
		},
	)
})
