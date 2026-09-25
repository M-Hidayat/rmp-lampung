# Desain Penyelarasan UI/UX Industri RMP Lampung

Tanggal: 19 September 2026
Status: Disetujui secara prinsip; menunggu tinjauan dokumen

## Tujuan

Menyelaraskan seluruh antarmuka RMP Lampung dengan `DESIGN.md` dan standar UI/UX web modern tanpa mengubah struktur fitur, alur bisnis, atau identitas produk secara menyeluruh.

## Prinsip

- Pertahankan seluruh fitur bisnis yang aktif.
- Gunakan perubahan terkecil yang memberi dampak lintas aplikasi.
- Perbaiki token dan komponen bersama sebelum menambal halaman satu per satu.
- Jangan menambah dependency baru.
- Jangan membuat data, statistik, testimonial, atau klaim bisnis fiktif.
- Hapus UI hanya jika tidak memiliki action, data, atau fungsi nyata.
- Aksesibilitas, keamanan, validasi, dan integritas alur tidak boleh disederhanakan.

## Sistem visual

Palet utama mengikuti `DESIGN.md`:

- Charcoal: `#0F172A` untuk teks utama, navigasi, dan permukaan gelap khusus.
- White: `#FFFFFF` untuk card dan permukaan utama.
- Orange: `#EA580C` untuk CTA, active state, focus ring, dan aksen interaksi.
- Slate netral untuk background, border, secondary text, dan muted surface.
- Crimson, green, amber, dan red hanya digunakan sebagai warna status semantik.

Token krem/gold aktif diganti dengan token semantik charcoal–white–orange. Warna mentah yang berulang di komponen dikonsolidasikan. Gradient dekoratif, shadow besar, dan radius yang tidak konsisten dikurangi; kartu menggunakan border halus dan elevation minimal.

## Tipografi dan loading font

- Hapus `@import` Google Fonts dari CSS.
- Gunakan `next/font/google` agar font dioptimalkan Next.js dan tidak memblokir rendering melalui stylesheet eksternal.
- Montserrat dipakai untuk heading.
- Inter dipakai untuk body, label, form, tabel, dan data.
- Input, button, select, dan textarea mewarisi font body.
- Body utama menggunakan ukuran 14–16px dengan line-height yang nyaman.
- Teks 10–11px dibatasi untuk metadata nonkritis; label, action, dan informasi penting minimal 12–14px.
- Angka finansial dan referensi dapat memakai font mono/tabular bila membantu pemindaian data.

## Komponen bersama

Komponen berikut menjadi sumber konsistensi:

- `Button`: ukuran target sentuh minimal 44px untuk action utama, focus visible, pending/disabled jelas.
- `Card`: radius, border, padding, dan hierarchy title/description seragam.
- `Input` dan `Label`: tinggi kontrol, focus ring, disabled state, serta keterbacaan label diseragamkan.
- `Alert` dan status badge: warna semantik dan ikon tidak menjadi satu-satunya pembeda status.
- `Table`: header kontras, row hover halus, mobile overflow yang jelas, dan action tidak terlalu kecil.
- `JudulHalaman`/kerangka: satu pola untuk eyebrow opsional, heading, deskripsi, dan actions.
- Skeleton: bentuk mengikuti layout konten dan memiliki status aksesibel.

Tidak dibuat abstraksi baru untuk pola yang hanya dipakai sekali.

## Navigasi dan layout dashboard

### Desktop

- Sidebar tetap menjadi navigasi utama.
- Active item memakai indikator orange yang jelas tanpa shadow/glow berlebihan.
- Informasi akun, role, logout, dan tautan publik tetap tersedia.
- Ikon/dekorasi tanpa action nyata dihapus.
- Search, notification, atau control palsu tidak ditampilkan.

### Mobile

- Tambahkan header mobile yang menampilkan identitas aplikasi dan tombol menu berlabel aksesibel.
- Menu menggunakan mekanisme native/minimal tanpa dependency baru.
- Semua destination role tetap dapat dijangkau pada viewport kecil.
- Target sentuh minimal 44×44px dan tidak bergantung pada hover.
- Konten tidak mengalami horizontal overflow selain tabel yang memang memakai container scroll.

## Halaman publik

### Beranda

- Pertahankan hero dan gambar LCP yang telah dioptimalkan.
- Tegaskan hierarchy value proposition, CTA utama, dan CTA sekunder.
- Kurangi dekorasi yang tidak membantu keputusan pengguna.
- Empty state kelas tetap jujur ketika database kosong.

### Katalog dan detail kelas

- Kartu kelas menggunakan hierarchy yang konsisten untuk judul, jadwal, lokasi, kuota, harga, dan CTA.
- Informasi penting dapat dipindai pada desktop dan mobile.
- Gambar responsif memakai Next Image, intrinsic/fill sizing yang tepat, dan ruang yang dicadangkan untuk mencegah CLS.

### Profil, kontak, dan cara pendaftaran

- Kurangi blok card repetitif yang tidak menambah hierarchy.
- Konten belum terverifikasi tetap ditandai secara jujur.
- Informasi kontak, lokasi, dan tahapan pendaftaran disusun berdasarkan kebutuhan pengguna.

### Autentikasi

- Form login dan registrasi dibuat ringkas.
- Label tetap terlihat; placeholder tidak menggantikan label.
- Error berada dekat field atau form yang bermasalah.
- Pending state mencegah submit berulang.
- Tidak ada shortcut akun demo.

### Verifikasi sertifikat

- Hasil valid, dibatalkan, atau tidak ditemukan menjadi fokus visual utama.
- Status tidak disampaikan hanya dengan warna.
- Nomor sertifikat dan data relevan tetap mudah disalin/dibaca.

## Dashboard pengguna

- Dashboard merangkum kelas, pembayaran, absensi, invoice, dan sertifikat tanpa kartu dekoratif yang tidak memiliki tujuan.
- CTA mengikuti langkah berikutnya yang nyata.
- Empty state memberi instruksi relevan tanpa menciptakan data contoh.
- Halaman tabel/daftar memakai pola heading, filter, empty state, dan action yang konsisten.
- Scanner QR mempertahankan alur WebRTC/jsQR, dengan feedback izin kamera, proses scan, sukses, dan error yang jelas.

## Dashboard admin

- Dashboard statistik mempertahankan data nyata dan menghapus kontrol visual yang tidak berfungsi.
- Halaman kelas, peserta, pembayaran, kehadiran, sertifikat, dan laporan memakai pola operasional yang konsisten.
- Filter memakai native input bila memadai.
- Tabel tetap dapat dipakai di mobile melalui overflow container dan hierarchy kolom yang jelas.
- Action destructive memiliki konfirmasi dan gaya semantik.
- Laporan finansial menonjolkan angka utama dan ledger, bukan dekorasi.
- Mode QR proyektor mempertahankan latar charcoal, QR besar, countdown 30 detik, dan progress yang mudah terlihat.

## Loading, feedback, dan motion

- Pertahankan segment-level `loading.tsx` Next.js.
- Skeleton disesuaikan dengan geometri public, auth, dan dashboard agar layout shift rendah.
- Server action menggunakan status pending nyata, disabled state, dan label proses.
- Alert success/error konsisten dan terbaca pembaca layar.
- Transisi interaksi dibatasi sekitar 150–200 ms.
- Tidak menambah library animasi.
- `prefers-reduced-motion` menonaktifkan atau meminimalkan motion non-esensial.

## Aksesibilitas

- Target WCAG AA: rasio 4.5:1 untuk teks normal dan 3:1 untuk teks besar/boundary esensial.
- Focus ring selalu terlihat.
- Heading berurutan dan landmark utama dipertahankan.
- Icon-only button wajib memiliki accessible name.
- Ikon dekoratif disembunyikan dari accessibility tree bila perlu.
- Status tidak bergantung pada warna saja.
- Skip link tetap tersedia.
- Tidak menonaktifkan zoom viewport.

## Pembersihan UI dan source

Boleh dihapus:

- tombol atau ikon tanpa action;
- pencarian visual yang tidak memfilter;
- notification control tanpa fitur;
- badge/statistik tanpa sumber data nyata;
- import, CSS, atau komponen yang tidak memiliki pemanggil;
- duplikasi styling yang sudah diselesaikan oleh token/komponen bersama.

Tidak boleh dihapus:

- route atau fitur bisnis aktif;
- validasi dan keamanan;
- aksesibilitas;
- informasi pembayaran, absensi, invoice, atau sertifikat;
- test file hanya karena eksekusi test dilewati.

## Performa

- Gunakan `next/font` menggantikan CSS font import.
- Gunakan Server Components secara default dan hindari client boundary baru tanpa kebutuhan interaksi.
- Pertahankan optimasi Next Image dan loading segment native.
- Hindari dependency, animation runtime, dan state management baru.
- Hindari loader global yang memblokir seluruh layar.
- Hapus UI mati dan import mati untuk mengurangi source/bundle bila benar-benar tidak dipakai.

## Non-goals

- Redesign total atau perubahan brand baru.
- Dark mode.
- Mengubah alur bisnis, API, database, Pakasir, RBAC, QR, invoice, atau sertifikat.
- Menambah chart/library/dependency baru.
- Mengisi konten bisnis yang belum terverifikasi.
- Menghapus test atau route yang masih relevan.

## Verifikasi dan batas klaim

Atas instruksi pengguna, agen tidak menjalankan:

- lint;
- typecheck;
- Vitest;
- Playwright;
- production build;
- browser/manual test;
- audit performa otomatis.

Agen hanya melakukan:

- audit source dan referensi;
- pemeriksaan import/pemanggil secara statis;
- `git diff --check`.

Karena itu hasil akhir harus dilaporkan sebagai **diimplementasikan tetapi belum diuji**, bukan “siap produksi”, “lulus”, atau “bebas regresi”. Pengguna bertanggung jawab menguji seluruh route, viewport, action, dan alur bisnis.

## Kriteria implementasi selesai

- Token aktif konsisten dengan charcoal–white–orange.
- Font dimuat melalui `next/font`, bukan CSS `@import`.
- Public, auth, user, dan admin memiliki hierarchy visual konsisten.
- Navigasi dashboard dapat digunakan pada desktop dan mobile.
- Tidak ada search/notifikasi/action palsu.
- Semua fitur aktif tetap memiliki route dan action.
- Skeleton, pending, empty, success, error, dan destructive state konsisten.
- Source aktif tidak memiliki referensi UI yang sudah dihapus.
- `git diff --check` berhasil.
- Status akhir secara eksplisit menyatakan belum diuji.
