# Optimasi Produksi dan Cleanup RMP Lampung Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghapus fasilitas demo dan data rekaan, merampingkan aplikasi produksi, serta menambahkan loading UI dan optimasi gambar native Next.js.

**Architecture:** Pertahankan App Router dan seluruh kontrak bisnis produksi. Cleanup dilakukan dari konfigurasi menuju source dan dokumentasi; loading memakai route-level `loading.tsx` dan skeleton CSS tanpa dependency baru; halaman publik hanya merender data database nyata atau empty state.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Prisma 6, Pakasir.

## Global Constraints

- Hapus seluruh mekanisme seed, termasuk akun PEMILIK.
- Hapus simulator pembayaran dan tooling tunnel lokal.
- Jangan menambah dependency baru.
- Jangan mengubah RBAC, webhook Pakasir produksi, absensi, invoice, atau sertifikat.
- Jangan menjalankan Vitest, Playwright, pengujian browser/manual, atau audit performa otomatis.
- Jangan mengklaim implementasi teruji atau bebas regresi.

---

### Task 1: Bersihkan konfigurasi demo dan tooling lokal

**Files:**
- Delete: `prisma/seed.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `.env`

- [ ] Hapus blok Prisma seed, script `db:seed`, script tunnel, dan dependency `localtunnel` memakai `npm uninstall -D localtunnel` agar lockfile konsisten.
- [ ] Hapus seluruh `SEED_*` dari template dan environment lokal.
- [ ] Hapus artefak `.next` dan `tsconfig.tsbuildinfo`.

### Task 2: Hapus simulator dan fallback pembayaran palsu

**Files:**
- Delete: `src/app/(publik)/simulasi-pembayaran/page.tsx`
- Delete: `src/app/(publik)/simulasi-pembayaran/konten-simulasi.tsx`
- Modify: `src/lib/integrasi/pakasir.ts`
- Modify: `src/lib/konfigurasi.ts`
- Modify: `src/lib/integrasi/pakasir.test.ts`
- Modify/Delete: spesifikasi E2E yang khusus simulator

- [ ] Hapus route simulator.
- [ ] Gunakan adapter Pakasir nyata untuk URL checkout di semua environment; pertahankan pembeda mode hanya bila dibutuhkan verifikasi webhook.
- [ ] Pastikan konfigurasi yang tidak lengkap gagal eksplisit dan tidak fallback ke route lokal.
- [ ] Hapus ekspektasi source test yang merujuk route yang sudah tidak ada tanpa menjalankan test suite.

### Task 3: Hapus kredensial dan konten rekaan dari UI

**Files:**
- Modify: `src/app/(autentikasi)/masuk/formulir-masuk.tsx`
- Modify: `src/app/(publik)/page.tsx`
- Delete/Modify: `src/components/testimoni-alumni.tsx`
- Delete unused assets under `public/images/` only after reference audit

- [ ] Hapus refs, helper, dan tombol quick-fill akun demo.
- [ ] Hapus fallback kelas, jadwal statis kedaluwarsa, statistik/testimoni tanpa sumber terverifikasi.
- [ ] Render kelas nyata dari database atau empty state yang jelas.
- [ ] Hapus komponen/aset yang menjadi mati setelah cleanup.

### Task 4: Tambahkan loading UI native dan optimasi gambar

**Files:**
- Create: `src/components/loading-skeleton.tsx`
- Create: `src/app/(publik)/loading.tsx`
- Create: `src/app/(autentikasi)/loading.tsx`
- Create: `src/app/(dashboard)/loading.tsx`
- Modify: halaman dengan `next/image` bila `sizes`, prioritas, atau static import belum tepat

- [ ] Buat skeleton aksesibel dengan `role="status"`, `aria-live="polite"`, dan teks screen-reader.
- [ ] Buat fallback per route group yang mempertahankan geometri layout.
- [ ] Pertahankan prioritas hanya untuk hero LCP dan lazy loading bawaan untuk gambar lain.
- [ ] Gunakan static import untuk aset lokal utama agar metadata intrinsik dan blur placeholder tersedia.

### Task 5: Sinkronkan dokumentasi dan instruksi repo

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `dokumentasi/identitas-rmp.md`

- [ ] Hapus instruksi seed, kredensial demo, simulator, dan tunnel.
- [ ] Dokumentasikan database kosong dan provisioning akun awal sebagai prosedur operasional eksternal.
- [ ] Perbaiki port dokumentasi dari 3000 ke 3001 bila relevan.
- [ ] Hapus klaim konten contoh yang sudah tidak berlaku.

### Task 6: Audit statis akhir tanpa pengujian

**Files:**
- Inspect: seluruh diff

- [ ] Cari ulang `SEED_`, kredensial demo, `/simulasi-pembayaran`, `localtunnel`, dan referensi seed; hasil source/documentation harus nol kecuali catatan historis spesifikasi.
- [ ] Jalankan `git diff --check` sebagai pemeriksaan format diff, bukan test aplikasi.
- [ ] Tinjau `git status` dan diff untuk memastikan tidak ada file bisnis yang terhapus tanpa dasar.
- [ ] Laporkan hasil sebagai belum diuji sesuai instruksi pengguna.
