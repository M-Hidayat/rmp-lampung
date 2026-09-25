import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
	renderToBuffer,
} from "@react-pdf/renderer"
import QRCode from "qrcode"

import { identitasTampilan } from "@/lib/identitas-rmp"
import { warnaCetak } from "@/lib/dokumen/token-cetak"
import { formatTanggal } from "@/lib/uang"

export type DataSertifikat = {
	nomor: string
	namaPeserta: string
	judulKelas: string
	diterbitkanPada: Date
	lokasiKelas: string
	tanggalKelas: Date
	penandatangan: string
	jabatanPenandatangan: string
	urlVerifikasi: string
}

const gaya = StyleSheet.create({
	halaman: {
		padding: 24,
		backgroundColor: warnaCetak.ivory,
		fontFamily: "Helvetica",
		color: warnaCetak.ink,
	},
	bingkaiLuar: {
		borderWidth: 2,
		borderColor: warnaCetak.ink,
		padding: 4,
		height: "100%",
		backgroundColor: warnaCetak.paper,
	},
	bingkaiDalam: {
		borderWidth: 1.5,
		borderColor: warnaCetak.gold,
		padding: 16,
		height: "100%",
		position: "relative",
		justifyContent: "space-between",
	},
	// Sudut Hiasan Emas
	sudutKiriAtas: {
		position: "absolute",
		top: 4,
		left: 4,
		width: 14,
		height: 14,
		borderTopWidth: 2,
		borderLeftWidth: 2,
		borderColor: warnaCetak.gold,
	},
	sudutKananAtas: {
		position: "absolute",
		top: 4,
		right: 4,
		width: 14,
		height: 14,
		borderTopWidth: 2,
		borderRightWidth: 2,
		borderColor: warnaCetak.gold,
	},
	sudutKiriBawah: {
		position: "absolute",
		bottom: 4,
		left: 4,
		width: 14,
		height: 14,
		borderBottomWidth: 2,
		borderLeftWidth: 2,
		borderColor: warnaCetak.gold,
	},
	sudutKananBawah: {
		position: "absolute",
		bottom: 4,
		right: 4,
		width: 14,
		height: 14,
		borderBottomWidth: 2,
		borderRightWidth: 2,
		borderColor: warnaCetak.gold,
	},

	// Header Institusi
	kepala: {
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: warnaCetak.goldSoft,
		paddingBottom: 8,
		marginBottom: 4,
	},
	barisLogo: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		marginBottom: 2,
	},
	bintang: {
		fontSize: 9,
		color: warnaCetak.gold,
		marginHorizontal: 3,
	},
	namaInstitusi: {
		fontSize: 13,
		fontWeight: 700,
		color: warnaCetak.brown,
		letterSpacing: 2,
		textTransform: "uppercase",
	},
	subInstitusi: {
		fontSize: 8,
		color: warnaCetak.gray,
		letterSpacing: 1,
		textTransform: "uppercase",
		marginTop: 1,
	},

	// Judul Utama
	areaJudul: {
		alignItems: "center",
		marginTop: 4,
	},
	judulSertifikat: {
		fontSize: 21,
		fontWeight: 700,
		color: warnaCetak.ink,
		letterSpacing: 3,
		textTransform: "uppercase",
		textAlign: "center",
	},
	subjudulInggris: {
		fontSize: 8.5,
		fontFamily: "Helvetica-Oblique",
		color: warnaCetak.brown,
		letterSpacing: 1.5,
		textTransform: "uppercase",
		marginTop: 2,
	},
	pillNomor: {
		marginTop: 5,
		paddingVertical: 2.5,
		paddingHorizontal: 12,
		backgroundColor: warnaCetak.ivoryWarm,
		borderWidth: 1,
		borderColor: warnaCetak.goldSoft,
		borderRadius: 10,
	},
	teksNomor: {
		fontSize: 8,
		fontWeight: 700,
		color: warnaCetak.brown,
		fontFamily: "Courier",
	},

	// Penerima
	areaPenerima: {
		alignItems: "center",
		marginTop: 6,
	},
	diberikanKepada: {
		fontSize: 8.5,
		color: warnaCetak.grayMid,
		fontFamily: "Helvetica-Oblique",
	},
	namaPeserta: {
		fontSize: 22,
		fontWeight: 700,
		color: warnaCetak.ink,
		letterSpacing: 1,
		textAlign: "center",
		marginTop: 4,
	},
	garisNamaPembagi: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: 320,
		marginTop: 3,
	},
	garisEmas: {
		flex: 1,
		height: 1,
		backgroundColor: warnaCetak.gold,
	},
	ornamenPusat: {
		fontSize: 8,
		color: warnaCetak.gold,
		marginHorizontal: 8,
	},

	// Narasi & Kelas
	areaNarasi: {
		alignItems: "center",
		marginTop: 5,
		paddingHorizontal: 30,
	},
	teksNarasi: {
		fontSize: 8.5,
		color: warnaCetak.inkSoft,
		textAlign: "center",
		lineHeight: 1.4,
	},
	kotakKelas: {
		marginTop: 4,
		marginBottom: 4,
		backgroundColor: warnaCetak.ivoryWarm,
		borderWidth: 1,
		borderColor: warnaCetak.ivoryBorder,
		borderRadius: 5,
		paddingVertical: 4,
		paddingHorizontal: 18,
	},
	namaKelas: {
		fontSize: 13,
		fontWeight: 700,
		color: warnaCetak.brown,
		textAlign: "center",
		letterSpacing: 0.5,
	},
	teksWaktuTempat: {
		fontSize: 8,
		color: warnaCetak.grayMid,
		textAlign: "center",
	},

	// Bagian Bawah / Tanda Tangan & QR
	kaki: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginTop: 8,
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderTopColor: warnaCetak.ivoryRule,
		paddingTop: 8,
	},
	blokQr: {
		alignItems: "center",
		width: 140,
	},
	bingkaiQr: {
		padding: 2,
		backgroundColor: warnaCetak.paper,
		borderWidth: 1,
		borderColor: warnaCetak.ivoryBorder,
		borderRadius: 4,
		marginBottom: 3,
	},
	qr: {
		width: 60,
		height: 60,
	},
	teksQrPetunjuk: {
		fontSize: 6.5,
		fontWeight: 700,
		color: warnaCetak.brown,
		textAlign: "center",
	},
	teksQrUrl: {
		fontSize: 5.5,
		color: warnaCetak.grayLight,
		textAlign: "center",
		marginTop: 1,
	},

	// Segel Resmi Tengah
	blokSegel: {
		alignItems: "center",
		justifyContent: "center",
		width: 120,
	},
	lingkaranSegelLuar: {
		width: 54,
		height: 54,
		borderRadius: 27,
		borderWidth: 1.5,
		borderColor: warnaCetak.gold,
		padding: 2,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: warnaCetak.ivoryWarm,
	},
	lingkaranSegelDalam: {
		width: 46,
		height: 46,
		borderRadius: 23,
		borderWidth: 1,
		borderColor: warnaCetak.gold,
		borderStyle: "dashed",
		alignItems: "center",
		justifyContent: "center",
	},
	teksSegelBintang: {
		fontSize: 7,
		color: warnaCetak.brown,
	},
	teksSegelPusat: {
		fontSize: 5.5,
		fontWeight: 700,
		color: warnaCetak.brown,
		textAlign: "center",
		letterSpacing: 0.5,
	},

	// Tanda Tangan Kanan
	blokTtd: {
		alignItems: "center",
		width: 170,
	},
	teksTanggalTerbit: {
		fontSize: 8,
		color: warnaCetak.gray,
		marginBottom: 26,
	},
	garisTtd: {
		borderBottomWidth: 1,
		borderBottomColor: warnaCetak.ink,
		width: "100%",
		marginBottom: 3,
	},
	namaPenandatangan: {
		fontSize: 9.5,
		fontWeight: 700,
		color: warnaCetak.ink,
		textAlign: "center",
	},
	jabatanPenandatangan: {
		fontSize: 7.5,
		color: warnaCetak.grayMid,
		textAlign: "center",
		marginTop: 1,
	},

	// Catatan Kaki Keamanan
	catatanKeamanan: {
		fontSize: 6,
		color: warnaCetak.grayLight,
		textAlign: "center",
		marginTop: 4,
	},
})

export function DokumenSertifikat({
	data,
	qrDataUrl,
}: {
	data: DataSertifikat
	qrDataUrl: string
}) {
	return (
		<Document
			title={`Sertifikat ${data.nomor} — ${data.namaPeserta}`}
			author={identitasTampilan.nama}
			language="id"
		>
			<Page size="A4" orientation="landscape" style={gaya.halaman}>
				<View style={gaya.bingkaiLuar}>
					<View style={gaya.bingkaiDalam}>
						{/* Sudut Hiasan Emas */}
						<View style={gaya.sudutKiriAtas} />
						<View style={gaya.sudutKananAtas} />
						<View style={gaya.sudutKiriBawah} />
						<View style={gaya.sudutKananBawah} />

						{/* Header Institusi */}
						<View style={gaya.kepala}>
							<View style={gaya.barisLogo}>
								<Text style={gaya.bintang}>★</Text>
								<Text style={gaya.namaInstitusi}>{identitasTampilan.nama}</Text>
								<Text style={gaya.bintang}>★</Text>
							</View>
							<Text style={gaya.subInstitusi}>
								Lembaga Kursus Pelatihan Kuliner &amp; Tata Boga Profesional
							</Text>
						</View>

						{/* Area Judul Sertifikat */}
						<View style={gaya.areaJudul}>
							<Text style={gaya.judulSertifikat}>SERTIFIKAT KOMPETENSI</Text>
							<Text style={gaya.subjudulInggris}>
								Certificate of Completion &amp; Culinary Competency
							</Text>
							<View style={gaya.pillNomor}>
								<Text style={gaya.teksNomor}>No. Registrasi: {data.nomor}</Text>
							</View>
						</View>

						{/* Area Penerima */}
						<View style={gaya.areaPenerima}>
							<Text style={gaya.diberikanKepada}>Dengan bangga diberikan kepada:</Text>
							<Text style={gaya.namaPeserta}>{data.namaPeserta}</Text>
							<View style={gaya.garisNamaPembagi}>
								<View style={gaya.garisEmas} />
								<Text style={gaya.ornamenPusat}>✦  ★  ✦</Text>
								<View style={gaya.garisEmas} />
							</View>
						</View>

						{/* Area Narasi & Kelas */}
						<View style={gaya.areaNarasi}>
							<Text style={gaya.teksNarasi}>
								Telah menyelesaikan seluruh modul pelatihan praktik intensif dan dinyatakan KOMPETEN pada program kursus:
							</Text>
							<View style={gaya.kotakKelas}>
								<Text style={gaya.namaKelas}>{data.judulKelas}</Text>
							</View>
							<Text style={gaya.teksWaktuTempat}>
								Diselenggarakan di {data.lokasiKelas} pada tanggal {formatTanggal(data.tanggalKelas)}
							</Text>
						</View>

						{/* Bagian Bawah: QR Verifikasi, Segel Emas, dan Tanda Tangan */}
						<View style={gaya.kaki}>
							{/* Kolom QR Code */}
							<View style={gaya.blokQr}>
								<View style={gaya.bingkaiQr}>
									<Image style={gaya.qr} src={qrDataUrl} />
								</View>
								<Text style={gaya.teksQrPetunjuk}>PINDAI UNTUK VERIFIKASI</Text>
								<Text style={gaya.teksQrUrl}>{data.urlVerifikasi}</Text>
							</View>

							{/* Kolom Segel Resmi Tengah */}
							<View style={gaya.blokSegel}>
								<View style={gaya.lingkaranSegelLuar}>
									<View style={gaya.lingkaranSegelDalam}>
										<Text style={gaya.teksSegelBintang}>★ ★ ★</Text>
										<Text style={gaya.teksSegelPusat}>RESMI &amp; TERDAFTAR</Text>
										<Text style={gaya.teksSegelBintang}>RUMAH MAMA PINTAR</Text>
									</View>
								</View>
							</View>

							{/* Kolom Tanda Tangan */}
							<View style={gaya.blokTtd}>
								<Text style={gaya.teksTanggalTerbit}>
									Bandar Lampung, {formatTanggal(data.diterbitkanPada)}
								</Text>
								<View style={gaya.garisTtd} />
								<Text style={gaya.namaPenandatangan}>{data.penandatangan}</Text>
								<Text style={gaya.jabatanPenandatangan}>{data.jabatanPenandatangan}</Text>
							</View>
						</View>

						{/* Catatan Keamanan Bawah */}
						<Text style={gaya.catatanKeamanan}>
							Dokumen resmi terverifikasi secara kriptografis oleh sistem Rumah Mama Pintar. Keabsahan dapat dicek langsung melalui portal verifikasi publik.
						</Text>
					</View>
				</View>
			</Page>
		</Document>
	)
}

/** Menghasilkan berkas PDF sertifikat beserta QR verifikasi. */
export async function buatPdfSertifikat(data: DataSertifikat): Promise<Buffer> {
	const qrDataUrl = await QRCode.toDataURL(data.urlVerifikasi, {
		width: 320,
		margin: 1,
		color: {
			dark: warnaCetak.ink,
			light: warnaCetak.paper,
		},
	})
	return renderToBuffer(<DokumenSertifikat data={data} qrDataUrl={qrDataUrl} />)
}

export function namaBerkasSertifikat(nomor: string): string {
	return `sertifikat-${nomor.replace(/[^A-Za-z0-9]+/g, "-").toLowerCase()}.pdf`
}

