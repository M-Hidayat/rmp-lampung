# Desain Kelola Kelas Admin

**Status:** Disetujui pengguna pada 22 September 2026  
**Cakupan:** UI/UX pengelolaan kelas admin  
**Non-cakupan:** perubahan skema database, aturan bisnis kelas, RBAC, atau katalog publik

## Tujuan

Menjadikan menu **Kelola Kelas** mudah dipindai dan dikelola ketika jumlah kelas bertambah. Halaman daftar menjadi pusat kerja, sedangkan formulir tambah dan edit dipindahkan ke halaman khusus agar admin tidak menghadapi banyak formulir panjang sekaligus.

## Struktur route

- `/admin/kelas` — daftar dan ringkasan kelas.
- `/admin/kelas/baru` — membuat kelas baru.
- `/admin/kelas/[id]/ubah` — mengubah satu kelas berdasarkan ID.

Semua route berada di domain admin yang sudah dilindungi oleh layout dashboard dan pemeriksaan kemampuan pada domain service/server action.

## Halaman daftar kelas

### Header

- Judul **Kelola Kelas**.
- Penjelasan singkat dan natural bahwa kelas lama dinonaktifkan, bukan dihapus, agar riwayat tetap utuh.
- Tombol utama **Tambah Kelas** menuju `/admin/kelas/baru` dengan target interaksi minimum 44 piksel.

### Ringkasan operasional

Tampilkan empat angka yang dihitung dari hasil `daftarKelasOperasional()`:

1. Total kelas.
2. Kelas aktif.
3. Kelas nonaktif.
4. Total peserta yang sedang menggunakan kuota.

Ringkasan hanya membantu pemindaian dan tidak menambahkan query atau aturan bisnis baru.

### Daftar kelas

Setiap kelas harus menampilkan:

- judul dan slug;
- harga;
- jadwal mulai;
- kuota terpakai, kapasitas, dan sisa kursi;
- status aktif/nonaktif;
- tautan **Edit** menuju `/admin/kelas/[id]/ubah`;
- tindakan **Aktifkan/Nonaktifkan** menggunakan server action yang sudah tersedia.

Tampilan desktop boleh menggunakan tabel responsif. Pada viewport sempit, konten harus tetap dapat dibaca tanpa kehilangan tindakan utama. Tidak diperlukan pencarian, filter, pagination, bulk action, atau penghapusan karena belum ada kebutuhan terverifikasi.

### Empty state

Jika belum ada kelas, tampilkan pesan yang jelas dan tombol **Tambah kelas pertama** menuju `/admin/kelas/baru`.

## Halaman tambah kelas

- Judul **Tambah kelas** dan tautan kembali ke daftar.
- Formulir menggunakan `FormulirKelas` dan `aksiBuatKelas` yang sudah ada.
- Field dikelompokkan secara visual:
  1. Informasi kelas: judul, slug, deskripsi/silabus.
  2. Harga dan kapasitas: harga, kuota.
  3. Jadwal dan lokasi: jadwal mulai, jadwal selesai, lokasi.
- Slug tetap dibuat otomatis dari judul sampai admin mengedit slug secara manual.
- Tombol **Batal** kembali ke `/admin/kelas`.
- Setelah berhasil dibuat, server action mengarahkan admin ke `/admin/kelas`.

## Halaman edit kelas

- Route menerima ID kelas, bukan slug publik.
- Data diambil melalui fungsi domain admin yang memeriksa kemampuan `kelola_kelas`.
- ID yang tidak ditemukan menghasilkan `notFound()` tanpa membocorkan detail internal.
- Header menampilkan judul kelas, status, dan konteks kuota terpakai.
- Menggunakan struktur formulir yang sama dengan halaman tambah.
- Tombol **Batal** kembali ke `/admin/kelas`.
- Setelah berhasil disimpan, server action mengarahkan admin ke `/admin/kelas`.
- Aturan kuota tetap diterapkan di domain service: kuota tidak boleh lebih kecil dari jumlah pendaftar aktif.

## Arsitektur dan aliran data

1. Server page memanggil `sesiPengguna()`.
2. Domain service melakukan pemeriksaan `wajibKemampuan(sesi, "kelola_kelas")`.
3. Halaman daftar menerima seluruh kelas operasional beserta hitungan enrollment aktif.
4. Halaman edit mengambil satu kelas berdasarkan ID dengan data yang sama untuk form dan konteks kuota.
5. Client form mengirim data ke server action yang sudah ada.
6. Server action memvalidasi input melalui domain service, melakukan revalidasi route terkait, lalu redirect ke daftar bila berhasil.
7. Kesalahan validasi tetap tampil pada formulir tanpa menghilangkan input admin.

Tidak ada akses database langsung dari client component.

## Aksesibilitas dan responsivitas

- Satu `h1` per halaman.
- Label terhubung dengan input.
- Tindakan utama dan sekunder memiliki teks eksplisit.
- Target interaksi minimum 44 piksel.
- Fokus keyboard terlihat.
- Struktur heading berurutan.
- Daftar tetap dapat digunakan pada mobile tanpa kontrol penting terpotong.
- Pesan sukses/gagal tetap menggunakan komponen alert yang sudah ada.

## Penanganan kesalahan

- Data input tidak valid: tampilkan pesan umum dan detail per field dari domain service.
- Slug bentrok: tampilkan kesalahan pada field slug.
- Kelas edit tidak ditemukan: 404.
- Kuota terlalu kecil: tampilkan pesan pada field kuota.
- Kegagalan tak terduga: ditangani melalui pola `keStatus` yang sudah tersedia; tidak menampilkan stack trace atau detail internal.

## Pengujian dan penerimaan

Implementasi diterima jika:

1. `/admin/kelas` tidak lagi merender formulir tambah maupun seluruh formulir edit.
2. Tombol tambah menuju `/admin/kelas/baru`.
3. Tindakan edit setiap kelas menuju route berdasarkan ID.
4. Halaman tambah dan edit menampilkan form yang benar serta tombol kembali/batal.
5. ID kelas yang tidak ada menghasilkan 404.
6. Status aktif/nonaktif tetap dapat diubah dari daftar.
7. Aturan slug unik dan batas minimum kuota tetap berlaku.
8. Typecheck, unit/integration tests, dan Playwright lulus.
9. Tampilan tidak overflow pada viewport mobile dan desktop representatif.

## Kesengajaan scope

- Tidak ada delete kelas karena riwayat operasional harus tetap utuh.
- Tidak ada modal atau side panel karena formulir cukup panjang.
- Tidak ada pencarian/filter/pagination sampai volume data membuktikan kebutuhannya.
- Tidak ada dependency baru; komponen dan primitive yang sudah tersedia mencukupi.
