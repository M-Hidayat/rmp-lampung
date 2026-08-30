import { describe, expect, it, vi } from "vitest"

import { KesalahanDomain } from "@/lib/kesalahan"
import { adapterPakasirSandbox } from "@/lib/integrasi/pakasir"
import { prosesWebhookPakasir } from "@/lib/layanan/pembayaran"
import type { KlienDb } from "@/lib/prisma"

const PROYEK = "rmp-sandbox"
const pakasir = adapterPakasirSandbox({ slug: PROYEK })

type PaymentPalsu = {
	id: string
	status: "PENDING" | "PAID" | "FAILED" | "EXPIRED"
	nominal: string
	enrollmentId: string
	invoice?: { id: string }
}

type Rekaman = {
	paymentUpdate: Array<Record<string, unknown>>
	enrollmentUpdate: Array<Record<string, unknown>>
	invoiceCreate: Array<Record<string, unknown>>
}

/** Basis data palsu yang meniru hanya operasi yang dipakai layanan webhook. */
function siapkanDb(payment: PaymentPalsu | null) {
	const rekaman: Rekaman = {
		paymentUpdate: [],
		enrollmentUpdate: [],
		invoiceCreate: [],
	}

	const tx = {
		payment: {
			update: async (args: { data: Record<string, unknown> }) => {
				rekaman.paymentUpdate.push(args.data)
				return { id: payment?.id, nominal: payment?.nominal }
			},
		},
		enrollment: {
			update: async (args: { data: Record<string, unknown> }) => {
				rekaman.enrollmentUpdate.push(args.data)
				return {}
			},
			findUniqueOrThrow: async () => ({
				id: payment?.enrollmentId,
				user: {
					id: "peserta-1",
					nama: "Peserta Contoh",
					email: "peserta@contoh.test",
					telepon: null,
				},
				kelas: {
					id: "kelas-1",
					judul: "CONTOH - Pelatihan Usaha Mie Ayam",
					slug: "contoh-pelatihan-usaha-mie-ayam",
					harga: { toString: () => "350000.00" },
					lokasi: "Bandar Lampung",
					jadwalMulai: new Date("2026-09-01T02:00:00.000Z"),
				},
			}),
		},
		invoice: {
			create: async (args: { data: Record<string, unknown> }) => {
				rekaman.invoiceCreate.push(args.data)
				return { id: "invoice-1" }
			},
			findUnique: async () => null,
		},
	}

	const transaksiDipanggil = vi.fn()
	const db = {
		payment: {
			findUnique: async () =>
				payment
					? {
							id: payment.id,
							status: payment.status,
							nominal: { toString: () => payment.nominal },
							enrollmentId: payment.enrollmentId,
							invoice: payment.invoice ?? null,
						}
					: null,
		},
		$transaction: async (jalankan: (tx: unknown) => Promise<unknown>) => {
			transaksiDipanggil()
			return jalankan(tx)
		},
	} as unknown as KlienDb

	return { db, rekaman, transaksiDipanggil }
}

function payload(ubah: Record<string, unknown> = {}) {
	return {
		amount: 350000,
		order_id: "RMP260818ABC123",
		project: PROYEK,
		status: "completed",
		payment_method: "qris",
		completed_at: "2026-08-18T10:00:00.000Z",
		...ubah,
	}
}

const headers = new Headers({ "content-type": "application/json" })

async function tangkap(promise: Promise<unknown>): Promise<KesalahanDomain> {
	try {
		await promise
		throw new Error("seharusnya melempar KesalahanDomain")
	} catch (kesalahan) {
		expect(kesalahan).toBeInstanceOf(KesalahanDomain)
		return kesalahan as KesalahanDomain
	}
}

describe("webhook Pakasir", () => {
	it("melunasi pembayaran dan menerbitkan invoice dalam satu transaksi", async () => {
		const { db, rekaman, transaksiDipanggil } = siapkanDb({
			id: "pembayaran-1",
			status: "PENDING",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		const hasil = await prosesWebhookPakasir(
			{ headers, body: payload() },
			{
				db,
				pakasir,
				sekarang: () => new Date("2026-08-18T10:00:05.000Z"),
				nomorInvoice: () => "INV/RMP/202608/ABC123",
			},
		)

		expect(hasil.tindakan).toBe("pembayaran_dilunasi")
		expect(hasil.status).toBe("PAID")
		expect(hasil.invoiceId).toBe("invoice-1")
		expect(transaksiDipanggil).toHaveBeenCalledTimes(1)
		expect(rekaman.paymentUpdate[0]?.status).toBe("PAID")
		expect(rekaman.enrollmentUpdate[0]?.status).toBe("PAID")
		expect(rekaman.invoiceCreate[0]?.nomor).toBe("INV/RMP/202608/ABC123")
	})

	it("tidak menyimpan field sensitif pada payload yang diarsipkan", async () => {
		const { db, rekaman } = siapkanDb({
			id: "pembayaran-1",
			status: "PENDING",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		await prosesWebhookPakasir(
			{ headers, body: payload({ api_key: "jangan-disimpan" }) },
			{ db, pakasir, nomorInvoice: () => "INV/RMP/202608/ABC123" },
		)

		const payloadTersimpan = rekaman.paymentUpdate[0]?.payloadMentah as Record<
			string,
			unknown
		>
		expect(payloadTersimpan.order_id).toBe("RMP260818ABC123")
		expect(payloadTersimpan.api_key).toBeUndefined()
	})

	it("idempoten: webhook PAID yang terkirim ulang tidak mengubah data", async () => {
		const { db, rekaman, transaksiDipanggil } = siapkanDb({
			id: "pembayaran-1",
			status: "PAID",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
			invoice: { id: "invoice-1" },
		})

		const hasil = await prosesWebhookPakasir(
			{ headers, body: payload() },
			{ db, pakasir },
		)

		expect(hasil.tindakan).toBe("idempoten_dilewati")
		expect(hasil.invoiceId).toBe("invoice-1")
		expect(transaksiDipanggil).not.toHaveBeenCalled()
		expect(rekaman.invoiceCreate).toHaveLength(0)
	})

	it("menolak webhook yang tidak sah", async () => {
		const { db } = siapkanDb({
			id: "pembayaran-1",
			status: "PENDING",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		const galat = await tangkap(
			prosesWebhookPakasir(
				{ headers, body: payload({ project: "proyek-orang-lain" }) },
				{ db, pakasir },
			),
		)
		expect(galat.kode).toBe("TIDAK_BERWENANG")
	})

	it("menolak referensi pembayaran yang tidak dikenali", async () => {
		const { db } = siapkanDb(null)
		const galat = await tangkap(
			prosesWebhookPakasir({ headers, body: payload() }, { db, pakasir }),
		)
		expect(galat.kode).toBe("TIDAK_DITEMUKAN")
	})

	it("menolak nominal yang berbeda dari nominal transaksi", async () => {
		const { db, transaksiDipanggil } = siapkanDb({
			id: "pembayaran-1",
			status: "PENDING",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		const galat = await tangkap(
			prosesWebhookPakasir(
				{ headers, body: payload({ amount: 300000 }) },
				{ db, pakasir },
			),
		)
		expect(galat.kode).toBe("VALIDASI")
		expect(galat.message).toBe(
			"Nominal webhook tidak sesuai dengan nominal transaksi.",
		)
		expect(transaksiDipanggil).not.toHaveBeenCalled()
	})

	it("menolak status yang tidak dikenali", async () => {
		const { db } = siapkanDb({
			id: "pembayaran-1",
			status: "PENDING",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		const galat = await tangkap(
			prosesWebhookPakasir(
				{ headers, body: payload({ status: "settled" }) },
				{ db, pakasir },
			),
		)
		expect(galat.kode).toBe("VALIDASI")
	})

	it("menolak transisi status yang tidak sah", async () => {
		const { db } = siapkanDb({
			id: "pembayaran-1",
			status: "EXPIRED",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		const galat = await tangkap(
			prosesWebhookPakasir({ headers, body: payload() }, { db, pakasir }),
		)
		expect(galat.kode).toBe("TRANSISI_TIDAK_SAH")
	})

	it("menolak payload webhook yang tidak lengkap", async () => {
		const { db } = siapkanDb({
			id: "pembayaran-1",
			status: "PENDING",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		const galat = await tangkap(
			prosesWebhookPakasir(
				{ headers, body: { order_id: "RMP260818ABC123" } },
				{ db, pakasir },
			),
		)
		expect(galat.kode).toBe("VALIDASI")
	})

	it("pembayaran gagal membatalkan pendaftaran tanpa menerbitkan invoice", async () => {
		const { db, rekaman } = siapkanDb({
			id: "pembayaran-1",
			status: "PENDING",
			nominal: "350000.00",
			enrollmentId: "pendaftaran-1",
		})

		const hasil = await prosesWebhookPakasir(
			{ headers, body: payload({ status: "canceled" }) },
			{ db, pakasir },
		)

		expect(hasil.tindakan).toBe("status_diperbarui")
		expect(hasil.status).toBe("FAILED")
		expect(hasil.invoiceId).toBeUndefined()
		expect(rekaman.enrollmentUpdate[0]?.status).toBe("CANCELLED")
		expect(rekaman.invoiceCreate).toHaveLength(0)
	})
})
