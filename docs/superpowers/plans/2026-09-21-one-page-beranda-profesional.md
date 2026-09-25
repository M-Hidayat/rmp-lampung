# One-Page Beranda Profesional RMP Lampung Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah beranda publik menjadi landing page satu halaman yang profesional, faktual, responsif, dan berorientasi pada pemilihan kelas serta pendaftaran.

**Architecture:** Pertahankan beranda sebagai async Server Component yang mengambil maksimum tiga kelas publik. Navigasi publik mengarah ke anchor stabil pada `/`, sedangkan katalog, detail kelas, autentikasi, verifikasi, dan dashboard tetap route terpisah. Semua identitas/kontak memakai `identitasRmp`; tidak ada state, dependency, atau abstraksi baru selain state menu mobile yang sudah ada.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4, Lucide React, Playwright.

## Global Constraints

- Copy menggunakan Bahasa Indonesia natural, ringkas, profesional, dan tidak memuat klaim yang belum terverifikasi.
- Palet: putih/abu sangat muda, charcoal, dan oranye hangat; Montserrat untuk heading, Inter untuk isi.
- Mobile-first, tanpa overflow horizontal, target interaksi minimal 44 × 44 px, fokus terlihat, dan kontras WCAG AA.
- Pertahankan route publik lama; jangan ubah backend pendaftaran, pembayaran, absensi, invoice, atau sertifikat.
- Tidak menambah dependency, carousel, state global, library animasi, testimoni, statistik, peta, atau aset/logo buatan.
- Data kelas tetap berasal dari `daftarKelasPublik()` dan identitas/kontak dari `src/lib/identitas-rmp.ts`.
- Repo sudah memiliki banyak perubahan pengguna; sentuh hanya file yang disebut dalam rencana dan jangan commit tanpa izin.

---

### Task 1: Implementasikan komposisi one-page dan copy profesional

**Files:**
- Modify: `src/app/(publik)/page.tsx:1-50`

**Interfaces:**
- Consumes: `daftarKelasPublik(): Promise<KelasPublik[]>`, `sisaKuota(kuota, jumlahPendaftaran)`, `identitasRmp`, `formatRupiah`, `formatTanggalWaktu`.
- Produces: section IDs `beranda`, `program`, `cara-daftar`, `tentang`, dan `kontak` yang dipakai navigasi dan tes E2E.

- [ ] **Step 1: Tambahkan metadata halaman yang faktual**

Ekspor metadata lokal dengan judul “Pelatihan Bisnis Kuliner di Bandar Lampung” dan deskripsi yang menyebut kursus masakan, roti, kue, dan minuman tanpa klaim hasil.

- [ ] **Step 2: Bangun hero dan bagian keunggulan**

Gunakan satu `h1`, `next/image`, CTA `#program`, CTA WhatsApp dari `identitasRmp.whatsapp.nilai`, serta tiga kartu nilai: belajar terarah, berbasis praktik, dan administrasi dalam satu sistem. Gunakan elemen semantik dan ikon Lucide dengan `aria-hidden="true"` saat dekoratif.

- [ ] **Step 3: Rapikan program terdekat**

Pertahankan pengambilan tiga kelas dan informasi biaya/jadwal/lokasi/kuota. Bungkus dalam `<section id="program" className="scroll-mt-24">`. Empty state harus menyediakan tautan WhatsApp; tombol “Lihat semua kelas” menuju `/kelas`.

- [ ] **Step 4: Tambahkan alur pendaftaran empat tahap**

Buat section `cara-daftar` berisi empat langkah dari pemilihan kelas hingga ketersediaan invoice/sertifikat. CTA menuju `/kelas` dan `/daftar`; jangan tampilkan detail webhook.

- [ ] **Step 5: Tambahkan bagian Tentang, Kontak, dan CTA penutup**

Gunakan hanya fakta dari `identitasRmp`: jenis kursus, format kelas, alamat, telepon, email, WhatsApp, dan media sosial. Tautan eksternal memakai `target="_blank" rel="noreferrer noopener"`; profil rinci menuju `/profil`.

- [ ] **Step 6: Jalankan umpan balik statis awal**

Run: `npm run typecheck`

Expected: exit `0`. Jika ada kegagalan pre-existing, catat baseline dan pastikan tidak ada error baru dari `src/app/(publik)/page.tsx`.

---

### Task 2: Ubah navigasi publik menjadi navigasi anchor lintas-route

**Files:**
- Modify: `src/app/(publik)/layout.tsx:8-13`
- Modify: `src/components/navigasi-publik.tsx:20-86`

**Interfaces:**
- Consumes: section IDs dari Task 1.
- Produces: tautan `/#beranda`, `/#program`, `/#cara-daftar`, `/#tentang`, `/#kontak`; menu mobile yang menutup setelah pemilihan.

- [ ] **Step 1: Ganti konfigurasi tautan di layout publik**

Gunakan tepat lima tautan anchor lintas-route:

```ts
const tautan = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#program", label: "Program" },
  { href: "/#cara-daftar", label: "Cara Daftar" },
  { href: "/#tentang", label: "Tentang" },
  { href: "/#kontak", label: "Kontak" },
]
```

Pertahankan logika Masuk/Daftar/Dashboard tanpa perubahan perilaku.

- [ ] **Step 2: Tingkatkan ukuran target dan perilaku menu mobile**

Pastikan tautan dan tombol menu memiliki tinggi minimum 44 px (`min-h-11`), tombol mempertahankan `aria-label` dan `aria-expanded`, dan dropdown menutup saat anchor dipilih. Jangan menambahkan deteksi active-section berbasis JavaScript.

- [ ] **Step 3: Verifikasi tipe setelah integrasi navigasi**

Run: `npm run typecheck`

Expected: exit `0`, tanpa error pada dua file navigasi.

---

### Task 3: Tambahkan pengujian perilaku landing page

**Files:**
- Create: `e2e/beranda-one-page.spec.ts`

**Interfaces:**
- Consumes: section IDs dan label tautan dari Task 1–2.
- Produces: bukti perilaku desktop/mobile dan tautan lintas-route.

- [ ] **Step 1: Tulis tes struktur dan CTA utama**

Tambahkan Playwright test yang membuka `/`, memeriksa satu heading level 1, keberadaan lima section ID, tautan “Lihat semua kelas” ke `/kelas`, dan CTA WhatsApp dengan `href` yang diawali URL WhatsApp terverifikasi. Gunakan locator spesifik (`page.locator("main")`) agar footer/nav tidak menyebabkan selector ambigu.

- [ ] **Step 2: Tulis tes anchor lintas-route**

Buka `/kelas`, klik tautan navigasi “Tentang”, lalu harapkan URL berakhir `/#tentang` dan elemen `#tentang` terlihat.

- [ ] **Step 3: Tulis tes menu mobile dan overflow**

Atur viewport `390 × 844`, buka tombol “Buka menu”, periksa `aria-expanded="true"`, klik “Program”, periksa menu menutup, `#program` terlihat, dan `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.

- [ ] **Step 4: Jalankan tes E2E terfokus**

Run: `npx playwright test e2e/beranda-one-page.spec.ts --project=chromium`

Expected: seluruh test di file tersebut PASS. Bila database/server tidak tersedia, laporkan blocker konkret; jangan mengganti hasil dengan asumsi.

---

### Task 4: Audit visual, aksesibilitas, dan gerbang regresi

**Files:**
- Modify only if needed: `src/app/(publik)/page.tsx`
- Modify only if needed: `src/components/navigasi-publik.tsx`
- Test: `e2e/beranda-one-page.spec.ts`

**Interfaces:**
- Consumes: landing page lengkap.
- Produces: bukti akhir bahwa implementasi memenuhi spesifikasi tanpa regresi terdeteksi.

- [ ] **Step 1: Jalankan aplikasi dan inspeksi desktop/mobile**

Run server: `npm run dev` (background, port 3001).

Periksa `/` pada lebar desktop dan mobile: hierarki, alignment, wrapping judul, kartu kelas, fokus keyboard, anchor yang tidak tertutup header, dan ketiadaan overflow. Buktikan identitas runtime melalui URL, title dokumen, dan heading RMP.

- [ ] **Step 2: Perbaiki hanya cacat yang terbukti**

Gunakan perubahan Tailwind minimum pada file terkait. Jangan membuat komponen baru kecuali duplikasi nyata membuat file sulit dipelihara.

- [ ] **Step 3: Jalankan gerbang wajib proyek**

Run, satu per satu:

```bash
npm run typecheck
npx vitest run
npx playwright test
```

Expected: setiap perintah exit `0` dan 100% PASS. Bandingkan kegagalan dengan baseline/status repo agar kegagalan pre-existing dibedakan dari regresi perubahan ini.

- [ ] **Step 4: Jalankan pemeriksaan tambahan**

Run:

```bash
npm run lint
npm run build
git diff --check
```

Expected: exit `0`. Jika `npm run lint` gagal karena script Next.js 15 yang sudah tidak didukung atau build terblokir lingkungan, laporkan output persis dan tetap pastikan typecheck/test/E2E serta diff check dijalankan.

- [ ] **Step 5: Tinjau diff terarah**

Run: `git diff -- src/app/'(publik)'/page.tsx src/app/'(publik)'/layout.tsx src/components/navigasi-publik.tsx e2e/beranda-one-page.spec.ts`

Pastikan tidak ada perubahan backend, secret, data palsu, klaim tanpa sumber, route yang dihapus, atau dependency baru.

---

## Definition of Done

- Menu Beranda–Kontak bekerja sebagai anchor dari `/` dan route publik lain.
- Landing page memuat hero, keunggulan, tiga program terdekat/empty state, empat langkah pendaftaran, Tentang, Kontak, dan CTA akhir.
- Copy faktual dan bersumber dari data yang tersedia.
- Desktop/mobile rapi, aksesibel, tanpa overflow horizontal.
- Typecheck, Vitest, dan Playwright memiliki bukti hasil aktual; lint/build dan blocker lingkungan dilaporkan apa adanya.
- Tidak ada commit atau push tanpa permintaan eksplisit pengguna.
