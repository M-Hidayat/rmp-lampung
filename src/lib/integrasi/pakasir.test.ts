import { describe, expect, it } from "vitest"

import {
	adapterPakasirProduksi,
	adapterPakasirSandbox,
	bangunUrlPembayaran,
	bersihkanPayload,
	petakanStatusPakasir,
} from "@/lib/integrasi/pakasir"

describe("pemetaan status Pakasir", () => {
	it("memetakan status yang dikenal secara eksplisit", () => {
		expect(petakanStatusPakasir("completed")).toBe("PAID")
		expect(petakanStatusPakasir("PAID")).toBe("PAID")
		expect(petakanStatusPakasir("pending")).toBe("PENDING")
		expect(petakanStatusPakasir(" waiting ")).toBe("PENDING")
		expect(petakanStatusPakasir("cancelled")).toBe("FAILED")
		expect(petakanStatusPakasir("failed")).toBe("FAILED")
		expect(petakanStatusPakasir("expired")).toBe("EXPIRED")
	})

	it("menolak status yang tidak dikenal, bukan menebak", () => {
		expect(petakanStatusPakasir("settled")).toBeNull()
		expect(petakanStatusPakasir("")).toBeNull()
	})
})

describe("URL pembayaran", () => {
	it("membentuk URL redirect sesuai kontrak publik Pakasir", () => {
		const url = new URL(
			bangunUrlPembayaran({
				baseUrl: "https://app.pakasir.com",
				slug: "rmp-lampung",
				orderId: "RMP260818ABC123",
				nominal: "350000.00",
				urlKembali: "http://localhost:3000/user/pembayaran",
			}),
		)
		expect(url.pathname).toBe("/pay/rmp-lampung/350000")
		expect(url.searchParams.get("order_id")).toBe("RMP260818ABC123")
		expect(url.searchParams.get("redirect")).toBe(
			"http://localhost:3000/user/pembayaran",
		)
	})

	it("adapter sandbox tidak menyentuh jaringan dan memakai halaman simulasi", () => {
		const adapter = adapterPakasirSandbox({
			appUrl: "http://localhost:3000",
			slug: "rmp-sandbox",
		})
		const url = new URL(
			adapter.buatUrlPembayaran({
				orderId: "RMP260818ABC123",
				nominal: 350000,
				urlKembali: "http://localhost:3000/user/pembayaran",
			}),
		)
		expect(adapter.mode).toBe("sandbox")
		expect(url.pathname).toBe("/simulasi-pembayaran")
		expect(url.searchParams.get("amount")).toBe("350000")
	})
})

describe("verifikasi webhook", () => {
	it("menolak proyek yang bukan milik kita (mode sandbox)", () => {
		const adapter = adapterPakasirSandbox({ slug: "rmp-sandbox" })
		expect(
			adapter.verifikasiWebhook({
				headers: new Headers(),
				body: { project: "proyek-orang-lain" },
			}).valid,
		).toBe(false)
		expect(
			adapter.verifikasiWebhook({
				headers: new Headers(),
				body: { project: "rmp-sandbox" },
			}).valid,
		).toBe(true)
	})

	it("mode produksi memvalidasi proyek dan rahasia header bila disertakan", () => {
		const adapter = adapterPakasirProduksi({
			baseUrl: "https://app.pakasir.com",
			slug: "rmp-lampung",
			apiKey: "kunci-uji",
			webhookSecret: "rahasia-uji",
			fetchImpl: async () => new Response("{}", { status: 200 }),
		})

		// Menolak proyek yang salah
		expect(
			adapter.verifikasiWebhook({
				headers: new Headers(),
				body: { project: "proyek-lain" },
			}).valid,
		).toBe(false)

		// Menerima payload standar Pakasir dengan proyek yang benar
		expect(
			adapter.verifikasiWebhook({
				headers: new Headers(),
				body: { project: "rmp-lampung" },
			}).valid,
		).toBe(true)

		// Menolak jika header rahasia disertakan tapi tidak cocok
		expect(
			adapter.verifikasiWebhook({
				headers: new Headers({ "x-pakasir-secret": "rahasia-salah" }),
				body: { project: "rmp-lampung" },
			}).valid,
		).toBe(false)

		// Menerima jika header rahasia cocok
		expect(
			adapter.verifikasiWebhook({
				headers: new Headers({ "x-pakasir-secret": "rahasia-uji" }),
				body: { project: "rmp-lampung" },
			}).valid,
		).toBe(true)
	})

	it("mengonfirmasi status melalui Transaction Detail API", async () => {
		let urlDipanggil = ""
		const adapter = adapterPakasirProduksi({
			baseUrl: "https://app.pakasir.com",
			slug: "rmp-lampung",
			apiKey: "kunci-uji",
			webhookSecret: "rahasia-uji",
			fetchImpl: async (masukan) => {
				urlDipanggil = String(masukan)
				return new Response(
					JSON.stringify({
						transaction: {
							status: "completed",
							payment_method: "qris",
							completed_at: "2026-08-18T10:00:00.000Z",
						},
					}),
					{ status: 200 },
				)
			},
		})

		const hasil = await adapter.cekStatusTransaksi({
			orderId: "RMP260818ABC123",
			nominal: "350000.00",
		})
		expect(hasil.ditemukan).toBe(true)
		expect(hasil.statusMentah).toBe("completed")
		expect(hasil.metode).toBe("qris")
		expect(urlDipanggil).toContain("/api/transactiondetail")
		expect(urlDipanggil).toContain("order_id=RMP260818ABC123")
		expect(urlDipanggil).toContain("amount=350000")
	})

	it("menganggap transaksi tidak ditemukan bila API gagal", async () => {
		const adapter = adapterPakasirProduksi({
			baseUrl: "https://app.pakasir.com",
			slug: "rmp-lampung",
			apiKey: "kunci-uji",
			webhookSecret: "rahasia-uji",
			fetchImpl: async () => new Response("gagal", { status: 500 }),
		})
		const hasil = await adapter.cekStatusTransaksi({
			orderId: "RMP260818ABC123",
			nominal: 350000,
		})
		expect(hasil.ditemukan).toBe(false)
	})
})

describe("pengarsipan payload", () => {
	it("membuang field sensitif sebelum diarsipkan", () => {
		expect(
			bersihkanPayload({
				amount: 350000,
				order_id: "RMP260818ABC123",
				api_key: "jangan-disimpan",
				Signature: "jangan-disimpan",
				status: "completed",
			}),
		).toEqual({
			amount: 350000,
			order_id: "RMP260818ABC123",
			status: "completed",
		})
	})
})
