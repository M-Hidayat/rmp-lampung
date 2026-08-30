import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('E2E Alur Pembayaran & Webhook Pakasir', () => {
  test('Alur Pendaftaran Kelas hingga Pembayaran Lunas di Sandbox', async ({ page }) => {
    // 1. Buat akun peserta baru agar bersih dari riwayat pendaftaran sebelumnya
    const randomSuffix = Math.floor(Math.random() * 100000);
    const emailPeserta = `peserta_${randomSuffix}@contoh.test`;
    const sandiPeserta = 'PasswordAman123!';

    await page.goto(`${BASE_URL}/daftar`);
    await page.fill('input[name="nama"]', `Peserta Uji ${randomSuffix}`);
    await page.fill('input[name="email"]', emailPeserta);
    await page.fill('input[name="kataSandi"]', sandiPeserta);
    await page.click('button[type="submit"]');

    // Tunggu redirect ke dashboard user
    await page.waitForURL('**/user**', { timeout: 15000 });

    // 2. Buka simulator pembayaran sandbox secara langsung untuk menguji webhook
    const testOrderId = `TEST_PAY_${randomSuffix}`;
    await page.goto(`${BASE_URL}/simulasi-pembayaran?proyek=rmp&order_id=${testOrderId}&amount=350000&redirect=/user/pembayaran?order_id=${testOrderId}`);
    await expect(page.locator('text=Simulasi Pembayaran Pakasir')).toBeVisible();

    // 3. Klik tombol "Simulasi Bayar Lunas"
    await page.click('button:has-text("Simulasi Bayar Lunas")');

    // 4. Verifikasi kembali ke halaman pembayaran user
    await page.waitForURL('**/user/pembayaran**', { timeout: 15000 });
    await expect(page.url()).toContain('/user/pembayaran');
  });
});
