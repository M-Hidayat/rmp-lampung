import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('E2E Pemisahan Otoritas & Hak Akses (RBAC)', () => {
  test('1. Pengguna Anonim (Belum Login) Terlindungi dari Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/user`);
    await expect(page.url()).toContain('/masuk');

    await page.goto(`${BASE_URL}/admin`);
    await expect(page.url()).toContain('/masuk');

    await page.goto(`${BASE_URL}/pemilik`);
    await expect(page.url()).toContain('/masuk');
  });

  test('2. Peserta (USER) Terisolasi & Ditolak Akses /admin dan /pemilik', async ({ page }) => {
    await page.goto(`${BASE_URL}/masuk`);
    await page.fill('input[name="email"]', 'peserta@contoh.rmp-lampung.test');
    await page.fill('input[name="kataSandi"]', 'PesertaContoh123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/user**', { timeout: 15000 });

    // Peserta coba tembak /admin -> otomatis di-redirect balik ke /user
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForURL('**/user**', { timeout: 15000 });
    await expect(page.url()).toContain('/user');

    // Peserta coba tembak /pemilik -> otomatis di-redirect balik ke /user
    await page.goto(`${BASE_URL}/pemilik`);
    await page.waitForURL('**/user**', { timeout: 15000 });
    await expect(page.url()).toContain('/user');
  });

  test('3. Admin Terisolasi & Ditolak Akses /pemilik', async ({ page }) => {
    await page.goto(`${BASE_URL}/masuk`);
    await page.fill('input[name="email"]', 'admin@contoh.rmp-lampung.test');
    await page.fill('input[name="kataSandi"]', 'AdminContoh123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 15000 });

    // Admin coba tembak /pemilik -> otomatis di-redirect balik ke /admin
    await page.goto(`${BASE_URL}/pemilik`);
    await page.waitForURL('**/admin**', { timeout: 15000 });
    await expect(page.url()).toContain('/admin');
  });

  test('4. Pemilik Memiliki Akses Penuh (/pemilik & /admin)', async ({ page }) => {
    await page.goto(`${BASE_URL}/masuk`);
    await page.fill('input[name="email"]', 'pemilik@contoh.rmp-lampung.test');
    await page.fill('input[name="kataSandi"]', 'PemilikContoh123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pemilik**', { timeout: 15000 });
    await expect(page.url()).toContain('/pemilik');

    // Pemilik buka /admin -> diizinkan
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.url()).toContain('/admin');
  });
});
