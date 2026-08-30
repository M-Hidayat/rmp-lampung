# Rancangan Fitur: LMS Dynamic Auto-Refreshing QR Absensi

## 1. Tujuan
Meningkatkan keamanan dan pengalaman absensi layaknya LMS pendidikan modern dengan QR code yang berganti otomatis (auto-refresh) setiap 30 detik di layar Admin/Proyektor. Hal ini mencegah token difoto atau disebarluaskan oleh peserta yang tidak hadir di kelas fisik.

---

## 2. Arsitektur & Alur Kerja

```
[ Layar Admin / Proyektor ]
       │
       ├─► 1. Buka Sesi Kelas -> Generate Token 1 (30s) + QR Image
       │      │
       │      ├─► Countdown Timer (30s.. 29.. 28..)
       │      └─► Saat timer habis -> Otomatis call API rotasi -> QR baru (Token 2)
       │
       ▼
[ Layar Peserta / Scanner HP ]
       │
       ├─► Scan QR yang aktif di proyektor
       ├─► Auto-submit token ke `/api/absensi/scan`
       └─► Backend validasi:
             1. Sesi aktif?
             2. Token cocok dengan hash aktif (atau token aktif sebelumnya dalam grace period 15s)?
             3. User terdaftar & lunas (PAID)?
             4. Belum pernah absen di kelas ini?
             └─► Sukses -> Catat kehadiran & terbitkan sertifikat
```

---

## 3. Komponen yang Dimodifikasi

1. **`src/app/(dashboard)/admin/absensi/panel-qr.tsx`**:
   - Menambahkan **Countdown Visual Progress Bar** & angka detik (30s).
   - Mode **Auto-Rotate Switch / Toggle** (aktif secara default).
   - Hook interval pemanggilan otomatis pembaruan token tanpa me-reload seluruh halaman.
   - Status visual live (Hijau: Aktif, Kuning: Memperbarui).

2. **`src/lib/layanan/absensi.ts`**:
   - Menambahkan dukungan masa berlaku token singkat (default 30-60 detik per tick) dengan grace period 15 detik untuk mengatasi latensi jaringan saat scan.

3. **`src/app/(dashboard)/user/absensi/formulir-absensi.tsx`**:
   - Pemindai kamera `jsQR` langsung menangkap token dinamis dan mengirimkan dalam hitungan milidetik.
   - Respons instan dan visual feedback keberhasilan absensi.

---

## 4. Rencana Pengujian (Verification Gate)
- **Unit Test**: Validasi perhitungan expiry & toleransi grace period token absensi.
- **Integration Test**: Alur pembuatan sesi rotasi dan validasi absensi multi-token.
- **Playwright E2E**: Menguji countdown timer admin yang berganti otomatis, serta peserta yang memindai QR dinamis hingga tercatat hadir.
