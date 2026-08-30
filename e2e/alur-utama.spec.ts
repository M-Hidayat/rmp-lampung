import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('RMP Lampung End-to-End Test Suite', () => {
  test('1. Pengujian Halaman Publik & Konten Identitas', async ({ page }) => {
    // Beranda
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveTitle(/RMP/);
    await expect(page.locator('h1').first()).toContainText('Kursus kuliner');

    // Profil RMP & Sumber Data
    await page.goto(`${BASE_URL}/profil`);
    await expect(page.locator('h1').first()).toContainText('Profil RMP');
    await expect(page.locator('#konten-utama').getByText('Jl. Kapten Abdul Haq No. 03').first()).toBeVisible();

    // Cara Pendaftaran
    await page.goto(`${BASE_URL}/cara-pendaftaran`);
    await expect(page.locator('h1').first()).toContainText('Cara pendaftaran');

    // Kontak
    await page.goto(`${BASE_URL}/kontak`);
    await expect(page.locator('h1').first()).toContainText('Kontak');
    await expect(page.locator('#konten-utama').getByText('didikkominfolpg@gmail.com').first()).toBeVisible();

    // Verifikasi Dokumen
    await page.goto(`${BASE_URL}/verifikasi`);
    await expect(page.locator('h1').first()).toContainText('Verifikasi sertifikat');
  });

  test('2. Autentikasi & Navigasi Dashboard Peserta', async ({ page }) => {
    await page.goto(`${BASE_URL}/masuk`);
    await page.fill('input[name="email"]', 'peserta@contoh.rmp-lampung.test');
    await page.fill('input[name="kataSandi"]', 'PesertaContoh123!');
    await page.click('button[type="submit"]');

    // Redirect ke dashboard user
    await page.waitForURL('**/user**', { timeout: 15000 });
    await expect(page.url()).toContain('/user');

    // Cek menu user (Kelas Saya, Absensi)
    await page.goto(`${BASE_URL}/user/kelas-saya`);
    await expect(page.locator('h1').first()).toContainText('Kelas saya');

    await page.goto(`${BASE_URL}/user/absensi`);
    await expect(page.locator('h1').first()).toContainText('Absensi');
  });

  test('3. Autentikasi & Manajemen Admin Operasional', async ({ page }) => {
    await page.goto(`${BASE_URL}/masuk`);
    await page.fill('input[name="email"]', 'admin@contoh.rmp-lampung.test');
    await page.fill('input[name="kataSandi"]', 'AdminContoh123!');
    await page.click('button[type="submit"]');

    // Redirect ke dashboard admin
    await page.waitForURL('**/admin**', { timeout: 15000 });
    await expect(page.url()).toContain('/admin');

    // Buka panel absensi & QR
    await page.goto(`${BASE_URL}/admin/absensi`);
    await page.selectOption('select[name="classId"]', { index: 1 });
    await page.click('button:has-text("Buka Sesi & Tampilkan Dynamic QR")');
    // Buka panel kelas
    await page.goto(`${BASE_URL}/admin/kelas`);
    await expect(page.locator('h1').first()).toContainText('Kelola kelas');
  });

  test('4. Flow Pembayaran Sandbox & Webhook Integration', async ({ page }) => {
    const testOrderId = `TEST_${Date.now()}`;
    await page.goto(`${BASE_URL}/simulasi-pembayaran?order_id=${testOrderId}&amount=450000&redirect=/user/kelas-saya`);
    await expect(page.locator('text=Simulasi Pembayaran Pakasir')).toBeVisible();
    await expect(page.locator(`text=${testOrderId}`)).toBeVisible();
    
    // Klik simulasi bayar sukses
    await page.click('button:has-text("Simulasi Bayar Lunas")');
    await page.waitForURL('**/user/kelas-saya**', { timeout: 15000 });
    await expect(page.url()).toContain('/user/kelas-saya');
  });
});
