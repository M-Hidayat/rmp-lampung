import { describe, expect, it } from "vitest"

import {
	buatTokenAbsensi,
	hashTokenAbsensi,
	hitungKedaluwarsa,
	tokenCocok,
	tokenMasihBerlaku,
	urlScanAbsensi,
	urlVerifikasiSertifikat,
} from "@/lib/layanan/token-absensi"

describe("token absensi", () => {
	it("menghasilkan token acak yang panjang dan tidak berulang", () => {
		const a = buatTokenAbsensi()
		const b = buatTokenAbsensi()
		expect(a).not.toBe(b)
		expect(a.length).toBeGreaterThanOrEqual(40)
		expect(a).toMatch(/^[A-Za-z0-9_-]+$/)
	})

	it("hanya menyimpan hash dan mencocokkan token asli", () => {
		const token = buatTokenAbsensi()
		const hash = hashTokenAbsensi(token)
		expect(hash).not.toBe(token)
		expect(hash).toHaveLength(64)
		expect(tokenCocok(token, hash)).toBe(true)
		expect(tokenCocok(buatTokenAbsensi(), hash)).toBe(false)
	})

	it("menghitung dan mengevaluasi masa berlaku token", () => {
		const sekarang = new Date("2026-01-01T00:00:00.000Z")
		const kedaluwarsa = hitungKedaluwarsa(sekarang, 10)
		expect(kedaluwarsa.toISOString()).toBe("2026-01-01T00:10:00.000Z")
		expect(tokenMasihBerlaku(kedaluwarsa, sekarang)).toBe(true)
		expect(
			tokenMasihBerlaku(kedaluwarsa, new Date("2026-01-01T00:10:01.000Z")),
		).toBe(false)
	})

	it("membentuk URL scan dan verifikasi", () => {
		expect(urlScanAbsensi("http://localhost:3000", "abc123")).toBe(
			"http://localhost:3000/user/absensi?token=abc123",
		)
		expect(
			urlVerifikasiSertifikat("http://localhost:3000", "SRT/RMP/2026/ABC123"),
		).toBe("http://localhost:3000/verifikasi/SRT%2FRMP%2F2026%2FABC123")
	})
})
