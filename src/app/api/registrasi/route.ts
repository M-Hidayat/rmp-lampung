import { NextResponse } from "next/server"

import { keResponsKesalahan } from "@/lib/kesalahan"
import { daftarPengguna } from "@/lib/layanan/registrasi"

/**
 * Registrasi peserta.
 * Boundary HTTP saja: validasi, hashing, dan penetapan peran ada di layanan
 * domain sehingga peran tidak pernah diambil dari input publik.
 */
export async function POST(permintaan: Request) {
	try {
		const body = await permintaan.json().catch(() => null)
		const pengguna = await daftarPengguna(body)
		return NextResponse.json({ sukses: true, pengguna }, { status: 201 })
	} catch (kesalahan) {
		const { status, body } = keResponsKesalahan(kesalahan)
		return NextResponse.json(body, { status })
	}
}
