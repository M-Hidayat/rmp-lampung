import { describe, expect, it } from "vitest"

import {
	statusPendaftaranDariPembayaran,
	statusPendaftaranMemakaiKuota,
	transisiPembayaranSah,
} from "@/lib/layanan/status"

describe("transisi status pembayaran", () => {
	it("mengizinkan pelunasan dari PENDING", () => {
		expect(transisiPembayaranSah("PENDING", "PAID")).toBe(true)
		expect(transisiPembayaranSah("PENDING", "FAILED")).toBe(true)
		expect(transisiPembayaranSah("PENDING", "EXPIRED")).toBe(true)
	})

	it("menjadikan PAID sebagai status final", () => {
		expect(transisiPembayaranSah("PAID", "PAID")).toBe(true)
		expect(transisiPembayaranSah("PAID", "PENDING")).toBe(false)
		expect(transisiPembayaranSah("PAID", "FAILED")).toBe(false)
		expect(transisiPembayaranSah("PAID", "EXPIRED")).toBe(false)
	})

	it("menolak menghidupkan kembali transaksi kedaluwarsa", () => {
		expect(transisiPembayaranSah("EXPIRED", "PAID")).toBe(false)
		expect(transisiPembayaranSah("EXPIRED", "PENDING")).toBe(false)
	})

	it("memetakan status pendaftaran dari status pembayaran", () => {
		expect(statusPendaftaranDariPembayaran("PAID")).toBe("PAID")
		expect(statusPendaftaranDariPembayaran("FAILED")).toBe("CANCELLED")
		expect(statusPendaftaranDariPembayaran("EXPIRED")).toBe("EXPIRED")
		expect(statusPendaftaranDariPembayaran("PENDING")).toBe("PENDING")
	})

	it("hanya PENDING dan PAID yang memakai kuota kelas", () => {
		expect(statusPendaftaranMemakaiKuota).toEqual(["PENDING", "PAID"])
	})
})
