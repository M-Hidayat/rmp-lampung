import { NextResponse } from "next/server"

import { sesiPengguna } from "@/lib/auth"
import {
	buatPdfSertifikat,
	namaBerkasSertifikat,
} from "@/lib/dokumen/sertifikat-pdf"
import { keResponsKesalahan } from "@/lib/kesalahan"
import { konfigurasi } from "@/lib/konfigurasi"
import { ambilSertifikatUntukDokumen } from "@/lib/layanan/sertifikat"
import { urlVerifikasiSertifikat } from "@/lib/layanan/token-absensi"

export const dynamic = "force-dynamic"

/**
 * Unduhan PDF sertifikat.
 * Sertifikat yang dibatalkan tidak dapat diunduh; kepemilikan diperiksa pada
 * layanan domain.
 */
export async function GET(
	_permintaan: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const sesi = await sesiPengguna()
		const sertifikat = await ambilSertifikatUntukDokumen(sesi, id)
		const env = konfigurasi()

		const pdf = await buatPdfSertifikat({
			nomor: sertifikat.nomor,
			namaPeserta: sertifikat.attendance.enrollment.user.nama,
			judulKelas: sertifikat.attendance.enrollment.kelas.judul,
			diterbitkanPada: sertifikat.diterbitkanPada,
			lokasiKelas: sertifikat.attendance.enrollment.kelas.lokasi,
			tanggalKelas: sertifikat.attendance.enrollment.kelas.jadwalMulai,
			penandatangan: env.SERTIFIKAT_PENANDATANGAN,
			jabatanPenandatangan: env.SERTIFIKAT_JABATAN_PENANDATANGAN,
			urlVerifikasi: urlVerifikasiSertifikat(env.APP_URL, sertifikat.nomor),
		})

		return new NextResponse(new Uint8Array(pdf), {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `inline; filename="${namaBerkasSertifikat(sertifikat.nomor)}"`,
				"Cache-Control": "private, no-store",
			},
		})
	} catch (kesalahan) {
		const { status, body } = keResponsKesalahan(kesalahan)
		return NextResponse.json(body, { status })
	}
}
