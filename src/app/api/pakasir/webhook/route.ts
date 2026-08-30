import { NextResponse } from "next/server"

import { keResponsKesalahan } from "@/lib/kesalahan"
import { prosesWebhookPakasir } from "@/lib/layanan/pembayaran"

export const dynamic = "force-dynamic"

/**
 * Webhook Receiver Pakasir.
 * Endpoint: /api/pakasir/webhook
 * Format Payload: { amount, order_id, project, status, payment_method, completed_at }
 */
export async function POST(permintaan: Request) {
	const waktuMasuk = new Date().toISOString()
	const ip =
		permintaan.headers.get("x-forwarded-for") ??
		permintaan.headers.get("x-real-ip") ??
		"127.0.0.1"

	console.log("\n=======================================================")
	console.log(`📡 [PAKASIR WEBHOOK] INCOMING REQUEST @ ${waktuMasuk}`)
	console.log(`🌐 Origin/IP: ${ip}`)
	console.log(`📋 Content-Type: ${permintaan.headers.get("content-type") ?? "N/A"}`)

	try {
		const body = await permintaan.json().catch(() => null)
		console.log("📦 Payload Body:", JSON.stringify(body, null, 2))

		const hasil = await prosesWebhookPakasir({
			headers: permintaan.headers,
			body,
		})

		console.log("✅ [PAKASIR WEBHOOK] PROCESSED SUCCESSFULLY:", JSON.stringify(hasil, null, 2))
		console.log("=======================================================\n")

		return NextResponse.json({ sukses: true, ...hasil }, { status: 200 })
	} catch (kesalahan) {
		console.error("❌ [PAKASIR WEBHOOK] PROCESSING ERROR:", kesalahan)
		console.log("=======================================================\n")

		const { status, body } = keResponsKesalahan(kesalahan)
		return NextResponse.json(body, { status })
	}
}
