# Desain One-Page Beranda Profesional RMP Lampung

**Tanggal:** 21 September 2026  
**Status:** Menunggu tinjauan pengguna

## 1. Tujuan

Mengubah halaman utama RMP menjadi landing page satu halaman yang rapi, profesional, dan mudah dipahami oleh pemula serta calon pelaku usaha kuliner. Halaman harus mengarahkan pengunjung dari pengenalan singkat menuju pemilihan kelas dan pendaftaran tanpa klaim bisnis yang tidak dapat diverifikasi.

## 2. Cakupan

### Masuk ke halaman utama

- Beranda/hero
- Keunggulan pelatihan
- Program atau kelas terdekat
- Cara pendaftaran
- Tentang RMP
- Kontak dan lokasi
- Ajakan bertindak penutup

### Tetap menjadi halaman khusus

- Katalog lengkap `/kelas`
- Detail kelas `/kelas/[slug]`
- Pembuatan akun `/daftar`
- Masuk akun `/masuk`
- Verifikasi sertifikat `/verifikasi`
- Dashboard peserta dan admin
- Halaman publik lama tetap dapat diakses melalui URL langsung untuk menjaga kompatibilitas; navigasi utama tidak lagi mengandalkannya.

## 3. Audiens dan pesan utama

Audiens utama adalah pemula dan calon pelaku usaha kuliner yang membutuhkan keterampilan praktis untuk bekerja atau memulai usaha.

Pesan utama:

> Pelatihan kuliner berbasis praktik untuk membantu pemula membangun keterampilan, memahami proses produksi, dan mempersiapkan langkah awal menuju dunia kerja atau usaha.

Bahasa menggunakan Bahasa Indonesia yang natural, ringkas, dan profesional. Hindari jargon teknis, kalimat promosi berlebihan, serta klaim seperti “terbaik”, “pasti sukses”, “bersertifikat resmi”, fasilitas tertentu, atau pengalaman instruktur yang belum memiliki sumber terverifikasi.

## 4. Struktur halaman

### 4.1 Navigasi lengket

- Identitas teks RMP di kiri.
- Menu desktop: Beranda, Program, Cara Daftar, Tentang, Kontak.
- Menu mengarah ke anchor `#beranda`, `#program`, `#cara-daftar`, `#tentang`, dan `#kontak` pada `/`.
- Tombol Masuk dan Daftar/Dashboard tetap tersedia sesuai status sesi.
- Menu mobile menggunakan tombol yang dapat dioperasikan melalui keyboard, memiliki label aksesibel, dan menutup setelah tautan dipilih.
- Setiap section memakai `scroll-margin-top` agar judul tidak tertutup header lengket.

### 4.2 Hero

- Eyebrow: “Pelatihan Bisnis Kuliner di Bandar Lampung”.
- Judul manfaat yang realistis, berfokus pada belajar melalui praktik dan menyiapkan langkah kerja atau usaha.
- Paragraf ringkas yang menjelaskan ragam kursus masakan, roti, kue, dan minuman.
- CTA utama: “Lihat Program Kelas” menuju `#program`.
- CTA sekunder: “Konsultasi via WhatsApp” menuju kanal terverifikasi.
- Foto kuliner yang sudah tersedia tetap digunakan dengan overlay atau framing yang sederhana.
- Panel fakta ringkas hanya memakai data terverifikasi, misalnya lokasi Bandar Lampung dan pilihan kelas tatap muka/online.

### 4.3 Keunggulan

Tiga kartu singkat tanpa statistik atau klaim yang dibuat-buat:

1. **Belajar lebih terarah** — materi dan jadwal disajikan jelas pada setiap kelas.
2. **Proses berbasis praktik** — komunikasi menekankan pengembangan keterampilan yang dapat diterapkan.
3. **Administrasi dalam satu sistem** — pendaftaran, status pembayaran, absensi, invoice, dan sertifikat dikelola melalui akun peserta sesuai ketersediaannya.

Bagian ini menjelaskan nilai sistem tanpa menjanjikan hasil pekerjaan atau keberhasilan usaha.

### 4.4 Program terdekat

- Menampilkan maksimal tiga kelas aktif dari database.
- Setiap kartu berisi judul, deskripsi pendek, biaya, jadwal, lokasi, sisa kuota, dan tautan detail.
- Jika belum ada kelas, tampilkan empty state yang tenang serta tombol menuju kontak WhatsApp.
- Tautan “Lihat semua kelas” tetap menuju katalog lengkap `/kelas`.

### 4.5 Cara pendaftaran

Alur diringkas menjadi empat tahap yang mudah dipindai:

1. Pilih kelas dan periksa jadwal serta biaya.
2. Buat akun lalu kirim pendaftaran.
3. Selesaikan pembayaran melalui kanal yang tersedia dan tunggu konfirmasi sistem.
4. Ikuti kelas; invoice dan sertifikat tersedia sesuai status pembayaran, kehadiran, dan penerbitan admin.

CTA mengarah ke `/kelas` atau `/daftar`. Detail teknis webhook dan aturan internal tidak ditampilkan di landing page.

### 4.6 Tentang RMP

- Memperkenalkan RMP sebagai penyedia pelatihan bisnis kuliner di Bandar Lampung.
- Menyebut jenis kursus yang terverifikasi: masakan, roti, kue, dan minuman serta format tatap muka/online.
- Tidak memuat sejarah, jumlah alumni, akreditasi, testimoni, atau sertifikasi lembaga sebelum datanya disediakan dan diverifikasi.
- Tautan opsional “Lihat informasi lembaga” tetap menuju `/profil` untuk rincian sumber data.

### 4.7 Kontak

- Alamat, telepon/WhatsApp, email, dan media sosial diambil dari `identitas-rmp.ts`.
- WhatsApp menjadi CTA utama.
- Tautan eksternal dibuka aman dengan `noopener noreferrer`.
- Tidak menambahkan peta sematan karena koordinat/alamat final masih memerlukan konfirmasi pemilik.

### 4.8 CTA penutup

Ajakan sederhana untuk memilih kelas yang sesuai, dengan tombol ke katalog dan WhatsApp. Tidak menggunakan penghitung waktu, pop-up, atau pola urgensi palsu.

## 5. Arah visual

- Gaya: akademi kuliner profesional, bersih, modern, dan terpercaya.
- Palet mengikuti desain yang ada: putih/abu sangat muda sebagai kanvas, charcoal untuk teks dan struktur, oranye hangat untuk CTA dan aksen penting.
- Tipografi: Montserrat untuk heading dan Inter untuk isi.
- Hierarki: satu H1, heading section konsisten, lebar baca terkendali, dan ruang putih cukup.
- Kartu memakai border halus, radius konsisten, dan shadow minimal.
- Ikon hanya dari Lucide; tidak memakai emoji sebagai elemen antarmuka.
- Foto tidak diberi efek berlebihan. Animasi dibatasi pada transisi ringan dan menghormati `prefers-reduced-motion`.
- Layout mobile-first tanpa horizontal scroll; target interaksi minimal 44 × 44 px dan kontras teks minimal WCAG AA.

## 6. Arsitektur implementasi

- `src/app/(publik)/page.tsx` menjadi komposisi server-rendered untuk seluruh section dan tetap mengambil kelas aktif melalui `daftarKelasPublik()`.
- `src/app/(publik)/layout.tsx` mengganti daftar tautan lintas halaman menjadi anchor halaman utama.
- `src/components/navigasi-publik.tsx` tetap menangani navigasi desktop/mobile; tautan anchor harus bekerja dari halaman publik lain dengan format `/#section`.
- Data kontak dan identitas hanya bersumber dari `src/lib/identitas-rmp.ts` agar tidak terjadi duplikasi atau perbedaan isi.
- Tidak menambah dependency, state global, carousel, library animasi, atau abstraksi baru yang tidak diperlukan.

## 7. Perilaku dan kondisi gagal

- Kegagalan atau ketiadaan kelas tidak boleh merusak section lain; halaman menampilkan empty state yang jelas.
- Tautan utama harus tetap berfungsi dengan JavaScript dinonaktifkan karena menggunakan anchor dan route standar.
- CTA yang bergantung pada data kontak hanya memakai nilai terverifikasi yang sudah tersedia.
- URL publik lama tidak dihapus dalam perubahan ini untuk menghindari tautan eksternal menjadi rusak.

## 8. SEO, aksesibilitas, dan performa

- Metadata halaman menggambarkan pelatihan bisnis kuliner RMP di Bandar Lampung secara faktual.
- Struktur landmark memakai `header`, `nav`, `main`, `section`, dan `footer` secara semantik.
- Setiap section memiliki heading dan `aria-labelledby` bila diperlukan.
- Foto hero memakai `next/image`, ukuran responsif, alt deskriptif, dan ruang gambar tetap untuk mencegah layout shift.
- Fokus keyboard terlihat dan urutan tab mengikuti urutan visual.
- Tidak menambah JavaScript untuk perilaku yang dapat diselesaikan oleh HTML/CSS native.

## 9. Verifikasi penerimaan

1. Menu Beranda–Kontak menggulir ke section yang benar dari halaman utama dan kembali ke anchor yang benar dari route publik lain.
2. Halaman tetap responsif pada viewport mobile, tablet, dan desktop tanpa overflow horizontal.
3. CTA katalog, detail kelas, daftar, masuk/dashboard, WhatsApp, dan media sosial menuju tujuan yang benar.
4. Kondisi dengan dan tanpa kelas aktif tampil layak.
5. Konten tidak memuat klaim atau data yang belum terverifikasi.
6. Navigasi mobile dapat digunakan dengan keyboard dan memiliki status `aria-expanded` yang benar.
7. Typecheck, unit/domain test, dan Playwright lulus; build digunakan sebagai pemeriksaan tambahan jika lingkungan mendukung.

## 10. Batasan sengaja

- Tidak menghapus route publik lama.
- Tidak menambahkan testimoni, statistik, galeri, blog, peta, atau logo baru tanpa aset/data resmi.
- Tidak mengubah alur backend pendaftaran, pembayaran, absensi, invoice, atau sertifikat.
- Tidak menambah dependency desain maupun animasi.
