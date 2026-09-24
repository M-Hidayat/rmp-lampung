import { describe, expect, it } from "vitest"

import {
	buatTokenAbsensi,
	hashTokenAbsensi,
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

	it("menghasilkan hash deterministik untuk token yang sama", () => {
		const token = buatTokenAbsensi()
		const hash = hashTokenAbsensi(token)
		expect(hash).not.toBe(token)
		expect(hash).toHaveLength(64)
		// Dasar validasi scan: pencarian `tokenHash` mengandalkan determinisme ini.
		expect(hashTokenAbsensi(token)).toBe(hash)
		expect(hashTokenAbsensi(buatTokenAbsensi())).not.toBe(hash)
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
