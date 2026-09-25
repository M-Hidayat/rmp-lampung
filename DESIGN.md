---
version: alpha
name: RMP Culinary Excellence System
description: Sistem desain resmi Rumah Mama Pintar untuk platform kursus kuliner Bandar Lampung — navy otoritatif sebagai aksi utama, crimson sebagai identitas kuliner tradisional, dan amber hangat sebagai penanda aksi bernilai. Tipografi Montserrat (judul) + Inter (isi).
colors:
  # --- Aksi utama: navy. Kontras putih di atasnya 17.85:1 (AAA). ---
  primary: "#0F172A"
  primary-foreground: "#FFFFFF"
  primary-hover: "#1E293B"
  # Teks sekunder di atas permukaan navy (12.02:1 di atas primary).
  primary-muted: "#CBD5E1"

  # --- Permukaan ---
  background: "#F9FAFB"
  foreground: "#0F172A"
  card: "#FFFFFF"
  card-foreground: "#0F172A"
  popover: "#FFFFFF"
  popover-foreground: "#0F172A"

  # --- Sekunder & redam ---
  secondary: "#F1F5F9"
  secondary-foreground: "#0F172A"
  muted: "#F1F5F9"
  muted-foreground: "#475569"

  # --- Aksen hangat: permukaan CTA. accent-foreground 4.88:1 di atas accent. ---
  accent: "#FFF7ED"
  accent-foreground: "#C2410C"

  # --- Identitas kuliner tradisional. 6.68:1 di atas putih. ---
  brand: "#B22222"
  brand-foreground: "#FFFFFF"
  brand-surface: "#FEF2F2"
  brand-border: "#FECACA"

  # --- Amber dekoratif. HANYA untuk isian grafis, bukan teks. ---
  decorative-amber: "#FFC107"

  # --- Status. Tiap token lulus AA baik sebagai teks di atas putih
  #     maupun sebagai isian berteks putih. ---
  success: "#15803D"
  success-foreground: "#FFFFFF"
  success-surface: "#F0FDF4"
  warning: "#B45309"
  warning-foreground: "#FFFFFF"
  warning-surface: "#FFFBEB"
  destructive: "#B91C1C"
  destructive-foreground: "#FFFFFF"
  destructive-surface: "#FEF2F2"
  info-surface: "#F1F5F9"

  # --- Garis & fokus. Cincin 5.18:1 terhadap kartu (butuh >=3:1 non-teks). ---
  border: "#E2E8F0"
  input: "#E2E8F0"
  ring: "#C2410C"

typography:
  display:
    fontFamily: Montserrat, system-ui, sans-serif
    fontSize: 3.25rem
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  h1:
    fontFamily: Montserrat, system-ui, sans-serif
    fontSize: 2.25rem
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  h2:
    fontFamily: Montserrat, system-ui, sans-serif
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: Montserrat, system-ui, sans-serif
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  eyebrow:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.16em"
  body-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
  price:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1rem
    fontWeight: 700
    lineHeight: 1.4

rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 112px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  button-on-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  text-on-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-muted}"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
  surface-muted:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  separator:
    backgroundColor: "{colors.border}"
    height: 1px
  input-border:
    backgroundColor: "{colors.input}"
    rounded: "{rounded.md}"
  focus-ring:
    backgroundColor: "{colors.ring}"
    rounded: "{rounded.full}"
  callout-brand:
    backgroundColor: "{colors.brand-surface}"
    textColor: "{colors.brand}"
    rounded: "{rounded.lg}"
    padding: 16px
  star-rating:
    backgroundColor: "{colors.card}"
    textColor: "{colors.warning}"
  # Amber dekoratif sebagai ISI grafis saja (tanpa textColor), sehingga tidak
  # tunduk pada aturan kontras teks. Dilarang dipakai untuk teks.
  star-rating-fill:
    backgroundColor: "{colors.decorative-amber}"
  button-gold-border:
    backgroundColor: "{colors.brand-border}"
    rounded: "{rounded.lg}"
  card-border:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.lg}"
  button-brand:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.brand-foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  button-gold:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
    height: 44px
  button-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: 8px
    height: 36px
  button-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: 12px
    height: 48px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-flat:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  badge-neutral:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.sm}"
    padding: 4px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.success-foreground}"
    rounded: "{rounded.sm}"
    padding: 4px
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.warning-foreground}"
    rounded: "{rounded.sm}"
    padding: 4px
  badge-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.sm}"
    padding: 4px
  alert-info:
    backgroundColor: "{colors.info-surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-success:
    backgroundColor: "{colors.success-surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-warning:
    backgroundColor: "{colors.warning-surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-destructive:
    backgroundColor: "{colors.destructive-surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
---

## Overview

Rumah Mama Pintar adalah lembaga pelatihan bisnis kuliner di Bandar Lampung yang
kurikulumnya berbasis praktik langsung. Sistem desain ini menerjemahkan posisi
tersebut menjadi antarmuka yang **tenang, faktual, dan mudah dipercaya** —
bukan landing page yang ramai.

Tiga keputusan membentuk seluruh tampilan:

1. **Navy otoritatif sebagai aksi utama.** Setiap halaman hanya punya satu aksi
   utama berwarna navy (`#0F172A`). Ini memberi hierarki yang tidak ambigu:
   pengguna selalu tahu langkah berikutnya.
2. **Crimson sebagai identitas, bukan hiasan.** `#B22222` muncul pada label
   bagian dan aksen identitas kuliner tradisional, tidak pernah bersaing dengan
   aksi utama.
3. **Amber hangat menandai aksi bernilai.** Permukaan `#FFF7ED` dengan teks
   `#C2410C` dipakai untuk jalur pendaftaran dan pembayaran — satu-satunya
   jalur yang menggerakkan bisnis.

Aturan isi yang mengikat seluruh permukaan: **tidak ada klaim, testimoni, logo,
foto, atau angka yang dikarang.** Di mana data belum ada, tampilkan keadaan
kosong yang jujur.

**Bahasa tata letak.** Ruang kosong yang lega adalah alat utama untuk
menyatakan hierarki, bukan hiasan. Konsekuensinya: sudut kecil dan tegas
(6–8px), permukaan **datar** tanpa bayangan, tanpa gradien, dan ritme bagian
yang lebar dan konsisten (112px di desktop). Satu halaman hanya boleh punya
**satu** aksi penuh-perhatian; sisanya aksi sekunder bergaris atau tanpa warna.
Bila sebuah elemen tidak menambah kejelasan, elemen itu dihapus.

## Colors

Palet sengaja sempit. Semua warna berasal dari token di atas; kelas warna mentah
Tailwind (`bg-zinc-100`, `text-slate-600`, dan sejenisnya) dilarang di permukaan
aplikasi karena memutus hubungan dengan bagian ini.

- **Primary (#0F172A):** navy hampir hitam. Aksi utama, judul, dan teks isi.
  Putih di atasnya terukur **17.85:1** (AAA).
- **Brand (#B22222):** crimson. Identitas kuliner tradisional dan label bagian.
  Terukur **6.68:1** di atas putih (AA).
- **Accent (#FFF7ED) + Accent Foreground (#C2410C):** permukaan CTA hangat.
  Pasangan ini terukur **4.88:1** (AA) dan menjadi satu-satunya cara memakai
  amber untuk teks.
- **Muted Foreground (#475569):** teks sekunder. Terukur **7.58:1** di atas
  kartu dan **7.25:1** di atas latar (AAA). Nilai ini sengaja lebih gelap dari
  default Tailwind (`#64748B`, 4.76:1) agar tetap lolos di atas permukaan
  `muted` `#F1F5F9` — kombinasi yang sebelumnya gagal di 4.34:1.
- **Success (#15803D), Warning (#B45309), Destructive (#B91C1C):** token status.
  Ketiganya lulus ganda: sebagai teks di atas putih (**5.02 / 5.02 / 6.47:1**)
  dan sebagai isian berteks putih. Satu token per status, tidak ada varian
  gelap-terang terpisah.
- **Decorative Amber (#FFC107):** hanya 3.19:1 di atas kartu. **Dilarang** untuk
  teks atau isian berteks. Hanya untuk bintang penilaian dan garis dekoratif.
- **Border (#E2E8F0) / Ring (#C2410C):** cincin fokus terukur **5.18:1** terhadap
  kartu, jauh di atas syarat 3:1 untuk komponen non-teks.

### Palet Dokumen Cetak

Sertifikat dan invoice memakai palet **ivory/gold** tersendiri, bukan palet
aplikasi. Ini disengaja: keduanya artefak seremonial, dan warna crimson/navy
berkesan digital. Nilainya tinggal di `src/lib/dokumen/token-cetak.ts` karena
React-PDF tidak bisa memakai CSS variable.

Yang diambil dari DESIGN.md adalah **aturannya**, bukan warnanya: satu token per
peran, warna hanya jadi teks bila lulus AA, dan token dekoratif dilarang jadi
teks.

| Token | Nilai | Peran | Rasio terukur |
|-------|-------|-------|---------------|
| `ink` | `#1C1917` | Judul & isi | 17.49:1 AAA |
| `inkSoft` | `#44403C` | Teks pendukung | 10.27:1 AAA |
| `brown` | `#854D0E` | Identitas lembaga, angka penting | 6.85:1 AA |
| `gray` | `#57534E` | Teks kecil & label | 7.63:1 AAA |
| `grayLight` | `#6B6259` | Catatan kaki | 5.97:1 AA |
| `grayMid` | `#78716C` | Label pada permukaan ivory | 4.80:1 AA |
| `gold` | `#D49A28` | **Dekoratif saja** — bingkai, garis, bintang | 2.48:1 **dilarang jadi teks** |

Nilai `#A8A29E` (2.52:1) yang sebelumnya dipakai untuk catatan kaki sudah
**dihapus** karena gagal WCAG AA untuk teks.

## Typography

Dua keluarga, satu pembagian tugas yang tidak pernah dilanggar.

- **Montserrat** untuk semua judul (`display`, `h1`–`h3`). Bobot 700–800 dengan
  letter-spacing rapat (`-0.02em` s.d. `-0.025em`) supaya judul terbaca padat.
- **Inter** untuk seluruh isi, label, tabel, dan angka. Dinonaktifkan
  `font-feature-settings` alternatif agar angka rupiah rata kolom.

Tangga ukuran dipakai konsisten: `display` hanya di judul hero beranda (dan
hanya pada breakpoint `lg` ke atas — di layar kecil judul memakai `h1` yang
mengecil), `h1` di judul halaman, `h2` judul bagian, `h3` judul kartu. **Jangan
memakai lebih dari satu ukuran judul per tingkat.** Teks sekunder selalu
`body-sm` atau `caption` dengan `muted-foreground` — bukan warna mentah, dan
bukan ukuran yang lebih kecil dari `caption` (0.75rem) karena sudah batas
keterbacaan.

Judul memakai `text-wrap: balance` (diatur di `globals.css`) agar baris terakhir
tidak menggantung satu kata pada judul panjang.

## Layout

- **Lebar isi:** maksimum `7xl` (80rem / 1280px) dipusatkan, dengan gutter `16px`
  di mobile dan `24px` mulai `sm`. Blok teks panjang dibatasi `max-w-2xl` agar
  baris tidak melebihi ~75 karakter.
- **Ritme bagian:** jarak antar-bagian `4xl` (112px) di desktop dan `3xl` (64px)
  di mobile. Jarak di dalam bagian memakai `md`/`lg`; tidak ada nilai sembarang.
- **Kisi kartu:** 1 kolom di mobile, 2 mulai `sm`, 3 mulai `lg`. Kartu dalam satu
  baris selalu sama tinggi (`h-full` + `flex-col`), dengan aksi didorong ke bawah
  oleh `mt-auto`.
- **Target sentuh:** setiap elemen interaktif minimal 44×44px, termasuk tombol
  ikon. Tombol kepadatan `sm` (36px) hanya untuk aksi sekunder di dalam header
  atau tabel, tidak pernah untuk aksi utama halaman.
- **Header lengket:** tinggi tetap 4.5rem, dibukukan sebagai `--tinggi-header`.
  Setiap anchor bagian memakai `scroll-mt-24` supaya judul tidak tertutup header.

## Elevation & Depth

Kedalaman dipakai untuk memisahkan, bukan menghias. **Permukaan default adalah
datar**: kartu dan tombol hanya memakai border 1px tanpa bayangan. Hanya dua
tingkat bayangan yang dipakai:

| Tingkat | Nilai | Penggunaan |
|---------|-------|------------|
| Datar | tanpa bayangan, `border` 1px | **Default** untuk kartu, tombol, dan panel |
| Terangkat | `shadow-sm` | Elemen lengket dan elemen yang benar-benar mengambang di atas konten |
| Melayang | `shadow-md` | Hanya saat elemen disorot atau berdiri di atas konten bergulir |

Tombol **tidak** memakai bayangan. Tidak ada gradien dekoratif, glassmorphism,
bayangan ganda, atau efek blur pada permukaan. `prefers-reduced-motion`
mematikan semua transisi dan animasi.

## Shapes

Sudut kecil dan tegas. Skala ini dipilih agar sudut tidak pernah terlihat
"menggelembung" pada kartu besar:

- `sm` (4px) — kontrol terkecil: lencana, kartu bersarang, penanda.
- `md` (6px) — **bentuk default**: tombol, input, panel peringatan.
- `lg` (8px) — kartu dan panel.
- `xl` (12px) — permukaan besar yang berdiri sendiri seperti hero dan blok ajakan.
- `2xl` (16px) — hanya untuk blok sorotan khusus seperti kartu galeri.
- `full` — hanya avatar dan titik penanda.

Satu kartu memakai satu radius. Radius tidak boleh dicampur di dalam satu baris
kartu, dan media di dalam kartu tidak boleh memakai radius sendiri. Radius
`full` dilarang untuk kartu maupun tombol — hanya untuk elemen bulat.

## Components

Komponen adalah kontrak, bukan saran. Setiap permukaan memakai varian di bawah
alih-alih menulis kelas warna sendiri.

- **`button-primary`** — tepat satu per layar pada area yang terlihat. Ini
  jalur konversi utama (mis. "Lihat Program Kelas").
- **`button-gold`** — jalur bernilai: daftar kelas, lanjutkan pembayaran,
  hubungi WhatsApp. Boleh muncul beberapa kali karena mewakili satu tindakan.
- **`button-outline` / `button-ghost`** — pendamping. Tidak pernah menjadi aksi
  tunggal di sebuah bagian.
- **`button-brand`** — khusus aksi yang menyentuh identitas lembaga, mis.
  mengunduh sertifikat.
- **`card`** — selalu komposisi penuh: `CardHeader` (judul + deskripsi),
  `CardContent`, `CardFooter` untuk aksi. Jangan menumpuk semua isi di satu
  `CardContent`.
- **`badge-*`** — satu-satunya cara menampilkan status. Varian dipetakan
  langsung ke status domain: sukses (hadir, lunas), warning (menunggu, sisa
  kuota), destructive (penuh, dibatalkan, gagal), neutral (nonaktif).
- **`alert-*`** — satu-satunya bentuk panggilan perhatian. Jangan membuat `div`
  bergaya sendiri untuk pesan sistem.
- **`input`** — tinggi 44px, border `input`, cincin fokus `ring`. Validasi
  memakai `data-invalid` pada pembungkus dan `aria-invalid` pada kontrol.

## Do's and Don'ts

**Lakukan**

- Ambil setiap warna dari token semantik: `bg-primary`, `text-muted-foreground`,
  `border-border`. Ganti tema berarti mengubah `globals.css` saja.
- Pakai `gap-*` untuk jarak, termasuk susunan vertikal (`flex flex-col gap-4`).
- Pakai `size-*` bila lebar sama dengan tinggi (`size-10`, bukan `w-10 h-10`).
- Pakai `truncate` alih-alih tiga kelas pemotong teks.
- Pakai `cn()` untuk kelas bersyarat.
- Sediakan keadaan kosong yang jujur lewat komponen `Empty`.

**Jangan**

- Jangan menulis warna mentah Tailwind (`bg-zinc-100`, `text-slate-600`,
  `border-zinc-200`) atau heksadesimal langsung di `className`. Nilai seperti itu
  memutus tautan ke berkas ini dan itulah penyebab tampilan berbeda antar halaman.
- Jangan memakai `space-x-*` atau `space-y-*`; pakai `gap-*`.
- Jangan menimpa warna atau tipografi komponen lewat `className`; ubah token atau
  pakai varian.
- Jangan memakai `decorative-amber` untuk teks atau latar berteks.
- Jangan menambahkan `dark:` manual — token sudah menangani tema.
- Jangan menaruh `z-index` manual pada komponen overlay.
- Jangan membuat lencana, keadaan kosong, notifikasi, atau pemisah sendiri dari
  `div` bergaya; pakai `Badge`, `Empty`, `Alert`, `Separator`.
- Jangan menampilkan testimoni, foto, logo, angka, atau klaim yang tidak punya
  sumber yang dapat diperiksa.
