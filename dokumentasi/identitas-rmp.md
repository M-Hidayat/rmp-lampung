# Verifikasi Identitas RMP Lampung

Dokumen ini mencatat fakta yang **berhasil diverifikasi dari sumber publik** dan
fakta yang **belum dapat diverifikasi**. Aturannya tegas: apa pun yang tidak
ditemukan sumbernya tetap ditulis sebagai placeholder eksplisit dan tidak
pernah dikarang. Tanggal penelusuran: **18 Agustus 2026**.

## 1. Fakta terverifikasi

| Aspek | Nilai | Sumber |
| --- | --- | --- |
| Nama usaha | RMP - Pelatihan Bisnis Kuliner (Rumah Masyarakat Pintar) | Halaman Facebook resmi: https://www.facebook.com/rumahmasyarakatpintar.rmp/ |
| Jenis kursus | Pelatihan masakan, roti, kue, dan minuman; kelas tatap muka maupun online | Bagian "About" halaman Facebook di atas |
| Lokasi | Jl. Kapten Abdul Haq No. 03, Rajabasa, Kota Bandar Lampung, Lampung 35141 | Peta Waze: https://www.waze.com/id/live-map/directions/id/lampung/rmp-pelatihan-bisnis-kuliner-(kursus-kue,-masakan-dan-minuman) |
| Nomor telepon / WhatsApp | +62 811-7970-171 — https://api.whatsapp.com/send?phone=628117970171 | Kontak pada halaman Facebook |
| Email kontak | didikkominfolpg@gmail.com | Kontak pada halaman Facebook |
| Instagram | https://www.instagram.com/rmp_pintar/ | Profil Instagram resmi |
| TikTok | https://www.tiktok.com/@rmp_pintar | Profil TikTok resmi |
| Kelas pernah ditawarkan: Pelatihan Usaha Mie Ayam | Terbukti pernah dijalankan | https://www.facebook.com/rumahmasyarakatpintar.rmp/videos/pelatihan-usaha-mie-ayam/4180165805643857/ |
| Kelas pernah ditawarkan: Pelatihan Usaha Bakso | Terbukti pernah dijalankan | https://www.tiktok.com/@ainifortuna/video/7351021743101709574 |
| Kelas pernah ditawarkan: Kue & Masakan | Terbukti pernah dijalankan | https://www.tiktok.com/@ainifortuna/video/7504509089720896786 |
| Pola pendaftaran publik | Pendaftaran dilakukan melalui pesan WhatsApp / direct message ke akun media sosial, dikonfirmasi manual oleh pengelola | Ajakan "hubungi WhatsApp" pada Facebook, Instagram, dan TikTok di atas |

### Catatan ketidakcocokan sumber

- Nomor jalan ditemukan dalam dua varian pada sumber pihak ketiga: **No. 03**
  (Waze) dan **No. 50** (agregator peta lain). Sistem memakai varian Waze dan
  mencatat varian lain sebagai catatan, bukan sebagai fakta yang dipastikan.
  Alamat wajib dikonfirmasi ulang ke pemilik sebelum dipakai di produksi.

## 2. Belum terverifikasi (placeholder eksplisit)

Semua item berikut **tidak** dikarang di dalam aplikasi. Nilai yang tampil di
UI/PDF adalah placeholder bertanda `[PLACEHOLDER: ...]` atau berasal dari
variabel lingkungan yang harus diisi pemilik.

| Aspek | Status | Cara mengisi |
| --- | --- | --- |
| Logo/identitas visual resmi | Tidak tersedia sebagai berkas resmi | Pemilik mengunggah berkas logo, lalu ganti placeholder pada header dan PDF |
| Badan usaha / legalitas (PT, CV, NIB) | Tidak ditemukan sumber publik | Isi setelah pemilik memberikan dokumen resmi |
| Harga resmi tiap kelas | Tidak dipublikasikan konsisten | Admin mengisi harga di dashboard admin; data seed hanya contoh |
| Situs web resmi | Tidak ditemukan | Isi bila tersedia |
| Jam operasional | Tidak ditemukan | Isi bila tersedia |
| Nama & jabatan penandatangan sertifikat | Belum dikonfirmasi | Variabel `SERTIFIKAT_PENANDATANGAN` dan `SERTIFIKAT_JABATAN_PENANDATANGAN` |
| Testimoni peserta | Tidak dipakai | Tidak boleh dibuat tanpa izin dan bukti asli |

## 3. Aturan penggunaan data identitas

1. Tidak ada logo, alamat, kontak, testimoni, sejarah, atau klaim prestasi yang
   dibuat-buat. Semua yang tampil harus punya baris di tabel bagian 1, atau
   ditandai placeholder di bagian 2.
2. Seluruh data awal (seed) diberi awalan `CONTOH -` supaya tidak pernah
   tertukar dengan penawaran kelas resmi.
3. Sebelum rilis produksi, pemilik wajib mengonfirmasi: alamat final, harga
   final, logo, penandatangan sertifikat, dan kredensial Pakasir resmi.
4. Nilai terpusat pada `src/lib/identitas-rmp.ts`; setiap fakta memiliki medan
   `sumber` dan `catatan` agar dapat diaudit dari kode.
