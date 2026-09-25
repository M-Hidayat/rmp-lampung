# UI/UX Industry Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyelaraskan seluruh UI RMP Lampung ke sistem charcoal–white–orange yang responsif, aksesibel, dan konsisten tanpa mengubah fitur bisnis.

**Architecture:** Perubahan dimulai dari font dan token global, diteruskan ke primitive UI bersama, lalu shell navigasi dan kelompok halaman. Pendekatan ini mengurangi patch halaman dan menjaga diff minimal; UI mati hanya dihapus setelah pemanggilnya dipastikan tidak ada.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Radix primitives, Lucide, `next/font`.

## Global Constraints

- Pertahankan seluruh fitur dan alur bisnis aktif.
- Palet utama `#0F172A`, `#FFFFFF`, dan `#EA580C` sesuai `DESIGN.md`.
- Montserrat untuk heading dan Inter untuk body melalui `next/font/google`.
- Tidak menambah dependency, dark mode, data fiktif, atau abstraksi spekulatif.
- Jangan menghapus test hanya karena eksekusi test dilewati.
- Jangan menjalankan lint, typecheck, Vitest, Playwright, build, browser test, atau audit performa.
- Verifikasi terbatas pada audit source, dead references, dan `git diff --check`.

---

### Task 1: Font dan semantic design tokens

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS variables `--font-body`, `--font-heading`, semantic color tokens, global focus/reduced-motion behavior.

- [ ] Ganti CSS Google Fonts `@import` dengan `Montserrat` dan `Inter` dari `next/font/google`; pasang variable class pada `<html>`.
- [ ] Ubah token global menjadi slate/white/orange sesuai `DESIGN.md`, termasuk foreground, surface, border, status, input, dan focus ring.
- [ ] Pastikan native controls mewarisi font, body memiliki line-height, focus visible jelas, dan reduced motion mematikan motion non-esensial.
- [ ] Hilangkan override body yang bertentangan dengan token global.

### Task 2: Primitive UI bersama

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/ui/label.tsx`
- Modify: `src/components/ui/alert.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/table.tsx`
- Modify: `src/components/status-lencana.tsx`
- Modify: `src/components/kerangka.tsx`
- Modify: `src/components/loading-skeleton.tsx`

**Interfaces:**
- Consumes: tokens Task 1.
- Produces: ukuran, spacing, focus, status, cards, tables, dan skeleton konsisten untuk seluruh route.

- [ ] Standarkan button minimal 44px pada action utama, variant orange/neutral/destructive, focus ring, disabled, dan transition 150–200ms.
- [ ] Samakan card, input, label, alert, badge, dan page heading memakai token, bukan raw gold/cream.
- [ ] Buat table wrapper responsif dengan boundary scroll yang jelas dan header terbaca.
- [ ] Selaraskan status badge agar teks/ikon mendukung warna.
- [ ] Sesuaikan skeleton public/auth/dashboard dengan token dan geometri konten.

### Task 3: Dashboard shell dan navigasi mobile

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`
- Create: `src/app/(dashboard)/navigasi-mobile.tsx`

**Interfaces:**
- Consumes: `ItemMenu` atau data menu serializable dari dashboard layout.
- Produces: desktop sidebar dan mobile menu dengan destination role yang sama.

- [ ] Hapus import dan control header yang tidak memiliki fungsi nyata seperti search/notifikasi palsu.
- [ ] Selaraskan sidebar desktop ke charcoal/white/orange dan active state yang jelas.
- [ ] Tambahkan komponen client minimal untuk membuka/menutup drawer mobile, Escape handling, backdrop, focusable close button, dan accessible labels.
- [ ] Pastikan konten utama memiliki offset/layout yang benar pada desktop serta mobile dan semua target sentuh minimal 44px.
- [ ] Pertahankan logout, role label, tautan publik, dan seluruh menu aktif.

### Task 4: Public dan authentication surfaces

**Files:**
- Modify: `src/app/(publik)/layout.tsx`
- Modify: `src/app/(publik)/page.tsx`
- Modify: `src/app/(publik)/kelas/page.tsx`
- Modify: `src/app/(publik)/kelas/[slug]/page.tsx`
- Modify: `src/app/(publik)/profil/page.tsx`
- Modify: `src/app/(publik)/kontak/page.tsx`
- Modify: `src/app/(publik)/cara-pendaftaran/page.tsx`
- Modify: `src/app/(publik)/verifikasi/page.tsx`
- Modify: `src/app/(publik)/verifikasi/[nomor]/page.tsx`
- Modify: `src/app/(autentikasi)/layout.tsx`
- Modify: `src/app/(autentikasi)/masuk/page.tsx`
- Modify: `src/app/(autentikasi)/masuk/formulir-masuk.tsx`
- Modify: `src/app/(autentikasi)/daftar/page.tsx`
- Modify: `src/app/(autentikasi)/daftar/formulir-daftar.tsx`

- [ ] Ganti raw gold/cream dengan semantic palette dan rapikan hierarchy hero, CTA, cards, metadata, serta empty states.
- [ ] Pertahankan optimized hero image dan seluruh copy/fakta yang terverifikasi.
- [ ] Pastikan kartu kelas mudah dipindai dan responsif tanpa mengubah data/action.
- [ ] Ringkas form auth, pertahankan visible labels/error, dan perjelas pending/disabled state yang sudah didukung.
- [ ] Jadikan hasil verifikasi sertifikat sebagai fokus status yang tidak bergantung pada warna saja.
- [ ] Hapus hanya dekorasi atau control yang terbukti tanpa fungsi.

### Task 5: User dashboard surfaces

**Files:**
- Modify: seluruh `src/app/(dashboard)/user/**/page.tsx`
- Modify: `src/app/(dashboard)/user/absensi/formulir-absensi.tsx`

- [ ] Terapkan page heading, card, table/list, empty state, dan CTA pattern bersama.
- [ ] Hapus kartu/dekorasi tanpa tindakan atau data nyata; pertahankan semua status bisnis.
- [ ] Perjelas next action untuk kelas, pembayaran, absensi, invoice, sertifikat, dan profil.
- [ ] Pertahankan WebRTC/jsQR serta perjelas feedback kamera, scanning, success, dan error.
- [ ] Pastikan layout mobile tidak overflow selain tabel/area media yang memang terkontrol.

### Task 6: Admin dashboard surfaces

**Files:**
- Modify: seluruh `src/app/(dashboard)/admin/**/page.tsx`
- Modify: `src/app/(dashboard)/admin/kelas/formulir-kelas.tsx`
- Modify: `src/app/(dashboard)/admin/absensi/panel-qr.tsx`

- [ ] Terapkan pattern operasional konsisten pada statistik, kelas, peserta, pembayaran, absensi, kehadiran, sertifikat, dan laporan.
- [ ] Hapus pencarian atau visual control yang tidak memiliki filtering/action nyata.
- [ ] Standarkan filter native, action rows, confirmation affordance, financial metrics, dan responsive tables.
- [ ] Pertahankan seluruh server actions dan data bindings.
- [ ] Pertahankan mode proyektor QR, countdown 30 detik, progress, dan dark charcoal surface.

### Task 7: Dead UI audit dan static verification

**Files:**
- Inspect: `src/app/**`, `src/components/**`
- Modify/Delete: hanya import, CSS, atau komponen tanpa pemanggil yang terbukti mati.

- [ ] Cari raw palette lama (`#D49A28`, `#854D0E`, `#FAF8F5`, `#EFECE6`) dan pertahankan hanya pengecualian yang dijelaskan.
- [ ] Cari icon/control tanpa handler, link, form action, atau destination; hapus jika benar-benar inert.
- [ ] Cari komponen/import tanpa pemanggil dan hapus dengan scope minimum.
- [ ] Pastikan seluruh 25 `page.tsx` tetap tersedia dan fitur route aktif tidak terhapus.
- [ ] Jalankan `git diff --check` dan audit referensi source.
- [ ] Laporkan implementasi sebagai belum diuji karena seluruh quality gate eksekusi dilewati atas instruksi pengguna.
