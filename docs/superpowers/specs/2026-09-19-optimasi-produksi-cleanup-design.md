# Desain Optimasi Produksi dan Cleanup RMP Lampung

Tanggal: 19 September 2026
Status: Disetujui secara prinsip; menunggu tinjauan dokumen

## Tujuan

Merapikan aplikasi RMP Lampung untuk penggunaan produksi dengan menghapus mekanisme demo dan tooling lokal yang tidak diperlukan, memperbaiki pengalaman loading, serta mengurangi beban rendering tanpa mengubah kontrak bisnis inti.

## Ruang lingkup

### 1. Penghapusan data dan fasilitas demo

- Hapus `prisma/seed.ts` beserta konfigurasi Prisma seed dan script `db:seed`.
- Hapus seluruh variabel `SEED_*` dari `.env.example` dan `.env` lokal.
- Hapus kredensial dan tombol pengisian otomatis akun demo dari halaman login.
- Hapus route `/simulasi-pembayaran` beserta komponen khusus route tersebut.
- Hapus mode adapter pembayaran yang bergantung pada simulator internal; alur produksi tetap memakai Pakasir.
- Hapus referensi seed, akun demo, dan simulator dari README serta dokumentasi proyek.
- Hapus atau sesuaikan tes yang secara langsung bergantung pada seed/simulator hanya sebagai konsekuensi cleanup sumber. Test suite tidak akan dijalankan sesuai instruksi pengguna.

Instalasi baru tidak membuat akun pemilik secara otomatis. Provisioning akun awal menjadi prosedur operasional terpisah dan berada di luar ruang lingkup ini.

### 2. Penghapusan tooling dan artefak yang tidak sesuai produksi

- Hapus script `tunnel` dan `tunnel:localtunnel`.
- Hapus dependensi `localtunnel` dan perbarui lockfile melalui npm.
- Hapus artefak lokal `.next` dan `tsconfig.tsbuildinfo`.
- Audit aset dan source file; hapus hanya file yang terbukti tidak memiliki referensi dan bukan bagian kontrak produksi.
- Pertahankan migrasi Prisma, dokumentasi arsitektur, dan tooling pengembangan yang masih dibutuhkan untuk build atau operasi produksi.

### 3. Loading UI dan optimasi gambar

- Tambahkan `loading.tsx` berbentuk skeleton pada segment route yang memuat data atau memiliki perpindahan halaman yang terasa lambat.
- Skeleton mengikuti dimensi dan struktur halaman untuk mengurangi cumulative layout shift.
- Gunakan spinner hanya untuk aksi interaktif singkat; tidak menggunakan overlay loader global.
- Pertahankan seluruh gambar melalui `next/image`.
- Tandai hanya gambar hero/LCP dengan prioritas tinggi.
- Berikan `sizes` yang sesuai untuk gambar responsif.
- Gunakan static import dan blur placeholder pada aset lokal ketika didukung tanpa kompleksitas tambahan.
- Pertahankan dimensi atau aspect ratio agar ruang gambar tersedia sebelum unduhan selesai.
- Gambar di bawah fold tetap menggunakan lazy loading bawaan.

### 4. Rendering dan bundle

- Server Component tetap menjadi default.
- Persempit batas `"use client"` bila komponen statis ikut masuk client bundle tanpa kebutuhan interaksi.
- Muat scanner, QR live, dan UI berat lain hanya pada route yang membutuhkannya.
- Hapus import, komponen, dan dependensi mati yang terbukti tidak digunakan.
- Paralelkan operasi data independen yang saat ini berjalan serial.
- Jangan menambahkan cache pada autentikasi, otorisasi, pembayaran, absensi, atau data transaksi yang harus mutakhir.
- Jangan menambah dependency loader atau skeleton; gunakan React, Next.js, dan CSS/Tailwind yang sudah tersedia.

### 5. Redesign terarah

Redesign diperbolehkan hanya pada bagian yang terbukti lambat atau usang:

- login setelah UI demo dihapus;
- empty state setelah data seed tidak lagi tersedia;
- hierarchy, skeleton, dan containment dashboard/tabel yang berat;
- feedback loading untuk navigasi dan aksi pengguna.

Tidak ada perubahan pada model otorisasi empat tingkat, kontrak webhook Pakasir produksi, aturan absensi, invoice, sertifikat, atau struktur navigasi utama kecuali diperlukan untuk menghapus fitur demo.

## Data flow setelah cleanup

1. Database baru dimulai tanpa data demo atau akun otomatis.
2. Akun awal disediakan melalui prosedur operasional di luar aplikasi.
3. Admin membuat kelas nyata melalui dashboard.
4. Peserta mendaftar melalui alur produksi.
5. Pembayaran diarahkan ke Pakasir dan status hanya berubah melalui webhook/API yang sah.
6. Halaman tanpa data menampilkan empty state, bukan konten contoh.

## Error handling dan keamanan

- Tidak ada kredensial hardcoded di source, dokumentasi, atau UI.
- Penghapusan simulator tidak boleh membuat mode produksi jatuh kembali ke URL lokal.
- Konfigurasi Pakasir yang tidak lengkap harus gagal secara eksplisit, bukan diam-diam menggunakan data contoh.
- Loading state tidak boleh menutupi pesan error atau mengunci navigasi tanpa batas.
- Penghapusan file dilakukan berdasarkan referensi nyata, bukan nama yang tampak tidak perlu.

## Batasan verifikasi

Atas instruksi pengguna, agen tidak menjalankan:

- Vitest;
- Playwright;
- pengujian browser/manual;
- audit performa otomatis.

Baseline sebelum perubahan telah mencatat TypeScript lulus dan Vitest memiliki 65 tes lulus serta 2 kegagalan integration akibat record attendance yang tersisa. Hasil tersebut tidak akan digunakan sebagai klaim bahwa implementasi akhir lulus pengujian.

Pengguna akan melakukan pengujian akhir sendiri. Agen tidak akan mengklaim fitur telah teruji, bebas regresi, atau siap produksi tanpa hasil pengujian tersebut.

## Non-goals

- Membuat sistem provisioning akun pemilik baru.
- Mengubah skema RBAC atau aturan bisnis.
- Mengganti penyedia pembayaran.
- Menambah library optimasi baru.
- Melakukan redesign menyeluruh pada halaman yang tidak bermasalah.
- Menjalankan atau memperbaiki test suite.

## Kriteria selesai implementasi

- Mekanisme seed dan seluruh kredensial demo tidak lagi ada.
- Simulator pembayaran dan tooling tunnel lokal tidak lagi ada.
- Lockfile konsisten dengan dependency yang tersisa.
- Dokumentasi tidak mengarahkan pengguna ke fitur yang dihapus.
- Route penting memiliki loading state proporsional bila memang melakukan data fetching.
- Gambar memiliki konfigurasi responsive loading yang tepat.
- Tidak ada penambahan dependency untuk loader/skeleton.
- Perubahan tidak sengaja mengubah kontrak bisnis produksi.
- Status akhir dilaporkan sebagai belum diuji oleh agen, sesuai permintaan pengguna.
