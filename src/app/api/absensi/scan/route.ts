import { NextResponse } from "next/server"

import { sesiPengguna } from "@/lib/auth"
import { keResponsKesalahan } from "@/lib/kesalahan"
import { catatKehadiran } from "@/lib/layanan/absensi"

export const dynamic = "force-dynamic"

/**
 * Pencatatan kehadiran dari hasil scan QR.
 * Satu kehadiran per enrollment dijamin transaksi dan constraint basis data.
 */
export async function POST(permintaan: Request) {
	try {
		const sesi = await sesiPengguna()
		const body = await permintaan.json().catch(() => null)
		const hasil = await catatKehadiran(sesi, body)
		return NextResponse.json({ sukses: true, ...hasil }, { status: 201 })
	} catch (kesalahan) {
		const { status, body } = keResponsKesalahan(kesalahan)
		return NextResponse.json(body, { status })
	}
}
