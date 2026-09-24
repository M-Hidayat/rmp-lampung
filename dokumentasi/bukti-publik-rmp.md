# Bukti Publik RMP Lampung (Riset Pihak Ketiga)

Dokumen ini mencatat **bukti pihak ketiga** yang ditemukan publik untuk Rumah
Mama Pintar, supaya situs tidak perlu mengarang testimoni. Tanggal penelusuran:
**24 September 2026**. Semua entri di bawah telah dibuka langsung halaman
sumbernya, bukan disimpulkan dari ringkasan mesin pencari.

## 1. Sumber yang dipakai di situs

| Penerbit | Judul | Tanggal | URL |
| --- | --- | --- | --- |
| SMAN 13 Bandar Lampung | Kunjungan SMAN 13 Bandar Lampung ke RMP sebagai bagian dari Program Double Track | 18 Jan 2025 | https://sman13bdl.sch.id/informasi/publikasi/kunjungan-sman13-bandar-lampung-ke-rmp-rumah-mama-pintar-sebagai-bagian-dari-program-double-track |
| Monologis.id | IIPG Lampung Tengah Dorong Perempuan Kembangkan Keterampilan | 20 Sep 2026 | https://monologis.id/iipg-lampung-tengah-dorong-perempuan-kembangkan-keterampilan |
| Travel2Lampung | Aneka Pelatihan Usaha Kuliner di Rumah Mama Pintar | 20 Apr 2020 | https://travel2lampung.com/aneka-pelatihan-usaha-kuliner-di-rumah-mama-pintar/ |

### Yang membuat tiga sumber ini bernilai

1. **SMAN 13 Bandar Lampung** — bukan liputan berbayar, melainkan publikasi
   resmi sekolah negeri. Menyebut tanggal (18 Januari 2025), nama lengkap kepala
   sekolah (Febriansah, S.Pd., M.Pd.), kehadiran empat wakil kepala sekolah, dan
   nama siswa peserta (Rika Nopiani). Lokasi disebut "Jl. Komarudin, Rajabasa".
2. **Monologis.id** — media lokal dengan kutipan Ketua IIPG Lampung Tengah
   (drg. Yuniar Musa Ahmad) dan peserta bernama (Fitri Sukesi, 45).
3. **Travel2Lampung** — mencatat ragam materi pelatihan dan menyebut peserta
   datang dari berbagai kabupaten/kota di Lampung dan sebagian luar provinsi.

## 2. Sumber yang DIKETAHUI ADA tetapi tidak dipakai

| Sumber | Alasan tidak dipakai |
| --- | --- |
| Tribun News Lampung — "Srikandi PLN UID Lampung Gelar Kursus Memasak untuk Komunitas Cerebral Palsy" (14 Nov 2023) | URL asli mengembalikan **404 — halaman dipindahkan**. Tidak dikutip karena isinya tidak dapat diverifikasi sekarang. Bila URL baru ditemukan, entri boleh ditambahkan setelah dibaca langsung. |
| YouTube — "RMP (Rumah Mama Pintar) TEMU MEMBER 2022 di Tabek Indah" | Video tidak memuat transkrip yang bisa dipakai sebagai kutipan tertulis. |
| Lampung Pride — "5 Tempat Kursus Masak di Bandar Lampung" | Daftar menyebut tempat lain lebih dulu; RMP tidak muncul sebagai bagian isi yang terverifikasi pada pembacaan langsung. |

## 3. Ketidakcocokan antar sumber (WAJIB dikonfirmasi pemilik)

| Aspek | Nilai pada sumber | Tahun |
| --- | --- | --- |
| Alamat | Jalan Soekarno-Hatta, Labuhan Ratu, Kec. Kedaton | 2020 (Travel2Lampung) |
| Alamat | Jl. Komarudin, Rajabasa | 2025 (SMAN 13) |
| Alamat | Jl. Kapten Abdul Haq No. 03, Rajabasa | data resmi terbaru (Waze + Instagram) |
| Telepon | 082177368100 | 2020 (Travel2Lampung) |
| Telepon | +62 811-7970-171 | kontak resmi terbaru (Facebook) |

Interpretasi paling masuk akal: RMP **berpindah lokasi** dan **berganti nomor
kontak**. Karena itu alamat dan telepon lama tidak boleh ditampilkan sebagai
fakta saat ini.

## 4. Yang tetap TIDAK dikarang

Aturan pada `identitas-rmp.ts` berlaku penuh di sini:

- **Tidak ada testimoni peserta yang dibuat-buat.** Semua kutipan di situs
  berasal dari liputan pihak ketiga dan menyebut nama aslinya.
- **Tidak ada foto milik media** yang disalin ke situs. Foto liputan memiliki hak
  cipta penerbitnya masing-masing.
- **Tidak ada angka** seperti "1.000+ alumni" atau "sejak 2005" tanpa sumber.
- Galeri kegiatan menampilkan **keadaan kosong yang jujur** sampai pemilik
  mengirim foto asli.

## 5. Yang dibutuhkan dari pemilik agar galeri & data terisi

1. **6–9 foto kegiatan asli** beresolusi tinggi (kelas, praktik peserta, hasil
   masakan). Format JPG/WebP, sisi terpanjang minimal 1600 px.
2. **Konfirmasi alamat resmi yang berlaku sekarang.**
3. **Konfirmasi nomor telepon/WhatsApp aktif untuk pendaftaran.**
4. Bila ada, tautan ulasan Google Maps / Facebook yang benar-benar milik RMP,
   supaya ulasan asli dapat ditampilkan tanpa dikarang.

Setelah berkas diterima: simpan di `public/images/kegiatan/`, lalu isi prop
`foto` pada komponen `GaleriKegiatan` di `src/components/bukti-publik.tsx`.
