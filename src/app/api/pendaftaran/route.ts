import { NextResponse } from "next/server"

import { sesiPengguna } from "@/lib/auth"
import { keResponsKesalahan } from "@/lib/kesalahan"
import { daftarKelas } from "@/lib/layanan/pendaftaran"

/**
 * Pendaftaran kelas.
 * Pemeriksaan kelas aktif, jadwal, pendaftaran ganda, dan kuota dijalankan
 * dalam transaksi pada layanan domain.
 */
export async function POST(permintaan: Request) {
	try {
		const sesi = await sesiPengguna()
		const body = await permintaan.json().catch(() => null)
		const hasil = await daftarKelas(sesi, body)
		return NextResponse.json({ sukses: true, ...hasil }, { status: 201 })
	} catch (kesalahan) {
		const { status, body } = keResponsKesalahan(kesalahan)
		return NextResponse.json(body, { status })
	}
}
