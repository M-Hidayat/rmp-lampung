import { createHash, randomBytes } from "node:crypto"

/**
 * Token QR absensi.
 * - Nilai acak kuat (32 byte) berbentuk base64url.
 * - Hanya hash SHA-256 yang disimpan pada basis data.
 * - Tanpa masa berlaku: sesi absensi bersifat permanen sampai ditutup, dan
 *   mengganti QR hanya memperbarui hash pada sesi aktif yang sama.
 *   Validasi scan dilakukan lewat pencarian `tokenHash`, bukan perbandingan waktu.
 */

export function buatTokenAbsensi(): string {
	return randomBytes(32).toString("base64url")
}

export function hashTokenAbsensi(token: string): string {
	return createHash("sha256").update(token, "utf8").digest("hex")
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
