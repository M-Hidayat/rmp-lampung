import {
	Document,
	Page,
	StyleSheet,
	Text,
	View,
	renderToBuffer,
} from "@react-pdf/renderer"

import { identitasTampilan } from "@/lib/identitas-rmp"
import { formatRupiah, formatTanggalWaktu } from "@/lib/uang"
import type { InvoiceUntukDokumen } from "@/lib/layanan/invoice"

const gaya = StyleSheet.create({
	halaman: {
		padding: 40,
		fontSize: 10,
		color: "#1C1917",
		backgroundColor: "#FFFFFF",
		fontFamily: "Helvetica",
	},
	kepala: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 2,
		borderBottomColor: "#D49A28",
		paddingBottom: 14,
		marginBottom: 20,
	},
	namaUsaha: { fontSize: 16, fontWeight: 700, color: "#854D0E", letterSpacing: 0.5 },
	kecil: { fontSize: 8.5, color: "#57534E", marginTop: 1.5 },
	judulDokumen: { fontSize: 20, fontWeight: 700, textAlign: "right", color: "#1C1917", letterSpacing: 1 },
	nomorInvoice: { fontSize: 9, fontFamily: "Courier", fontWeight: 700, color: "#854D0E", textAlign: "right", marginTop: 2 },
	baris: { flexDirection: "row", marginBottom: 5 },
	label: { width: 130, color: "#78716C", fontSize: 9 },
	nilai: { flex: 1, color: "#1C1917", fontSize: 9.5, fontWeight: 700 },
	blok: {
		marginBottom: 16,
		padding: 12,
		backgroundColor: "#FAF8F5",
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#EFECE6",
	},
	judulBlok: { fontSize: 10.5, fontWeight: 700, color: "#854D0E", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
	tabelKepala: {
		flexDirection: "row",
		backgroundColor: "#FDF8ED",
		borderWidth: 1,
		borderColor: "#E8DFC8",
		borderRadius: 4,
		padding: 7,
		fontWeight: 700,
		color: "#854D0E",
	},
	tabelBaris: {
		flexDirection: "row",
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#EFECE6",
	},
	kolomUraian: { flex: 3 },
	kolomNominal: { flex: 1, textAlign: "right" },
	total: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 12,
		fontSize: 12,
		fontWeight: 700,
		color: "#854D0E",
	},
	catatan: { marginTop: 24, fontSize: 7.5, color: "#A8A29E", lineHeight: 1.5, borderTopWidth: 1, borderTopColor: "#EFECE6", paddingTop: 10 },
})

export function DokumenInvoice({ invoice }: { invoice: InvoiceUntukDokumen }) {
	return (
		<Document
			title={`Invoice ${invoice.nomor}`}
			author={identitasTampilan.nama}
			language="id"
		>
			<Page size="A4" style={gaya.halaman}>
				<View style={gaya.kepala}>
					<View>
						<Text style={gaya.namaUsaha}>{identitasTampilan.nama}</Text>
						<Text style={gaya.kecil}>{identitasTampilan.alamat}</Text>
						<Text style={gaya.kecil}>
							Telepon {identitasTampilan.telepon} · {identitasTampilan.email}
						</Text>
					</View>
					<View>
						<Text style={gaya.judulDokumen}>INVOICE</Text>
						<Text style={[gaya.kecil, { textAlign: "right" }]}>
							{invoice.nomor}
						</Text>
					</View>
				</View>

				<View style={gaya.blok}>
					<Text style={gaya.judulBlok}>Data Peserta</Text>
					<View style={gaya.baris}>
						<Text style={gaya.label}>Nama</Text>
						<Text style={gaya.nilai}>{invoice.peserta.nama}</Text>
					</View>
					<View style={gaya.baris}>
						<Text style={gaya.label}>Email</Text>
						<Text style={gaya.nilai}>{invoice.peserta.email}</Text>
					</View>
					{invoice.peserta.telepon ? (
						<View style={gaya.baris}>
							<Text style={gaya.label}>Telepon</Text>
							<Text style={gaya.nilai}>{invoice.peserta.telepon}</Text>
						</View>
					) : null}
				</View>

				<View style={gaya.blok}>
					<Text style={gaya.judulBlok}>Rincian Pembayaran</Text>
					<View style={gaya.baris}>
						<Text style={gaya.label}>Waktu pembayaran</Text>
						<Text style={gaya.nilai}>
							{formatTanggalWaktu(invoice.dibayarPada)} WIB
						</Text>
					</View>
					<View style={gaya.baris}>
						<Text style={gaya.label}>Metode pembayaran</Text>
						<Text style={gaya.nilai}>
							{invoice.metode ?? "Tidak dicatat penyedia pembayaran"}
						</Text>
					</View>
					<View style={gaya.baris}>
						<Text style={gaya.label}>Referensi transaksi</Text>
						<Text style={gaya.nilai}>{invoice.referensi}</Text>
					</View>
					<View style={gaya.baris}>
						<Text style={gaya.label}>Status</Text>
						<Text style={gaya.nilai}>LUNAS</Text>
					</View>
				</View>

				<View>
					<View style={gaya.tabelKepala}>
						<Text style={gaya.kolomUraian}>Uraian</Text>
						<Text style={gaya.kolomNominal}>Nominal</Text>
					</View>
					<View style={gaya.tabelBaris}>
						<View style={gaya.kolomUraian}>
							<Text>{invoice.kelas.judul}</Text>
							<Text style={gaya.kecil}>
								Lokasi: {invoice.kelas.lokasi} · Jadwal:{" "}
								{formatTanggalWaktu(invoice.kelas.jadwalMulai)} WIB
							</Text>
						</View>
						<Text style={gaya.kolomNominal}>
							{formatRupiah(invoice.nominal)}
						</Text>
					</View>
					<View style={gaya.total}>
						<Text>Total dibayar: {formatRupiah(invoice.nominal)}</Text>
					</View>
				</View>

				<Text style={gaya.catatan}>
					Invoice ini dibuat otomatis oleh sistem dan sah tanpa tanda tangan
					basah. Data peserta dan kelas memakai snapshot pada saat pembayaran
					dinyatakan lunas sehingga tidak berubah bila profil atau kelas
					diperbarui.
				</Text>
			</Page>
		</Document>
	)
}

/** Menghasilkan berkas PDF invoice sebagai buffer. */
export async function buatPdfInvoice(
	invoice: InvoiceUntukDokumen,
): Promise<Buffer> {
	return renderToBuffer(<DokumenInvoice invoice={invoice} />)
}

export function namaBerkasInvoice(nomor: string): string {
	return `invoice-${nomor.replace(/[^A-Za-z0-9]+/g, "-").toLowerCase()}.pdf`
}
