# Desain Absensi Satu Sesi per Kelas

**Status:** Disetujui pengguna pada 22 September 2026  
**Cakupan:** sesi QR absensi admin dan validasi scan peserta  
**Non-cakupan:** absensi manual admin, perubahan syarat pembayaran, penghapusan riwayat, dan migrasi destruktif

## Tujuan

Menyederhanakan absensi sehingga setiap kelas hanya dapat membuka satu sesi sepanjang umur kelas. Sesi aktif tidak memiliki batas waktu, QR tidak berotasi otomatis, dan admin masih dapat mengganti QR pada sesi yang sama atau menutup sesi secara permanen.

## Aturan domain

1. Satu kelas hanya dapat memiliki satu sesi absensi sepanjang umur kelas.
2. Pembuatan sesi ditolak bila kelas sudah memiliki sesi, baik aktif maupun ditutup.
3. Sesi aktif tidak kedaluwarsa berdasarkan waktu.
4. Admin dapat menutup sesi aktif secara manual.
5. Sesi yang ditutup tidak dapat dibuka kembali dan kelas tidak dapat membuat sesi pengganti.
6. Admin dapat mengganti token QR hanya ketika sesi masih aktif.
7. Penggantian token mempertahankan ID sesi dan langsung membatalkan QR lama.
8. Peserta tetap hanya dapat hadir satu kali per enrollment.

## Data lama

- Seluruh sesi dan kehadiran lama dipertahankan.
- Kelas yang memiliki satu atau lebih sesi lama dianggap telah menggunakan hak satu sesinya.
- Sesi terbaru menjadi representasi utama pada panel admin.
- Riwayat lama tidak dihapus, digabungkan, atau dipindahkan.
- Tidak ditambahkan constraint unik database pada `classId` karena data lama mungkin telah memiliki lebih dari satu sesi.

## Pencegahan sesi ganda

Pemeriksaan keberadaan sesi dan pembuatan sesi dilakukan secara atomik di domain service. Implementasi harus menggunakan transaksi dengan penguncian per kelas atau mekanisme database ekuivalen agar dua permintaan bersamaan tidak dapat membuat dua sesi baru.

Pemeriksaan aplikasi tanpa penguncian tidak dianggap cukup karena rentan race condition.

## Token dan keamanan

- Token tetap dihasilkan dengan sumber acak kuat.
- Database tetap hanya menyimpan hash token.
- Token mentah hanya dikembalikan sesaat setelah pembuatan atau penggantian QR.
- QR lama tidak berlaku segera setelah token diganti.
- Token sesi yang telah ditutup tidak dapat dipakai.
- Tidak ada penyimpanan token mentah untuk menampilkan ulang QR.

## Kompatibilitas skema

Kolom `kedaluwarsaPada` dipertahankan untuk menghindari migrasi destruktif. Sesi baru dan penggantian QR mengisinya dengan tanggal sentinel jauh di masa depan yang valid untuk PostgreSQL dan JavaScript. Nilai tersebut hanya untuk kompatibilitas penyimpanan dan tidak digunakan untuk menentukan validitas sesi.

Keputusan validitas sesi hanya berdasarkan:

- kecocokan hash token; dan
- status `aktif` sesi.

## Alur admin

### Membuka sesi

1. Admin memilih kelas yang belum pernah memiliki sesi.
2. Server memeriksa kemampuan `kelola_absensi`.
3. Server mengunci kelas dan memeriksa seluruh riwayat sesi kelas.
4. Bila sesi sudah ada, server mengembalikan error konflik yang aman.
5. Bila belum ada, server membuat satu sesi aktif dan mengembalikan token mentah satu kali.

### Mengganti QR

1. Admin memilih **Ganti QR** pada sesi aktif.
2. Server memastikan sesi tersedia dan masih aktif.
3. Server membuat token baru dan mengganti hash pada sesi yang sama.
4. QR lama langsung tidak valid.
5. Token baru ditampilkan satu kali.

### Menutup sesi

1. Admin memilih **Tutup sesi**.
2. Server menandai sesi tidak aktif.
3. Sesi menjadi **Ditutup permanen**.
4. Penggantian QR dan pembuatan sesi baru untuk kelas tersebut ditolak.

## Panel admin

Panel `/admin/absensi` akan:

- menghapus input masa berlaku;
- menghapus countdown, progress bar, toggle auto-refresh, dan rotasi otomatis;
- mengganti istilah **LMS Dynamic QR** dengan **QR Absensi**;
- menjelaskan bahwa sesi hanya dapat dibuat sekali per kelas;
- menampilkan **Aktif tanpa batas waktu** untuk sesi aktif;
- menampilkan **Ditutup permanen** untuk sesi tertutup;
- menyediakan **Ganti QR** dan **Tutup sesi** hanya untuk sesi aktif;
- menandai atau menonaktifkan kelas yang sudah pernah memiliki sesi;
- menggunakan sesi terbaru sebagai baris utama bila data lama memiliki beberapa sesi, tanpa menghapus riwayat lama.

## Alur peserta

Scan peserta tidak lagi memeriksa `kedaluwarsaPada` atau grace period. Scan tetap memeriksa:

1. pengguna terautentikasi;
2. token valid dan cocok dengan hash sesi;
3. sesi masih aktif;
4. peserta terdaftar pada kelas sesi;
5. status enrollment `PAID`;
6. peserta belum memiliki attendance.

Constraint unik `Attendance.enrollmentId` tetap menjadi perlindungan akhir terhadap permintaan bersamaan atau absensi ganda.

Daftar sesi peserta hanya memfilter sesi aktif dan enrollment lunas yang belum hadir; tidak lagi memfilter waktu kedaluwarsa.

## Penanganan error

- Kelas tidak ditemukan: `TIDAK_DITEMUKAN`.
- Kelas sudah pernah memiliki sesi: `KONFLIK` dengan pesan bahwa sesi hanya dapat dibuat sekali.
- Sesi tidak ditemukan: `TIDAK_DITEMUKAN`.
- Mengganti QR sesi tertutup: `TRANSISI_TIDAK_SAH`.
- Memindai QR sesi tertutup: `TRANSISI_TIDAK_SAH`.
- Token lama setelah penggantian: `TIDAK_DITEMUKAN`.

Pesan tidak memuat hash token, query, stack trace, atau detail internal.

## Batas implementasi

- Tidak menambahkan dependency.
- Tidak menyimpan token mentah.
- Tidak menghapus riwayat sesi atau kehadiran.
- Tidak menambah absensi manual admin dalam perubahan ini.
- Tidak mengubah syarat pembayaran lunas.
- Tidak mengubah constraint unik attendance per enrollment.
- Tidak menambah fitur membuka kembali sesi.

## Verifikasi

Sesuai permintaan pengguna:

- tidak menambahkan test otomatis baru;
- tidak menjalankan Vitest atau Playwright;
- menjalankan `npm run typecheck` untuk pemeriksaan kompilasi tipe;
- menjalankan scoped `git diff --check` untuk kebersihan perubahan;
- melaporkan bahwa pengujian perilaku dilakukan mandiri oleh pengguna.

Typecheck dan diff check bukan bukti bahwa seluruh perilaku runtime sudah benar. Hasil akhir tidak boleh mengklaim fitur telah lulus pengujian perilaku otomatis.
