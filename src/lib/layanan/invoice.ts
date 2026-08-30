import { KesalahanDomain } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import {
	wajibPemilikDokumenAtauOperasional,
	wajibSesi,
	type SesiPengguna,
} from "@/lib/rbac"

export type DependensiInvoice = { db?: KlienDb }

export type SnapshotPeserta = {
	userId: string
	nama: string
	email: string
	telepon?: string | null
}

export type SnapshotKelas = {
	classId: string
	judul: string
	slug: string
	harga: string
	lokasi: string
	jadwalMulai: string
}

/** Invoice milik pengguna yang sedang masuk. */
export async function invoiceSaya(
	sesi: SesiPengguna | null,
	dependensi: DependensiInvoice = {},
) {
	const pengguna = wajibSesi(sesi)
	const db = dependensi.db ?? prisma

	return db.invoice.findMany({
		where: { payment: { enrollment: { userId: pengguna.id } } },
		orderBy: { dibayarPada: "desc" },
		select: {
			id: true,
			nomor: true,
			nominal: true,
			dibayarPada: true,
			snapshotKelas: true,
		},
	})
}

/**
 * Mengambil invoice untuk pembuatan PDF.
 * Hanya pemilik dokumen atau peran operasional yang sah dapat mengaksesnya.
 */
export async function ambilInvoiceUntukDokumen(
	sesi: SesiPengguna | null,
	invoiceId: string,
	dependensi: DependensiInvoice = {},
) {
	const db = dependensi.db ?? prisma

	const invoice = await db.invoice.findUnique({
		where: { id: invoiceId },
		select: {
			id: true,
			nomor: true,
			nominal: true,
			dibayarPada: true,
			snapshotPeserta: true,
			snapshotKelas: true,
			payment: {
				select: {
					metode: true,
					pakasirRef: true,
					enrollment: { select: { userId: true } },
				},
			},
		},
	})
	if (!invoice) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Invoice tidak ditemukan.")
	}

	wajibPemilikDokumenAtauOperasional(
		sesi,
		invoice.payment.enrollment.userId,
	)

	return {
		id: invoice.id,
		nomor: invoice.nomor,
		nominal: invoice.nominal.toString(),
		dibayarPada: invoice.dibayarPada,
		metode: invoice.payment.metode,
		referensi: invoice.payment.pakasirRef,
		peserta: invoice.snapshotPeserta as unknown as SnapshotPeserta,
		kelas: invoice.snapshotKelas as unknown as SnapshotKelas,
	}
}

export type InvoiceUntukDokumen = Awaited<
	ReturnType<typeof ambilInvoiceUntukDokumen>
>
