import { z } from "zod"

/**
 * Validasi environment sisi server. Rahasia hanya dibaca dari environment
 * variable dan tidak pernah dikirim ke klien.
 */
const skemaEnv = z.object({
	DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
	AUTH_SECRET: z.string().min(16, "AUTH_SECRET minimal 16 karakter"),
	APP_URL: z.string().url("APP_URL harus berupa URL yang valid"),
	PAKASIR_MODE: z.enum(["sandbox", "produksi"]).default("sandbox"),
	PAKASIR_SLUG: z.string().default(""),
	PAKASIR_API_KEY: z.string().default(""),
	PAKASIR_BASE_URL: z.string().url().default("https://app.pakasir.com"),
	PAKASIR_WEBHOOK_SECRET: z.string().default(""),
	SERTIFIKAT_PENANDATANGAN: z
		.string()
		.default("[PLACEHOLDER: Nama Pemilik RMP]"),
	SERTIFIKAT_JABATAN_PENANDATANGAN: z
		.string()
		.default("Pemilik RMP - Pelatihan Bisnis Kuliner"),
})

export type Konfigurasi = z.infer<typeof skemaEnv>

let cache: Konfigurasi | null = null

export function konfigurasi(): Konfigurasi {
	if (cache) return cache

	const hasil = skemaEnv.safeParse(process.env)
	if (!hasil.success) {
		const daftar = hasil.error.issues
			.map((i) => `${i.path.join(".")}: ${i.message}`)
			.join("; ")
		throw new Error(`Konfigurasi environment tidak valid. ${daftar}`)
	}

	const env = hasil.data
	if (env.PAKASIR_MODE === "produksi") {
		if (!env.PAKASIR_SLUG || !env.PAKASIR_API_KEY) {
			throw new Error(
				"Mode Pakasir produksi membutuhkan PAKASIR_SLUG dan PAKASIR_API_KEY.",
			)
		}
		if (!env.PAKASIR_WEBHOOK_SECRET) {
			throw new Error(
				"Mode Pakasir produksi membutuhkan PAKASIR_WEBHOOK_SECRET sebagai rahasia bersama webhook.",
			)
		}
	}

	cache = env
	return cache
}

/** Hanya untuk pengujian: mengosongkan cache konfigurasi. */
export function resetKonfigurasiUntukUji(): void {
	cache = null
}
