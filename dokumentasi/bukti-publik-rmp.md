# Bukti Publik RMP Lampung (Riset Pihak Ketiga)

Dokumen ini mencatat **bukti pihak ketiga** yang ditemukan publik untuk Rumah
Mama Pintar, supaya situs tidak perlu mengarang testimoni. Tanggal penelusuran:
**25 September 2026**. Semua entri dibuka langsung halaman sumbernya (bukan
disimpulkan dari ringkasan mesin pencari), dan tautannya diuji ulang saat deploy.

Sumber masukan dari pemilik:
- Google Maps: `RMP Pelatihan Bisnis Kuliner (Kursus Kue, Masakan dan Minuman)`
- Facebook: https://web.facebook.com/rumahmasyarakatpintar.rmp/
- Instagram: https://www.instagram.com/rmp_pintar/

## 1. Penilaian Google Maps (paling kuat)

Nilai yang terbaca langsung dari halaman peta:

| Aspek | Nilai |
| --- | --- |
| Rating | **4,9 dari 5** |
| Jumlah ulasan | **186** |
| Nama listing | RMP Pelatihan Bisnis Kuliner (Kursus Kue, Masakan dan Minuman) |
| Alamat | Jl. Kapten Abdul Haq No.03, Rajabasa, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35141 |
| Kategori | Kursus & pelatihan kuliner |

Lima ulasan asli dipakai di situs (`ulasanMaps` pada `src/lib/bukti-publik.ts`),
dikutip apa adanya termasuk salah tulisnya:

| Pengulas | Waktu | Inti |
| --- | --- | --- |
| M. Al Fatih & Gian | 3 tahun lalu | Diajari detail dari basic sampai bisa; dibimbing via WA |
| Ayu Suchesty | 4 tahun lalu | Menambah ilmu, teman, dan penghasilan |
| Erni Dwi rahmawati | 3 tahun lalu | Coach sabar, resep diberikan tanpa rahasia |
| Diesrontje Lahawia | 3 tahun lalu | Banyak ilmu kuliner; Local Guide 25 ulasan |
| fenti andriyani | 3 tahun lalu | Instruktur baik dan ramah |

## 2. Profil Instagram resmi

| Aspek | Nilai |
| --- | --- |
| Nama | RMP PINTAR |
| Akun | @rmp_pintar |
| Pengikut | 25,7 rb |
| Postingan | 5.514 |
| Bio | Baking and Course — Informasi jadwal kelas **WA 08117970171** |

Bio Instagram mengonfirmasi nomor WA yang sama dengan halaman Facebook.

## 3. Liputan pihak ketiga (dipakai di situs)

| Penerbit | Judul | Tanggal | URL |
| --- | --- | --- | --- |
| SMAN 13 Bandar Lampung | Kunjungan SMAN 13 Bandar Lampung ke RMP sebagai bagian dari Program Double Track | 18 Jan 2025 | https://sman13bdl.sch.id/informasi/publikasi/kunjungan-sman13-bandar-lampung-ke-rmp-rumah-mama-pintar-sebagai-bagian-dari-program-double-track |
| Monologis.id | IIPG Lampung Tengah Dorong Perempuan Kembangkan Keterampilan | 20 Sep 2026 | https://monologis.id/iipg-lampung-tengah-dorong-perempuan-kembangkan-keterampilan |
| Travel2Lampung | Aneka Pelatihan Usaha Kuliner di Rumah Mama Pintar | 20 Apr 2020 | https://travel2lampung.com/aneka-pelatihan-usaha-kuliner-di-rumah-mama-pintar/ |

## 4. Sumber yang TIDAK dipakai beserta alasannya

| Sumber | Alasan |
| --- | --- |
| Facebook (`web.facebook.com/...`) | Balasan HTTP **400** untuk akses otomatis. Isi halaman tidak dapat diverifikasi ulang saat deploy; kontaknya sudah terwakili oleh Instagram dan Google Maps. |
| Tribun News Lampung — "Srikandi PLN UID Lampung Gelar Kursus Memasak..." (14 Nov 2023) | URL asli mengembalikan **404** (halaman dipindahkan). Tidak dikutip karena isinya tidak bisa diverifikasi sekarang. |
| YouTube — "RMP TEMU MEMBER 2022 di Tabek Indah" | Tidak memuat transkrip tertulis yang bisa dipakai sebagai kutipan. |
| Lampung Pride — "5 Tempat Kursus Masak di Bandar Lampung" | RMP tidak muncul sebagai bagian isi yang terverifikasi pada pembacaan langsung. |

## 5. Foto kegiatan: status dan batasan

**Foto tidak disalin ke situs.** Alasannya:

1. Foto pada ulasan Google dan Instagram memiliki **hak cipta pengunggahnya**
   (pengulas/kontributor), bukan milik RMP.
2. Foto tidak dapat **diverifikasi isinya** oleh sistem ini pada saat pengerjaan:
   model yang aktif tidak punya kemampuan melihat gambar, dan model vision
   alternatif sedang kena batas kuota (HTTP 429).
3. Menaruh gambar yang tidak terverifikasi ke halaman publik berisiko: bisa jadi
   itu foto profil akun, tangkapan layar, atau foto yang tidak relevan.

Karena itu galeri menampilkan **keadaan kosong yang jujur** sampai pemilik
mengirim berkas asli. Ini lebih aman daripada memasang gambar stok atau gambar
yang belum tentu benar isinya.

## 6. Ketidakcocokan antar sumber (sudah ditampilkan di /profil)

| Aspek | Nilai pada sumber | Tahun |
| --- | --- | --- |
| Alamat | Jl. Soekarno-Hatta, Labuhan Ratu, Kec. Kedaton | 2020 (Travel2Lampung) |
| Alamat | Jl. Komarudin, Rajabasa | 2025 (SMAN 13) |
| Alamat | **Jl. Kapten Abdul Haq No.03, Rajabasa** | Google Maps + kontak resmi terbaru |
| Telepon | 082177368100 | 2020 (Travel2Lampung) |
| Telepon | **08117970171** | Google Maps / Instagram / Facebook |

Interpretasi: RMP **berpindah lokasi** dan **berganti nomor kontak**. Situs
mengikuti data Google Maps sebagai alamat dan telepon yang berlaku sekarang.

## 7. Yang tetap TIDAK dikarang

- **Tidak ada ulasan buatan.** Semua kutipan berasal dari Google Maps dan
  menyebut nama pengulas aslinya, termasuk salah tulis aslinya.
- **Tidak ada foto** milik pihak lain yang disalin.
- **Tidak ada angka** seperti "1.000+ alumni" atau "sejak 2005" tanpa sumber.
- Ulasan menyebut instruktur dipanggil **"Bunda Aini"**; nama ini dicatat sebagai
  catatan, belum dikonfirmasi sebagai penandatangan sertifikat resmi.

## 8. Yang dibutuhkan dari pemilik

1. **6–9 foto kegiatan asli** beresolusi tinggi (JPG/WebP, sisi terpanjang ≥1600 px)
   agar galeri dapat diisi. Simpan di `public/images/kegiatan/`, lalu isi prop
   `foto` pada komponen `GaleriKegiatan`.
2. **Konfirmasi alamat resmi** yang berlaku sekarang.
3. **Konfirmasi nama & jabatan penandatangan sertifikat** (dugaan: "Bunda Aini").
4. Bila ada, izin tertulis untuk memakai foto dari ulasan Google tertentu.

## 9. Cara memperbarui data ini

1. Perbarui `src/lib/bukti-publik.ts` (semua angka dan kutipan ada di sana).
2. Buka tiap URL sumber secara manual untuk memastikan masih hidup dan isinya
   masih sama. Bila berbeda, **perbaiki atau hapus** — jangan biarkan.
3. Jalankan `npm run typecheck`, `npx vitest run`, lalu deploy.
4. Perbarui `tanggalPenarikan` pada `profilMaps` dan `profilInstagram`.