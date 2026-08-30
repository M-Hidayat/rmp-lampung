import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('E2E Alur LMS Dynamic QR Absensi', () => {
  test('Admin Buka Sesi LMS QR -> QR Berotasi Otomatis & Peserta Berhasil Absen', async ({ page, browser }) => {
    // 1. Login Admin untuk membuka sesi absensi LMS
    await page.goto(`${BASE_URL}/masuk`);
    await page.fill('input[name="email"]', 'admin@contoh.rmp-lampung.test');
    await page.fill('input[name="kataSandi"]', 'AdminContoh123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 30000 });

    await page.goto(`${BASE_URL}/admin/absensi`);
    await page.selectOption('select[name="classId"]', { label: 'CONTOH - Pelatihan Usaha Bakso' });
    await page.click('button:has-text("Buka Sesi & Tampilkan Dynamic QR")');

    // 2. Verifikasi UI Dynamic QR LMS (Badge Live, Countdown progress bar, Auto-Refresh)
    await expect(page.locator('text=LMS Dynamic QR (Live)')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=QR berganti dalam:')).toBeVisible();
    await expect(page.locator('text=Auto-Refresh')).toBeVisible();

    // 3. Matikan auto-refresh sementara di tes agar token tidak berganti di background saat browser switch
    await page.uncheck('input[type="checkbox"]');

    // Ambil Token Terkini
    const linkCadangan = await page.locator('text=Tautan cadangan:').first().textContent();
    const token = linkCadangan?.split('token=')[1]?.trim();
    expect(token).toBeTruthy();

    // 4. Buka browser context baru sebagai Peserta seeded
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    await userPage.goto(`${BASE_URL}/masuk`);
    await userPage.fill('input[name="email"]', 'peserta@contoh.rmp-lampung.test');
    await userPage.fill('input[name="kataSandi"]', 'PesertaContoh123!');
    await userPage.click('button[type="submit"]');
    await userPage.waitForURL('**/user**', { timeout: 30000 });

    // 5. Peserta membuka halaman absensi dengan token
    await userPage.goto(`${BASE_URL}/user/absensi?token=${token}`);
    await expect(userPage.locator('input[name="token"]')).toHaveValue(token!);

    // 6. Submit absensi
    await userPage.click('button:has-text("Konfirmasi & Catat Kehadiran")');

    // 7. Verifikasi feedback kehadiran sukses / sudah tercatat
    await expect(
      userPage.locator('text=Absensi berhasil').or(userPage.locator('text=sudah tercatat hadir')).first()
    ).toBeVisible({ timeout: 10000 });

    await userContext.close();
  });
});
