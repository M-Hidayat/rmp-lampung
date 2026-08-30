/**
 * Nilai environment minimum agar modul konfigurasi dapat dimuat saat pengujian.
 * Tidak ada rahasia produksi di sini.
 */
process.env.AUTH_SECRET ??= "rahasia-pengujian-minimal-32-karakter-aman"
process.env.APP_URL ??= "http://localhost:3000"
process.env.PAKASIR_MODE ??= "sandbox"
process.env.PAKASIR_BASE_URL ??= "https://app.pakasir.com"
process.env.PAKASIR_SLUG ??= "rmp-sandbox"
process.env.PAKASIR_API_KEY ??= "kunci-sandbox"
process.env.DATABASE_URL ??=
	"postgresql://rmp:rmp_dev_password@localhost:5432/rmp_lampung?schema=public"
