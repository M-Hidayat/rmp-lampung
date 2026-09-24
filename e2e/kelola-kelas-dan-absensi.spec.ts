import { expect, test, type Page } from "@playwright/test"
import path from "node:path"
import dotenv from "dotenv"

/**
 * Verifikasi perilaku runtime untuk dua fitur yang belum diuji otomatis:
 *  - Kelola Kelas admin sebagai pusat kerja (daftar + route /baru dan /[id]/ubah)
 *  - Absensi satu sesi permanen per kelas (QR statis, tanpa countdown/rotasi)
 *
 * Kredensial admin dibaca dari .env lokal (INITIAL_ADMIN_*), bukan di-hardcode.
 */

const konfigurasi = dotenv.config({ path: path.join(process.cwd(), ".env") }).parsed ?? {}

function bacaEnv(kunci: string): string {
	const nilai = konfigurasi[kunci]
	if (!nilai) throw new Error(`Kunci ${kunci} tidak ditemukan di .env`)
	return nilai
}

const EMAIL_ADMIN = bacaEnv("INITIAL_ADMIN_EMAIL")
const SANDI_ADMIN = bacaEnv("INITIAL_ADMIN_PASSWORD")

async function masukSebagaiAdmin(page: Page) {
	await page.goto("/masuk")
	await page.getByLabel("Email").fill(EMAIL_ADMIN)
	await page.getByLabel("Kata sandi").fill(SANDI_ADMIN)
	await page.getByRole("button", { name: /^Masuk$/ }).click()
	await expect(page).toHaveURL(/\/admin$/, { timeout: 30000 })
}

test.describe("Kelola Kelas admin: daftar sebagai pusat kerja", () => {
	test.beforeEach(async ({ page }) => {
		await masukSebagaiAdmin(page)
		await page.goto("/admin/kelas")
	})

	test("daftar menampilkan ringkasan, CTA tambah, dan tidak ada form inline", async ({ page }) => {
		await expect(page.getByRole("heading", { level: 1, name: "Kelola kelas" })).toBeVisible()

		// CTA menuju halaman tambah khusus
		await expect(page.getByRole("link", { name: "Tambah Kelas" })).toHaveAttribute("href", "/admin/kelas/baru")

		// Empat kartu ringkasan operasional
		for (const label of ["Total kelas", "Aktif", "Nonaktif", "Peserta menggunakan kuota"]) {
			await expect(page.getByRole("paragraph").filter({ hasText: new RegExp(`^${label}$`) })).toBeVisible()
		}

		// Regresi utama: formulir kelas tidak boleh lagi dirender inline di halaman daftar
		await expect(page.getByLabel("Judul kelas")).toHaveCount(0)
		await expect(page.locator('select[name="classId"]')).toHaveCount(0)
	})

	test("setiap baris kelas punya aksi Edit menuju route /ubah dan tombol status", async ({ page }) => {
		const tautanEdit = page.getByRole("link", { name: "Edit" })
		const jumlahKelas = await tautanEdit.count()
		expect(jumlahKelas).toBeGreaterThan(0)

		const href = await tautanEdit.first().getAttribute("href")
		expect(href).toMatch(/^\/admin\/kelas\/[^/]+\/ubah$/)

		// Tindakan status tetap tersedia (Aktifkan / Nonaktifkan)
		await expect(page.getByRole("button", { name: /^(Nonaktifkan|Aktifkan)$/ }).first()).toBeVisible()
	})

	test("halaman tambah kelas khusus dapat dibuka dan punya tombol batal", async ({ page }) => {
		await page.getByRole("link", { name: "Tambah Kelas", exact: true }).click()
		// Mode dev mengompilasi route ini saat pertama kali diminta; beri ruang
		// agar kegagalan di sini benar-benar berarti navigasi rusak, bukan compile.
		await expect(page).toHaveURL(/\/admin\/kelas\/baru$/, { timeout: 30000 })
		await expect(page.getByLabel("Judul kelas")).toBeVisible()
		await expect(page.getByRole("link", { name: "Batal" })).toHaveAttribute("href", "/admin/kelas")
	})

	test("halaman edit memuat data kelas dan menolak id yang tidak ada dengan 404", async ({ page }) => {
		const href = await page.getByRole("link", { name: "Edit" }).first().getAttribute("href")
		await page.goto(href!)
		await expect(page).toHaveURL(/\/admin\/kelas\/[^/]+\/ubah$/)

		const judul = page.getByLabel("Judul kelas")
		await expect(judul).toBeVisible()
		await expect(judul).not.toHaveValue("")

		// Id yang tidak ada harus berakhir di halaman 404, bukan error server atau form kosong.
		// Catatan: pada mode dev Next.js men-stream shell lebih dulu sehingga kode HTTP bisa 200;
		// yang diuji di sini adalah hasil render akhir yang dilihat pengguna.
		await page.goto("/admin/kelas/tidak-ada-id-ini/ubah", { waitUntil: "networkidle" })
		await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible()
		await expect(page.getByLabel("Judul kelas")).toHaveCount(0)
	})
})

test.describe("Absensi: satu sesi permanen per kelas", () => {
	test.beforeEach(async ({ page }) => {
		await masukSebagaiAdmin(page)
		await page.goto("/admin/absensi")
	})

	test("UI tidak lagi menampilkan countdown, rotasi, atau input masa berlaku", async ({ page }) => {
		await expect(page.getByRole("heading", { level: 1, name: "Sesi absensi" })).toBeVisible()

		// Regresi fitur lama: timer/rotasi & field durasi harus hilang
		await expect(page.getByText(/Auto-?Refresh/i)).toHaveCount(0)
		await expect(page.getByText(/Masa berlaku token/i)).toHaveCount(0)
		await expect(page.locator('input[name="masaBerlakuMenit"]')).toHaveCount(0)
		await expect(page.getByRole("button", { name: /Buka Sesi Absensi/i })).toHaveCount(0)

		// Label kolom baru
		await expect(page.getByText("Masa berlaku", { exact: true })).toBeVisible()
	})

	test("kelas yang sudah punya sesi tampil disabled dan tidak dapat dipilih ulang", async ({ page }) => {
		const pilihan = page.locator('select[name="classId"] option')
		const jumlah = await pilihan.count()

		if (jumlah <= 1) {
			// Semua kelas sudah punya sesi: form harus menonaktifkan submit
			await expect(page.getByText(/Semua kelas sudah pernah memiliki sesi/i)).toBeVisible()
			await expect(page.getByRole("button", { name: /Buka sesi & tampilkan QR/i })).toBeDisabled()
			return
		}

		// Ada kelas terpakai → opsinya disabled dan berlabel penjelas.
		// Opsi pertama adalah placeholder ("Pilih kelas…") yang juga disabled,
		// jadi pencocokan dilakukan lewat teks label, bukan sekadar atribut disabled.
		const opsiKelasTerpakai = page.locator('select[name="classId"] option[disabled]', {
			hasText: "sesi sudah pernah dibuat",
		})
		expect(await opsiKelasTerpakai.count()).toBeGreaterThan(0)

		// Kelas yang belum punya sesi tetap dapat dipilih (tidak disabled)
		const opsiTersedia = page.locator('select[name="classId"] option:not([disabled])')
		expect(await opsiTersedia.count()).toBeGreaterThan(0)
	})

	test("sesi aktif menampilkan Ganti QR, Tutup sesi, dan tanpa batas waktu", async ({ page }) => {
		// Kelas "tekwan" memiliki satu sesi aktif pada data uji
		const barisAktif = page.locator("tr", { hasText: /Tekwan|tekwan/ }).first()
		await expect(barisAktif).toBeVisible()
		await expect(barisAktif.getByText("Aktif tanpa batas waktu")).toBeVisible()
		await expect(barisAktif.getByRole("button", { name: "Ganti QR" })).toBeVisible()
		await expect(barisAktif.getByRole("button", { name: "Tutup sesi" })).toBeVisible()

		// Sesi tertutup ditandai permanen, tanpa tindakan apa pun
		const barisTertutup = page.locator("tr", { hasText: /Mi ayam|mie-tek-tek/i }).first()
		await expect(barisTertutup.getByText("Ditutup permanen").first()).toBeVisible()
		await expect(barisTertutup.getByRole("button", { name: "Ganti QR" })).toHaveCount(0)
	})
})

test.describe("Responsivitas halaman admin", () => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		test(`tidak ada overflow horizontal pada ${viewport.width}x${viewport.height}`, async ({ page }) => {
			await page.setViewportSize(viewport)
			await masukSebagaiAdmin(page)

			for (const rute of ["/admin/kelas", "/admin/kelas/baru", "/admin/absensi"]) {
				await page.goto(rute)
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth > document.documentElement.clientWidth,
				)
				expect(overflow, `overflow horizontal pada ${rute} @ ${viewport.width}px`).toBe(false)
			}
		})
	}
})