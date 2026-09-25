import { createHash, randomBytes } from "node:crypto"

/**
 * Token atur ulang kata sandi.
 *
 * Sama seperti token absensi: nilai acak kuat 32 byte berbentuk base64url, dan
 * hanya hash SHA-256 yang disimpan di basis data. Token mentah tidak pernah
 * masuk database maupun log.
 */

/** Masa berlaku tautan atur ulang. Cukup longgar untuk membuka email, cukup ketat untuk keamanan. */
export const MASA_BERLAKU_ATUR_ULANG_MS = 60 * 60 * 1000

export function buatTokenAturUlang(): string {
	return randomBytes(32).toString("base64url")
}

export function hashTokenAturUlang(token: string): string {
	return createHash("sha256").update(token, "utf8").digest("hex")
}

/** Tautan yang dikirim ke email pengguna. */
export function urlAturUlangSandi(appUrl: string, token: string): string {
	return new URL(
		`/atur-ulang-sandi/${encodeURIComponent(token)}`,
		appUrl,
	).toString()
}
