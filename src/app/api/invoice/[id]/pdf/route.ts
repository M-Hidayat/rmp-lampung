import { NextResponse } from "next/server"

import { sesiPengguna } from "@/lib/auth"
import { buatPdfInvoice, namaBerkasInvoice } from "@/lib/dokumen/invoice-pdf"
import { keResponsKesalahan } from "@/lib/kesalahan"
import { ambilInvoiceUntukDokumen } from "@/lib/layanan/invoice"

export const dynamic = "force-dynamic"

/** Unduhan PDF invoice. Kepemilikan dan peran diperiksa layanan domain. */
export async function GET(
	_permintaan: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const sesi = await sesiPengguna()
		const invoice = await ambilInvoiceUntukDokumen(sesi, id)
		const pdf = await buatPdfInvoice(invoice)

		return new NextResponse(new Uint8Array(pdf), {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `inline; filename="${namaBerkasInvoice(invoice.nomor)}"`,
				"Cache-Control": "private, no-store",
			},
		})
	} catch (kesalahan) {
		const { status, body } = keResponsKesalahan(kesalahan)
		return NextResponse.json(body, { status })
	}
}
