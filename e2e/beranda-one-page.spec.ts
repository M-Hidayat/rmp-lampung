import { expect, test } from "@playwright/test"

const sectionIds = ["beranda", "program", "cara-daftar"]
const whatsappUrl = "https://api.whatsapp.com/send?phone=628117970171"

test("beranda menampilkan struktur one-page dan CTA utama", async ({ page }) => {
	await page.goto("/")

	const main = page.locator("main")
	await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1)
	for (const id of sectionIds) {
		const section = main.locator(`section#${id}`)
		await expect(section).toBeVisible()
	}
	await expect(main.getByRole("link", { name: "Lihat semua kelas" })).toHaveAttribute("href", "/kelas")

	// Tombol "Konsultasi via WhatsApp" di hero DIHAPUS atas permintaan pemilik
	// (hero kini hanya memuat satu aksi utama: "Lihat Program Kelas"). Jalur
	// WhatsApp tetap tersedia di bagian CTA bawah, jadi yang diuji kini itu.
	await expect(main.getByRole("link", { name: "Lihat Program Kelas" })).toHaveAttribute("href", "#program")
	const whatsappHref = await main.getByRole("link", { name: "Hubungi Kami" }).getAttribute("href")
	expect(whatsappHref?.startsWith(whatsappUrl)).toBe(true)
})

test("navigasi desktop menuju anchor Program dari katalog", async ({ page }) => {
	await page.goto("/kelas")

	await page.getByRole("navigation", { name: "Navigasi utama desktop" }).getByRole("link", { name: "Program", exact: true }).click()

	await expect(page).toHaveURL(/\/#program$/)
	await expect(page.locator("main section#program")).toBeVisible()
})

test("menu mobile menutup setelah memilih Program dan halaman tidak overflow", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto("/")

	const tombolMenu = page.getByRole("button", { name: /^(Buka|Tutup) menu$/ })
	await tombolMenu.click()
	await expect(tombolMenu).toHaveAttribute("aria-expanded", "true")

	const navigasiMobile = page.getByRole("navigation", { name: "Navigasi utama mobile" })
	await expect(navigasiMobile.getByRole("link", { name: "Masuk", exact: true })).toBeVisible()
	await navigasiMobile.getByRole("link", { name: "Program", exact: true }).click()

	await expect(tombolMenu).toHaveAttribute("aria-expanded", "false")
	await expect(page).toHaveURL(/\/#program$/)
	await expect(page.locator("main section#program")).toBeInViewport()
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})
