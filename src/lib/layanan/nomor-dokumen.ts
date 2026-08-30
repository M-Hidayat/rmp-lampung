import { randomInt } from "node:crypto"

/**
 * Pembentukan nomor dokumen. Fungsi murni sehingga mudah diuji.
 * Format invoice   : INV/RMP/YYYYMM/XXXXXX
 * Format sertifikat: SRT/RMP/YYYY/XXXXXX
 */

function acakEnamKarakter(): string {
	const huruf = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	let hasil = ""
	for (let i = 0; i < 6; i += 1) {
		hasil += huruf[randomInt(0, huruf.length)]
	}
	return hasil
}

function duaDigit(nilai: number): string {
	return String(nilai).padStart(2, "0")
}

export function bentukNomorInvoice(
	tanggal: Date,
	segmenAcak: string = acakEnamKarakter(),
): string {
	const tahun = tanggal.getUTCFullYear()
	const bulan = duaDigit(tanggal.getUTCMonth() + 1)
	return `INV/RMP/${tahun}${bulan}/${segmenAcak}`
}

export function bentukNomorSertifikat(
	tanggal: Date,
	segmenAcak: string = acakEnamKarakter(),
): string {
	return `SRT/RMP/${tanggal.getUTCFullYear()}/${segmenAcak}`
}

/** order_id Pakasir: pendek, unik, dan aman untuk URL. */
export function bentukOrderIdPakasir(
	tanggal: Date,
	segmenAcak: string = acakEnamKarakter(),
): string {
	const tahun = String(tanggal.getUTCFullYear()).slice(2)
	const bulan = duaDigit(tanggal.getUTCMonth() + 1)
	const hari = duaDigit(tanggal.getUTCDate())
	return `RMP${tahun}${bulan}${hari}${segmenAcak}`
}
