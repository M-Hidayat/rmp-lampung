import { NextResponse } from "next/server"

import { keResponsKesalahan } from "@/lib/kesalahan"
import { prosesWebhookPakasir } from "@/lib/layanan/pembayaran"

export const dynamic = "force-dynamic"

/**
 * Webhook Pakasir.
 * Redirect pembayaran tidak dipercaya; hanya webhook terverifikasi yang dapat
 * mengubah status pembayaran serta membuat invoice secara idempoten.
 */
export async function POST(permintaan: Request) {
	try {
		const body = await permintaan.json().catch(() => null)
		const hasil = await prosesWebhookPakasir({
			headers: permintaan.headers,
			body,
		})
		return NextResponse.json({ sukses: true, ...hasil }, { status: 200 })
	} catch (kesalahan) {
		const { status, body } = keResponsKesalahan(kesalahan)
		return NextResponse.json(body, { status })
	}
}
