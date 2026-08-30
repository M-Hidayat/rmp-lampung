import { createHash, randomBytes, timingSafeEqual } from "node:crypto"

/**
 * Token QR absensi.
 * - Nilai acak kuat (32 byte) berbentuk base64url.
 * - Hanya hash SHA-256 yang disimpan pada basis data.
 * - Masa berlaku singkat dan dapat diperbarui tanpa mengubah aturan
 *   satu kehadiran per enrollment.
 */

export const MASA_BERLAKU_TOKEN_MENIT_DEFAULT = 10
export const MASA_BERLAKU_TOKEN_DETIK_DINAMIS = 35 // 30 detik rotasi + 5 detik toleransi
export const GRACE_PERIOD_DETIK = 15 // toleransi scan bila admin baru saja ganti token

export function buatTokenAbsensi(): string {
	return randomBytes(32).toString("base64url")
}

export function hashTokenAbsensi(token: string): string {
	return createHash("sha256").update(token, "utf8").digest("hex")
}

export function tokenCocok(token: string, hashTersimpan: string): boolean {
	const a = Buffer.from(hashTokenAbsensi(token), "hex")
	const b = Buffer.from(hashTersimpan, "hex")
	if (a.length !== b.length) return false
	return timingSafeEqual(a, b)
}

export function hitungKedaluwarsa(
	sekarang: Date,
	masaBerlakuMenit: number = MASA_BERLAKU_TOKEN_MENIT_DEFAULT,
): Date {
	return new Date(sekarang.getTime() + masaBerlakuMenit * 60_000)
}

export function hitungKedaluwarsaDetik(
	sekarang: Date,
	masaBerlakuDetik: number = MASA_BERLAKU_TOKEN_DETIK_DINAMIS,
): Date {
	return new Date(sekarang.getTime() + masaBerlakuDetik * 1000)
}

export function tokenMasihBerlaku(
	kedaluwarsaPada: Date,
	sekarang: Date = new Date(),
	toleransiDetik: number = 0,
): boolean {
	return (kedaluwarsaPada.getTime() + toleransiDetik * 1000) > sekarang.getTime()
}

/** URL yang ditanam pada QR absensi. */
export function urlScanAbsensi(appUrl: string, token: string): string {
	const url = new URL("/user/absensi", appUrl)
	url.searchParams.set("token", token)
	return url.toString()
}

/** URL verifikasi publik yang ditanam pada QR sertifikat. */
export function urlVerifikasiSertifikat(
	appUrl: string,
	nomor: string,
): string {
	return new URL(
		`/verifikasi/${encodeURIComponent(nomor)}`,
		appUrl,
	).toString()
}
