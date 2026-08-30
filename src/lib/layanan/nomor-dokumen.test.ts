import { describe, expect, it } from "vitest"

import {
	bentukNomorInvoice,
	bentukNomorSertifikat,
	bentukOrderIdPakasir,
} from "@/lib/layanan/nomor-dokumen"

const tanggal = new Date("2026-08-18T03:04:05.000Z")

describe("nomor dokumen", () => {
	it("membentuk nomor invoice sesuai format", () => {
		expect(bentukNomorInvoice(tanggal, "ABC123")).toBe("INV/RMP/202608/ABC123")
		expect(bentukNomorInvoice(tanggal)).toMatch(
			/^INV\/RMP\/202608\/[A-Z2-9]{6}$/,
		)
	})

	it("membentuk nomor sertifikat sesuai format", () => {
		expect(bentukNomorSertifikat(tanggal, "ABC123")).toBe("SRT/RMP/2026/ABC123")
		expect(bentukNomorSertifikat(tanggal)).toMatch(/^SRT\/RMP\/2026\/[A-Z2-9]{6}$/)
	})

	it("membentuk order id Pakasir yang aman untuk URL", () => {
		expect(bentukOrderIdPakasir(tanggal, "ABC123")).toBe("RMP260818ABC123")
		expect(bentukOrderIdPakasir(tanggal)).toMatch(/^RMP260818[A-Z2-9]{6}$/)
	})

	it("menghasilkan segmen acak yang berbeda antar pemanggilan", () => {
		const kumpulan = new Set(
			Array.from({ length: 40 }, () => bentukNomorInvoice(tanggal)),
		)
		expect(kumpulan.size).toBeGreaterThan(35)
	})
})
