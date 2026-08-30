import { konfigurasi } from "@/lib/konfigurasi"
import { keRupiahBulat, type NominalSepertiDesimal } from "@/lib/uang"
import type { StatusPembayaran } from "@/lib/layanan/status"

/**
 * Adapter internal Pakasir.
 *
 * Kontrak publik Pakasir (per dokumentasi https://pakasir.com/p/docs):
 * - Redirect: {BASE}/pay/{slug}/{amount}?order_id={order_id}&redirect={url}
 * - Webhook: POST body { amount, order_id, project, status, payment_method, completed_at }
 * - Transaction Detail: GET {BASE}/api/transactiondetail?project=..&amount=..&order_id=..&api_key=..
 *
 * Dokumentasi publik belum memuat skema tanda tangan webhook. Karena itu
 * verifikasi memakai dua lapis: rahasia bersama pada header (dikonfigurasi di
 * dashboard proyek bila tersedia) dan konfirmasi ulang melalui Transaction
 * Detail API. Integrasi produksi hanya diaktifkan setelah kontrak resmi
 * tersedia (lihat Keputusan Eksplisit pada README).
 */

export type PermintaanUrlPembayaran = {
	orderId: string
	nominal: NominalSepertiDesimal
	urlKembali: string
}

export type StatusTransaksiPakasir = {
	ditemukan: boolean
	statusMentah: string
	metode?: string
	dibayarPada?: Date
}

export type HasilVerifikasiWebhook =
	| { valid: true }
	| { valid: false; alasan: string }

export type AdapterPakasir = {
	mode: "sandbox" | "produksi"
	buatUrlPembayaran: (permintaan: PermintaanUrlPembayaran) => string
	verifikasiWebhook: (masukan: {
		headers: Headers
		body: { project: string }
	}) => HasilVerifikasiWebhook
	cekStatusTransaksi: (masukan: {
		orderId: string
		nominal: NominalSepertiDesimal
	}) => Promise<StatusTransaksiPakasir>
}

/** Pemetaan status eksternal Pakasir ke status internal secara eksplisit. */
export function petakanStatusPakasir(
	statusMentah: string,
): StatusPembayaran | null {
	switch (statusMentah.trim().toLowerCase()) {
		case "completed":
		case "paid":
			return "PAID"
		case "pending":
		case "waiting":
			return "PENDING"
		case "canceled":
		case "cancelled":
		case "failed":
			return "FAILED"
		case "expired":
			return "EXPIRED"
		default:
			return null
	}
}

/** Membentuk URL redirect Pakasir sesuai dokumentasi integrasi via URL. */
export function bangunUrlPembayaran(masukan: {
	baseUrl: string
	slug: string
	orderId: string
	nominal: NominalSepertiDesimal
	urlKembali: string
	hanyaQris?: boolean
}): string {
	const nominal = keRupiahBulat(masukan.nominal)
	const url = new URL(
		`/pay/${encodeURIComponent(masukan.slug)}/${nominal}`,
		masukan.baseUrl,
	)
	url.searchParams.set("order_id", masukan.orderId)
	url.searchParams.set("redirect", masukan.urlKembali)
	if (masukan.hanyaQris) url.searchParams.set("qris_only", "1")
	return url.toString()
}

/** Perbandingan rahasia bersama dengan waktu tetap sederhana. */
function rahasiaSama(a: string, b: string): boolean {
	if (a.length !== b.length) return false
	let beda = 0
	for (let i = 0; i < a.length; i += 1) {
		beda |= a.charCodeAt(i) ^ b.charCodeAt(i)
	}
	return beda === 0
}

/** Membuang field sensitif dari payload sebelum diarsipkan. */
export function bersihkanPayload(
	payload: Record<string, unknown>,
): Record<string, unknown> {
	const kunciSensitif = ["api_key", "apikey", "signature", "token", "secret"]
	const hasil: Record<string, unknown> = {}
	for (const [kunci, nilai] of Object.entries(payload)) {
		if (kunciSensitif.includes(kunci.toLowerCase())) continue
		hasil[kunci] = nilai
	}
	return hasil
}

/** Adapter sandbox/dummy: tidak memanggil jaringan sama sekali. */
export function adapterPakasirSandbox(opsi?: {
	appUrl?: string
	slug?: string
}): AdapterPakasir {
	const appUrl = opsi?.appUrl ?? "http://localhost:3000"
	const slug = opsi?.slug ?? "rmp-sandbox"

	return {
		mode: "sandbox",
		buatUrlPembayaran: ({ orderId, nominal, urlKembali }) => {
			const url = new URL("/simulasi-pembayaran", appUrl)
			url.searchParams.set("proyek", slug)
			url.searchParams.set("order_id", orderId)
			url.searchParams.set("amount", String(keRupiahBulat(nominal)))
			url.searchParams.set("redirect", urlKembali)
			return url.toString()
		},
		verifikasiWebhook: ({ body }) =>
			body.project === slug
				? { valid: true }
				: { valid: false, alasan: "Proyek webhook tidak dikenali." },
		cekStatusTransaksi: async () => ({
			// Pada mode sandbox status webhook dipercaya apa adanya setelah
			// pemeriksaan proyek dan nominal pada layanan domain.
			ditemukan: true,
			statusMentah: "dipercaya-dari-webhook",
		}),
	}
}

/** Adapter produksi: memanggil API resmi Pakasir. */
export function adapterPakasirProduksi(opsi: {
	baseUrl: string
	slug: string
	apiKey: string
	webhookSecret: string
	fetchImpl?: typeof fetch
}): AdapterPakasir {
	const panggil = opsi.fetchImpl ?? fetch

	return {
		mode: "produksi",
		buatUrlPembayaran: ({ orderId, nominal, urlKembali }) =>
			bangunUrlPembayaran({
				baseUrl: opsi.baseUrl,
				slug: opsi.slug,
				orderId,
				nominal,
				urlKembali,
			}),
		verifikasiWebhook: ({ headers, body }) => {
			if (body.project !== opsi.slug) {
				return { valid: false, alasan: "Proyek webhook tidak dikenali." }
			}
			const rahasia =
				headers.get("x-pakasir-secret") ??
				headers.get("x-webhook-secret") ??
				""
			// Jika header rahasia disertakan, wajib sesuai dengan webhookSecret
			if (rahasia && !rahasiaSama(rahasia, opsi.webhookSecret)) {
				return { valid: false, alasan: "Rahasia webhook tidak sesuai." }
			}
			return { valid: true }
		},
		cekStatusTransaksi: async ({ orderId, nominal }) => {
			const url = new URL("/api/transactiondetail", opsi.baseUrl)
			url.searchParams.set("project", opsi.slug)
			url.searchParams.set("amount", String(keRupiahBulat(nominal)))
			url.searchParams.set("order_id", orderId)
			url.searchParams.set("api_key", opsi.apiKey)

			const respons = await panggil(url, {
				method: "GET",
				cache: "no-store",
			})
			if (!respons.ok) {
				return { ditemukan: false, statusMentah: "tidak-tersedia" }
			}
			const data = (await respons.json()) as {
				transaction?: {
					status?: string
					payment_method?: string
					completed_at?: string
				}
			}
			if (!data.transaction?.status) {
				return { ditemukan: false, statusMentah: "tidak-ditemukan" }
			}
			return {
				ditemukan: true,
				statusMentah: data.transaction.status,
				metode: data.transaction.payment_method,
				dibayarPada: data.transaction.completed_at
					? new Date(data.transaction.completed_at)
					: undefined,
			}
		},
	}
}

let adapterCache: AdapterPakasir | null = null

/** Adapter aktif sesuai environment (default: sandbox). */
export function adapterPakasir(): AdapterPakasir {
	if (adapterCache) return adapterCache
	const env = konfigurasi()

	adapterCache =
		env.PAKASIR_MODE === "produksi"
			? adapterPakasirProduksi({
					baseUrl: env.PAKASIR_BASE_URL,
					slug: env.PAKASIR_SLUG,
					apiKey: env.PAKASIR_API_KEY,
					webhookSecret: env.PAKASIR_WEBHOOK_SECRET,
				})
			: adapterPakasirSandbox({
					appUrl: env.APP_URL,
					slug: env.PAKASIR_SLUG || "rmp-sandbox",
				})

	return adapterCache
}

export function resetAdapterPakasirUntukUji(): void {
	adapterCache = null
}
