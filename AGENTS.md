# AGENTS.md — Pedoman Rekayasa & Protokol Agen AI (RMP Lampung)

Repositori ini adalah aplikasi produksi **Sistem Manajemen Kursus Kuliner RMP Lampung** berbasis Next.js 15 (App Router), React 19, TypeScript, Prisma ORM, PostgreSQL, dan Playwright/Vitest.

Semua agen coding dan pengembang yang bekerja di repositori ini **WAJIB** mematuhi pedoman dan protokol arsitektur di bawah ini.

---

## 1. Lingkungan & Stack Teknologi

| Komponen | Spesifikasi & Konvensi |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions, Route Handlers) |
| **Bahasa** | TypeScript (Strict mode, No `any` implisit) |
| **UI & Styling** | Tailwind CSS, Radix UI Primitives, Lucide Icons |
| **Database** | PostgreSQL (Docker container `rmp_postgres_uji` pada port `5433`) |
| **ORM** | Prisma Client (`@prisma/client`) |
| **Autentikasi** | NextAuth.js (JWT Strategy, Credentials Provider) |
| **QR & Scanner** | `qrcode` (Server QR generation), `jsQR` (Client camera canvas stream) |
| **Testing** | Vitest (Unit & Domain Integration), Playwright (E2E Web Tests) |
| **Port Dev** | Port `3001` (`http://localhost:3001`) untuk menghindari konflik container port 3000 |

---

## 2. Arsitektur Pemisahan Otoritas (RBAC Hierarchy)

Sistem membagi akses secara ketat ke dalam 4 domain:

```
[ Domain Publik ] ──► Katalog (/kelas), Profil, Cara Daftar, Verifikasi Sertifikat (/verifikasi)
       │
[ Domain Peserta ] ──► /user/* (Kelas saya, Pembayaran, Absensi QR, Invoice, Sertifikat)
       │
[ Domain Admin ]   ──► /admin/* (Manajemen Kelas, Data Peserta, Sesi QR Live, Rekap Kehadiran)
       │
[ Domain Pemilik ] ──► /pemilik/* (Dashboard Finansial Eksekutif, Tata Kelola Admin, Audit Dokumen)
```

### Aturan Otoritas:
1. **Pencegahan Bypass**: Proteksi dievaluasi pada 3 lapis:
   - Lapisan 1: `middleware.ts` (Edge-safe cookie check).
   - Lapisan 2: `src/app/(dashboard)/[peran]/layout.tsx` (Server component role guard).
   - Lapisan 3: Domain Service / Server Action (`wajibPeran`, `wajibKemampuan` di `src/lib/rbac.ts`).
2. **Isolasi UI**: Menu navigasi role lain **tidak boleh bocor** ke antarmuka pengguna yang tidak berhak.

---

## 3. Protokol Modul Absensi (LMS Dynamic QR)

1. **Auto-Rotation Interval**:
   - Layar admin merotasi token QR setiap **30 detik** secara dinamis.
   - Dilengkapi visual *live progress bar countdown*.
2. **Keamanan Token Absensi**:
   - Token mentah berumur pendek (`randomBytes(32).toString("base64url")`).
   - Database hanya menyimpan hash **SHA-256** dari token (`hashTokenAbsensi(token)`).
   - Dilindungi **Grace Period 15 detik** untuk mengatasi latensi jaringan klien.
3. **Kompatibilitas Scanner**:
   - Gunakan `jsQR` di atas Canvas WebRTC (`getUserMedia`) untuk memastikan pemindai kamera berjalan 100% di semua browser Desktop & Mobile tanpa dependensi browser flags eksperimental.

---

## 4. Alur Integrasi Pembayaran & Webhook (Pakasir)

1. **Checkout Format**:
   - URL: `https://app.pakasir.com/pay/{proyek}/{nominal}?order_id={order_id}&redirect={redirect_url}`
2. **Webhook Receiver (`/api/pakasir/webhook`)**:
   - Validasi signature webhook menggunakan `PAKASIR_WEBHOOK_SECRET`.
   - Transaksi database atomik: Update status payment $\rightarrow$ Update enrollment menjadi `PAID` $\rightarrow$ Terbitkan invoice secara otomatis.
3. **Local Testing**:
   - Tersedia simulator pembayaran lokal pada `/simulasi-pembayaran` untuk menguji alur tanpa kartu/QRIS sungguhan.

---

## 5. Standar Rekayasa Kode & Pengujian

### A. Perubahan Kode
- **Verifikasi Sebelum Mengubah**: Gunakan `read_file` dan `search_files` sebelum mengedit.
- **Hindari Hardcoded Secrets**: Ambil seluruh kredensial dari `process.env`.
- **Atomic Database Operations**: Selalu gunakan `prisma.$transaction` untuk operasi yang menyentuh lebih dari satu tabel terkait (contoh: Absensi + Sertifikat).

### B. Perintah Verifikasi Wajib
Sebelum menyelesaikan atau melaporkan tugas, jalankan pengujian berikut:

```bash
# 1. Validasi Tipe Data
npm run typecheck

# 2. Unit & Domain Integration Tests
npx vitest run

# 3. Playwright End-to-End Test Suite
npx playwright test
```

Semua pengujian harus berstatus **PASS (100%)** tanpa kegagalan atau regresi.
