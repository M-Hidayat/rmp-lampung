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

## 5. Foto kegiatan

**Foto SUDAH dipakai.** Pemilik mengirim 37 foto arsip resmi (berkas di
`public/images/kegiatan`), sehingga galeri kini berisi dokumentasi asli — bukan
gambar stok maupun foto milik pihak lain.

Yang tampil di galeri beranda: **9 foto kurasi**, dipilih dengan syarat:

1. Resolusi >= 1000 px agar tajam di layar besar.
2. Berorientasi mendatar/kuadrat, supaya rapi sebagai kartu galeri 4:3.
   Berkas 640x1136 (potret, rasio layar ponsel) tidak dipakai pada kartu karena
   rasionya memotong isi terlalu banyak, tetapi tetap tersimpan di folder.
3. Dimensi **diverifikasi dari berkas aslinya**, bukan diperkirakan.

Pemeriksaan yang dijalankan sebelum foto tayang:

| Pemeriksaan | Hasil |
| --- | --- |
| Berkas rusak / 0 byte | 0 dari 37 |
| Blok polos / kontras rata | 0 dari 37 |
| Hampir seluruhnya gelap/putih | 0 dari 37 |
| Dugaan bilah UI tangkapan layar | **0 dari 37** |

Catatan kejujuran: isi tiap foto **tidak** diverifikasi secara visual karena
model yang aktif tidak punya kemampuan melihat gambar dan model vision
alternatif terkena batas kuota. Karena itu:

- Alt text ditulis faktual-netral ("Kegiatan pelatihan kuliner Rumah Mama
  Pintar") tanpa mengklaim detail yang tidak bisa dipastikan.
- Pemeriksaan di atas bersifat objektif dari piksel (keragaman warna, kontras,
  deteksi tepi tajam), bukan pembacaan isi.
- Bila ada foto yang tidak layak tayang, cukup sebutkan nama berkasnya.

Hipotesis yang diuji dan **terbantah**: 20 berkas sempat diduga berupa tangkapan
layar Instagram karena rasio 9:16 dan tepi atas tampak rata. Pengukuran tepi yang
lebih tajam menunjukkan transisi berlangsung halus (lonjakan 0-11 dari ambang
25), jadi itu latar polos alami, bukan bilah UI.


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