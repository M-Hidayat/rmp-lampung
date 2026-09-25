# Desain Dua Role dan Provisioning Admin RMP Lampung

Tanggal: 19 September 2026
Status: Disetujui secara prinsip; menunggu tinjauan dokumen

## Tujuan

Menyederhanakan otorisasi aplikasi menjadi dua role, `USER` dan `ADMIN`, menghapus seluruh domain serta kemampuan khusus `PEMILIK`, dan menyediakan akun administrator awal secara aman.

## Hasil akhir

- Enum role aplikasi dan database hanya memuat `USER` dan `ADMIN`.
- Route `/pemilik` tidak tersedia.
- Area operasi berada di `/admin`; area peserta berada di `/user`.
- Identitas akun admin awal dibaca dari environment privat.
- Password admin dibaca dari environment lokal dan hanya disimpan di database sebagai hash bcrypt.
- Tidak ada email/password admin yang ditanam di source, migration SQL, UI, template environment, atau dokumentasi terlacacak Git.

## Migrasi data

Penghapusan akun `PEMILIK` dilakukan tanpa merusak foreign key atau histori operasional:

1. Provisioning membuat atau memperbarui akun dari `INITIAL_ADMIN_EMAIL` sebagai `ADMIN` dan aktif.
2. Password dari `INITIAL_ADMIN_PASSWORD` di-hash menggunakan helper bcrypt aplikasi.
3. Semua relasi operasional yang wajib memiliki pengguna, terutama `AttendanceSession.dibuatOlehId`, dialihkan dari akun `PEMILIK` lama ke admin baru.
4. Akun ber-role `PEMILIK` dihapus setelah seluruh referensi wajib dialihkan.
5. Migration database menghapus nilai `PEMILIK` dari enum Prisma/PostgreSQL.

Penghapusan tidak boleh menggunakan cascade yang menghapus histori absensi, pembayaran, invoice, sertifikat, atau transaksi.

## Provisioning admin

Tambahkan script eksplisit `npm run admin:provision` yang membaca:

- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `INITIAL_ADMIN_NAME`

Aturan:

- Ketiganya wajib diisi dan divalidasi.
- Email dinormalisasi ke lowercase.
- Password mengikuti validasi minimum aplikasi dan tidak dicetak ke log.
- Operasi idempoten: akun dengan email yang sama diperbarui menjadi `ADMIN`, aktif, dan mendapat hash password terbaru.
- Script mengalihkan referensi akun pemilik lama sebelum menghapus akun tersebut.
- Output log hanya boleh menyebut email, role, dan jumlah akun lama yang ditangani.
- `.env.example` hanya memuat nama variabel dan placeholder aman.
- `.env` lokal yang diabaikan Git memuat identitas dan password yang diberikan pengguna.

## RBAC dan routing

- Ubah `Peran` TypeScript menjadi `"ADMIN" | "USER"`.
- Hapus kemampuan `lihat_laporan_pemilik`, `kelola_admin`, dan `audit_sertifikat` sebagai kemampuan khusus pemilik.
- `ADMIN` mempertahankan seluruh kemampuan operasional: kelas, peserta, pembayaran, absensi, sertifikat, dan dokumen operasional.
- `adalahPeranOperasional` hanya menerima `ADMIN`.
- `berandaDashboard` hanya mengarahkan `ADMIN` ke `/admin` dan `USER` ke `/user`.
- Middleware hanya melindungi `/admin/*` dan `/user/*`.
- Hapus route group `src/app/(dashboard)/pemilik/`.
- Hapus menu, label, ikon, redirect, dan revalidation path yang merujuk `/pemilik`.
- Akses `/admin/*` hanya untuk `ADMIN`; akses `/user/*` tetap tersedia untuk `USER` dan `ADMIN` bila pola aplikasi saat ini membutuhkannya.

## Fitur pemilik lama

- Dashboard laporan bisnis yang masih relevan dipindahkan atau diserap ke area `/admin`, bukan dipertahankan sebagai domain role terpisah.
- Audit sertifikat diserap ke halaman administrasi sertifikat yang sudah ada.
- Manajemen akun admin dihapus karena tidak ada role lebih tinggi yang berwenang membuat atau menonaktifkan admin lain melalui UI.
- Service dan server action yang hanya melayani manajemen admin lama dihapus bila tidak lagi memiliki pemanggil.
- Logika laporan yang masih dipakai admin dipertahankan dengan kemampuan admin yang sesuai dan nama yang tidak lagi mengacu pada pemilik.

## Prisma dan migration SQL

Penghapusan nilai enum PostgreSQL harus menggunakan migration eksplisit:

1. Pastikan tidak ada baris `User.peran = 'PEMILIK'` setelah provisioning/migrasi data.
2. Buat enum pengganti yang hanya berisi `ADMIN` dan `USER`.
3. Ubah kolom `User.peran` ke enum pengganti dengan cast teks.
4. Hapus enum lama dan ganti nama enum baru menjadi `Peran`.
5. Pertahankan default `USER` dan index role.

Migration tidak menyimpan kredensial dan tidak membuat akun admin secara hardcoded.

## Dokumentasi

Perbarui:

- `AGENTS.md` dari empat domain menjadi dua role/domain terautentikasi.
- `README.md` agar hanya menjelaskan `USER` dan `ADMIN`.
- `DESIGN.md` untuk menghapus owner dashboard.
- dokumentasi lain yang menyebut role atau route pemilik jika istilahnya memang merujuk role teknis; penggunaan kata “pemilik” dalam arti pemilik bisnis/dokumen tetap dipertahankan.

## Keamanan

- Password plaintext tidak boleh masuk Git atau log.
- `.env` harus tetap diabaikan Git.
- Provisioning menggunakan bcrypt helper yang sama dengan login/registrasi.
- Registrasi publik tetap selalu menghasilkan role `USER` meskipun payload mencoba mengirim role lain.
- Tidak ada endpoint publik untuk menaikkan role menjadi `ADMIN`.
- Script provisioning merupakan satu-satunya jalur bootstrap admin awal dalam ruang lingkup ini.

## Error handling

Provisioning berhenti sebelum perubahan destruktif jika:

- environment wajib tidak lengkap;
- email/password tidak valid;
- admin baru gagal dibuat atau diperbarui;
- pengalihan foreign key gagal.

Operasi data terkait harus dijalankan dalam satu transaksi Prisma agar kegagalan mengembalikan seluruh perubahan.

## Batasan verifikasi

Sesuai instruksi pengguna sebelumnya, agen tidak menjalankan Vitest, Playwright, browser testing, atau audit performa otomatis. Agen hanya melakukan audit referensi statis dan `git diff --check`.

Agen tidak mengklaim migration, provisioning, build, atau login telah berfungsi sampai pengguna menjalankan verifikasi sendiri. Jika pengguna ingin akun benar-benar dibuat pada database aktif, script provisioning tetap harus dijalankan terhadap database tersebut; penulisan source saja bukan bukti akun tersedia.

## Non-goals

- Menambah role ketiga atau hierarki admin baru.
- Menyediakan UI untuk membuat admin tambahan.
- Mengubah aturan pembayaran, absensi, invoice, atau sertifikat.
- Menanam password atau hash tertentu di migration.
- Menghapus histori bisnis yang direferensikan akun pemilik lama.

## Kriteria selesai implementasi

- Source dan schema hanya mengenali `USER` dan `ADMIN`.
- Tidak ada route atau RBAC path `/pemilik`.
- Tidak ada UI manajemen admin yang sebelumnya khusus pemilik.
- Fitur laporan/audit yang relevan tersedia bagi admin atau sudah diserap ke halaman admin.
- Script provisioning aman, idempoten, dan transactional tersedia.
- Environment lokal memuat kredensial admin yang diminta tanpa dilacak Git.
- Migration enum tidak mengandung kredensial dan tidak menghapus histori operasional.
- Audit referensi teknis `PEMILIK` dan `/pemilik` pada source aktif menghasilkan nol, selain migration historis atau istilah non-role yang memang sah.
- Status akhir dilaporkan sebagai belum diuji oleh agen.
