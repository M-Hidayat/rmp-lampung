# Sistem RMP Lampung

Aplikasi web untuk mengotomatiskan operasional kursus makanan **RMP - Pelatihan
Bisnis Kuliner** di Bandar Lampung: akun peserta, katalog kelas, pendaftaran,
pembayaran melalui Pakasir, invoice, absensi satu kali berbasis QR, sertifikat,
operasi admin, dan laporan pemilik.

Seluruh teks antarmuka, pesan validasi, dokumen PDF, data contoh, dan
dokumentasi memakai Bahasa Indonesia. Nama teknis framework tetap mengikuti
konvensi ekosistemnya.

## 1. Tumpukan teknologi

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Antarmuka | Tailwind CSS 4 + komponen bergaya shadcn/ui |
| Basis data | PostgreSQL 16 (Docker Compose) |
| ORM | Prisma 6 |
| Autentikasi | Auth.js (NextAuth v5) credentials, sesi JWT |
| Validasi | Zod (di batas server) |
| Pembayaran | Adapter internal Pakasir (redirect + webhook) |
| Dokumen | @react-pdf/renderer (invoice & sertifikat), qrcode (QR) |
| Pengujian | Vitest |

## 2. Peran dan kemampuan

| Peran | Kemampuan |
| --- | --- |
| `USER` | Mendaftar kelas, membayar, absen satu kali, mengakses invoice & sertifikat miliknya |
| `ADMIN` | Mengelola kelas, peserta, pembayaran, sesi absensi, kehadiran, dan sertifikat |
| `PEMILIK` | Mewarisi seluruh kemampuan admin + laporan bisnis + kelola akun admin + audit sertifikat |

Otorisasi diberlakukan berlapis: middleware/layout, route handler & server
action, filter kueri basis data, dan validasi di layanan domain. Menyembunyikan
tombol di UI **bukan** kontrol keamanan.

## 3. Struktur proyek

```
prisma/                     skema basis data + seed
src/app/(publik)/           beranda, profil, katalog kelas, cara pendaftaran, kontak, verifikasi sertifikat
src/app/(autentikasi)/      masuk & daftar
src/app/(dashboard)/user/   dashboard peserta
src/app/(dashboard)/admin/  dashboard admin
src/app/(dashboard)/pemilik/ dashboard pemilik
src/app/api/                webhook Pakasir, scan absensi, registrasi, PDF invoice & sertifikat
src/lib/layanan/            aturan bisnis (dapat diuji tanpa rendering)
src/lib/integrasi/pakasir.ts adapter pembayaran (sandbox & produksi)
src/lib/dokumen/            template PDF invoice & sertifikat
dokumentasi/identitas-rmp.md fakta identitas + sumber + placeholder
```

Route handler dan server action hanya menjadi batas HTTP/UI. Aturan bisnis
berada di `src/lib/layanan/*` sehingga dapat diuji tanpa merender halaman.

## 4. Menjalankan secara lokal

```bash
# 1. Dependensi
npm install

# 2. Variabel lingkungan
cp .env.example .env      # lalu sesuaikan nilainya

# 3. Basis data PostgreSQL (Docker)
npm run db:up

# 4. Klien Prisma + migrasi
npx prisma generate
npm run db:migrate

# 5. Data awal
npm run db:seed

# 6. Pengembangan
npm run dev               # http://localhost:3000
```

> Catatan: `npx prisma generate` perlu dijalankan sekali sebelum `npm test`
> karena beberapa layanan mengimpor tipe dari `@prisma/client`.

### Perintah gerbang (wajib lulus)

```bash
npm run lint
npm run typecheck
npm test
npm run build
# atau seluruhnya sekaligus:
npm run gerbang
```

Uji integrasi berbasis basis data dijalankan terpisah dengan basis data uji
terisolasi di port 5433:

```bash
docker compose up -d db-uji
TEST_DATABASE_URL=postgresql://rmp:rmp_dev_password@localhost:5433/rmp_lampung_uji \
  npx prisma migrate deploy
npm run test:integrasi
```

## 5. Variabel lingkungan

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | ya | Koneksi PostgreSQL utama |
| `TEST_DATABASE_URL` | tidak | Basis data uji terisolasi (mengaktifkan uji integrasi) |
| `AUTH_SECRET` | ya | Rahasia penandatanganan sesi JWT |
| `PAKASIR_MODE` | ya | `sandbox` (default) atau `produksi` |
| `PAKASIR_SLUG` | ya | Slug proyek Pakasir |
| `PAKASIR_API_KEY` | ya | Kunci API Pakasir |
| `PAKASIR_BASE_URL` | ya | Basis URL Pakasir |
| `PAKASIR_WEBHOOK_SECRET` | mode produksi | Rahasia bersama untuk header webhook |
| `APP_URL` | ya | `http://localhost:3000` saat pengembangan |
| `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD` | ya | Akun pemilik awal |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | tidak | Akun admin contoh |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | tidak | Akun peserta contoh |
| `SERTIFIKAT_PENANDATANGAN` | tidak | Nama penandatangan sertifikat (default placeholder) |
| `SERTIFIKAT_JABATAN_PENANDATANGAN` | tidak | Jabatan penandatangan |

Seluruh rahasia hanya dibaca di sisi server. Kata sandi tidak pernah dicatat ke
log dan hanya disimpan sebagai hash bcrypt (cost 12).

## 6. Kredensial data awal (khusus pengembangan)

| Peran | Email | Kata sandi |
| --- | --- | --- |
| `PEMILIK` | `pemilik@contoh.rmp-lampung.test` | `PemilikContoh123!` |
| `ADMIN` | `admin@contoh.rmp-lampung.test` | `AdminContoh123!` |
| `USER` | `peserta@contoh.rmp-lampung.test` | `PesertaContoh123!` |

**Wajib diganti sebelum produksi.** Seed juga membuat beberapa kelas contoh yang
seluruh judulnya diawali `CONTOH -` agar tidak tertukar dengan penawaran resmi.

## 7. Alur inti

1. **Registrasi** — validasi Zod, kata sandi di-hash, peran selalu `USER`.
2. **Pendaftaran kelas** — satu transaksi memeriksa kelas aktif, jadwal,
   pendaftaran ganda, dan kuota; menghasilkan `Enrollment(PENDING)` +
   `Payment(PENDING)` + URL redirect Pakasir.
3. **Webhook Pakasir** — verifikasi autentikasi webhook → pencarian
   `pakasirRef` → pencocokan nominal → pemetaan status eksplisit → perubahan
   dalam transaksi → `PAID` hanya pada status sah → invoice idempoten lewat
   constraint unik. Payload mentah diarsipkan setelah field sensitif dibuang.
   Redirect pengguna **bukan** bukti pembayaran.
4. **Absensi** — admin membuka sesi per kelas; token acak kuat berumur pendek
   (hanya hash yang disimpan) ditampilkan sebagai QR dan dapat diperbarui. Scan
   memeriksa login, token & masa berlaku, sesi aktif, kecocokan kelas,
   kepemilikan pendaftaran, status `PAID`, dan belum adanya kehadiran; dijamin
   sekali oleh `UNIQUE(enrollmentId)`.
5. **Invoice** — hanya setelah pembayaran valid; PDF dibuat dari snapshot;
   endpoint memeriksa kepemilikan atau peran operasional.
6. **Sertifikat** — hanya untuk pendaftaran `PAID` yang memiliki kehadiran; PDF
   memuat identitas terverifikasi, penandatangan dari konfigurasi, dan QR
   verifikasi. Verifikasi publik hanya menampilkan nomor, nama, kelas, tanggal
   terbit, dan status valid/dibatalkan.

## 8. Jejak audit

Transaksi, kehadiran, invoice, dan sertifikat **tidak dapat dihapus dari UI**.
Kelas dinonaktifkan, pendaftaran dibatalkan, sertifikat menyimpan `revokedAt`,
dan akun admin dinonaktifkan — bukan dihapus.

## 9. Pengujian

Uji unit (tanpa basis data) mencakup: normalisasi nominal, matriks kemampuan per
peran dan isolasi dokumen, registrasi & hashing, format nomor dokumen, token
absensi (hanya hash, pencocokan, masa berlaku), adapter Pakasir (URL, pemetaan
status, pembersihan payload, verifikasi webhook), webhook (idempotensi, nominal
berbeda, transisi ilegal, invoice sekali), serta aturan sertifikat.

Uji integrasi (butuh `TEST_DATABASE_URL`) mencakup pendaftaran ganda, kelas
penuh, absensi belum bayar, token kedaluwarsa, dan absensi kedua.

## 10. Keputusan eksplisit

1. Versi Next.js tidak diturunkan.
2. Redirect pengguna bukan bukti pembayaran; hanya webhook (dan konfirmasi API
   pada mode produksi) yang mengubah status menjadi `PAID`.
3. Satu pendaftaran per pengguna per kelas.
4. Satu kehadiran per pendaftaran, dijamin constraint basis data.
5. Konten brand produksi menunggu verifikasi pemilik; lihat
   `dokumentasi/identitas-rmp.md`.
6. Penghapusan transaksi berada di luar ruang lingkup.
7. Integrasi Pakasir produksi hanya diaktifkan setelah kontrak dan kredensial
   resmi tersedia; default proyek adalah mode sandbox.
