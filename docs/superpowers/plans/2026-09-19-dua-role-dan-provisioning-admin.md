# Dua Role dan Provisioning Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyederhanakan RMP Lampung menjadi role `USER` dan `ADMIN`, menghapus domain pemilik, dan menyediakan admin awal secara aman.

**Architecture:** Provisioner transactional menangani admin awal, pengalihan foreign key, dan penghapusan akun pemilik saat schema lama masih mengenali enum tersebut. Setelah itu schema/migration membatasi enum menjadi dua role; laporan bisnis dipindahkan ke area admin dan seluruh route/UI/service khusus pemilik dibuang.

**Tech Stack:** Next.js 15, React 19, TypeScript, Prisma 6, PostgreSQL, bcryptjs, Zod.

## Global Constraints

- Role akhir hanya `USER` dan `ADMIN`.
- Password plaintext hanya di `.env` lokal yang diabaikan Git.
- Jangan menaruh kredensial di source, migration, UI, log, atau dokumentasi terlacak.
- Jangan menghapus histori operasional; alihkan foreign key sebelum akun pemilik dihapus.
- Jangan menjalankan Vitest, Playwright, browser testing, atau audit performa otomatis.
- Jangan mengklaim build, migration, provisioning, atau login teruji.

---

### Task 1: Provisioner admin transactional

**Files:**
- Create: `scripts/provision-admin.ts`
- Modify: `package.json`
- Modify: `.env.example`
- Modify: `.env`

- [ ] Validasi `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`, dan `INITIAL_ADMIN_NAME` memakai schema Zod yang sudah ada.
- [ ] Hash password melalui `hashKataSandi`.
- [ ] Dalam satu transaksi: upsert admin, alihkan `AttendanceSession.dibuatOlehId` dari semua akun `PEMILIK`, lalu hapus akun `PEMILIK`.
- [ ] Tambahkan `npm run admin:provision` dan placeholder aman di `.env.example`.
- [ ] Simpan kredensial yang diberikan pengguna hanya di `.env` lokal.

### Task 2: Schema dua role dan migration enum

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260919000000_remove_pemilik_role/migration.sql`

- [ ] Ubah enum Prisma menjadi `ADMIN` dan `USER`.
- [ ] Migration menolak bila masih ada `PEMILIK`, mengganti enum PostgreSQL secara eksplisit, mempertahankan default `USER`, dan tidak memuat kredensial.

### Task 3: Sederhanakan RBAC dan routing

**Files:**
- Modify: `src/lib/rbac.ts`
- Modify: `src/lib/rbac.test.ts`
- Modify: `src/middleware.ts`
- Modify: `src/app/(dashboard)/layout.tsx`
- Modify: `src/app/(publik)/layout.tsx`
- Delete: `src/app/(dashboard)/pemilik/**`

- [ ] Hapus role dan kemampuan khusus pemilik.
- [ ] Izinkan `/admin` hanya untuk admin; `/user` untuk user dan admin.
- [ ] Hapus route, menu, label, ikon, dan matcher pemilik.
- [ ] Sesuaikan source test RBAC tanpa menjalankannya.

### Task 4: Pindahkan laporan bisnis ke admin

**Files:**
- Create: `src/app/(dashboard)/admin/laporan/page.tsx` dari halaman laporan pemilik
- Modify: `src/lib/layanan/laporan.ts`
- Modify: `src/app/(dashboard)/layout.tsx`

- [ ] Pindahkan halaman laporan ke `/admin/laporan` dan ubah action filter.
- [ ] Otorisasi laporan memakai kemampuan admin operasional.
- [ ] Tambahkan menu Laporan Bisnis pada sidebar admin.
- [ ] Audit sertifikat tetap tersedia di `/admin/sertifikat`.

### Task 5: Hapus service dan action khusus manajemen admin

**Files:**
- Modify: `src/lib/layanan/admin.ts`
- Modify: `src/lib/validasi.ts`
- Modify: `src/app/(dashboard)/aksi.ts`
- Modify: `src/lib/layanan/sertifikat.ts`

- [ ] Hapus daftar/buat/ubah status admin beserta validator dan action tanpa pemanggil.
- [ ] Hapus revalidation `/pemilik`.
- [ ] Hapus fungsi audit khusus pemilik bila halaman admin sertifikat tidak memakainya.

### Task 6: Dokumentasi dan audit statis

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: dokumentasi relevan lain

- [ ] Dokumentasikan dua role dan provisioning admin via environment.
- [ ] Hapus referensi teknis `PEMILIK` dan `/pemilik`; pertahankan kata pemilik bila berarti pemilik bisnis/dokumen.
- [ ] Jalankan audit referensi statis dan `git diff --check` saja.
- [ ] Laporkan bahwa test, build, migration, provisioning, dan login belum dijalankan.
