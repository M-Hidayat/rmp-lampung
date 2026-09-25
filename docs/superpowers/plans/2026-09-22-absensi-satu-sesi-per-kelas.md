# Absensi Satu Sesi per Kelas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah absensi menjadi satu sesi permanen per kelas, dengan QR tanpa kedaluwarsa yang dapat diganti pada sesi aktif dan ditutup permanen.

**Architecture:** Domain service menjadi sumber aturan: pembuatan sesi memakai transaksi dan PostgreSQL transaction-level advisory lock berdasarkan ID kelas, lalu menolak bila riwayat sesi apa pun sudah ada. Kolom waktu lama dipertahankan menggunakan sentinel kompatibilitas, tetapi tidak digunakan pada validasi scan atau daftar sesi peserta. UI admin menjadi QR statis sekali tampil tanpa timer/rotasi.

**Tech Stack:** Next.js 15 Server Actions, React 19, TypeScript strict, Prisma ORM, PostgreSQL, Zod, `qrcode`.

## Global Constraints

- Satu kelas hanya dapat memiliki satu sesi sepanjang umur kelas.
- Sesi aktif tidak memiliki batas waktu.
- Sesi tertutup tidak dapat dibuka kembali atau diganti dengan sesi baru.
- Penggantian QR hanya mengubah token hash pada sesi aktif yang sama.
- Database tetap hanya menyimpan hash token.
- Riwayat lama dan attendance tidak dihapus atau dipindahkan.
- Tidak menambahkan unique constraint `AttendanceSession.classId` karena kompatibilitas data lama.
- Tidak menambah dependency atau mengubah syarat enrollment `PAID`.
- Tidak menambahkan atau menjalankan Vitest/Playwright sesuai permintaan pengguna.
- Verifikasi terbatas pada `npm run typecheck` dan scoped `git diff --check`; jangan mengklaim perilaku runtime telah teruji otomatis.
- Jangan commit atau push tanpa permintaan eksplisit pengguna.

---

### Task 1: Kontrak sesi permanen dan pencegahan sesi ganda

**Files:**
- Modify: `src/lib/validasi.ts:115-123`
- Modify: `src/lib/layanan/absensi.ts:1-158`

**Interfaces:**
- Consumes: `wajibKemampuan`, Prisma transaction client, `buatTokenAbsensi`, `hashTokenAbsensi`.
- Produces:
  - `buatSesiAbsensi(sesi, { classId }, dependensi?): Promise<SesiAbsensiAktif>`
  - `perbaruiTokenSesi(sesi, sessionId, dependensi?): Promise<SesiAbsensiAktif>`
  - `BATAS_WAKTU_SENTINEL_ABSENSI: Date`

- [ ] **Step 1: Sederhanakan validasi pembukaan sesi**

Ubah `skemaBuatSesiAbsensi` agar hanya menerima ID kelas:

```ts
export const skemaBuatSesiAbsensi = z.object({
	classId: z.string().trim().min(1, "Kelas wajib dipilih"),
})
```

Tidak lagi menerima `masaBerlakuMenit`.

- [ ] **Step 2: Tetapkan sentinel kompatibilitas**

Di `src/lib/layanan/absensi.ts`, hapus import utilitas kedaluwarsa dan definisikan satu nilai internal yang aman bagi JavaScript/PostgreSQL:

```ts
const BATAS_WAKTU_SENTINEL_ABSENSI = new Date("9999-12-31T23:59:59.999Z")
```

`SesiAbsensiAktif` tetap memiliki `kedaluwarsaPada` untuk kompatibilitas bentuk data, tetapi UI tidak menampilkannya sebagai batas waktu.

- [ ] **Step 3: Buat sesi secara atomik dengan advisory lock per kelas**

Di dalam `db.$transaction`, kunci kelas berdasarkan ID tanpa interpolasi SQL mentah:

```ts
await tx.$queryRaw`
	SELECT pg_advisory_xact_lock(hashtextextended(${kelas.id}, 0))
`

const sudahAda = await tx.attendanceSession.findFirst({
	where: { classId: kelas.id },
	select: { id: true },
})
if (sudahAda) {
	throw new KesalahanDomain(
		"KONFLIK",
		"Sesi absensi untuk kelas ini sudah pernah dibuat dan tidak dapat dibuat ulang.",
	)
}
```

Setelah pemeriksaan, buat satu sesi:

```ts
return tx.attendanceSession.create({
	data: {
		classId: kelas.id,
		tokenHash: hashTokenAbsensi(token),
		kedaluwarsaPada: BATAS_WAKTU_SENTINEL_ABSENSI,
		aktif: true,
		dibuatOlehId: petugas.id,
	},
	select: { id: true, classId: true, kedaluwarsaPada: true },
})
```

Hapus `updateMany` yang menutup sesi lama. Bila adapter dependensi palsu tidak menyediakan `$queryRaw`, jangan melemahkan jalur produksi; type `KlienDb` tetap menjadi kontrak resmi.

- [ ] **Step 4: Jadikan penggantian token tanpa masa berlaku**

Ubah signature:

```ts
export async function perbaruiTokenSesi(
	sesi: SesiPengguna | null,
	sessionId: string,
	dependensi: DependensiAbsensi = {},
): Promise<SesiAbsensiAktif>
```

Update hanya hash dan sentinel:

```ts
data: {
	tokenHash: hashTokenAbsensi(token),
	kedaluwarsaPada: BATAS_WAKTU_SENTINEL_ABSENSI,
}
```

Pertahankan penolakan `TRANSISI_TIDAK_SAH` untuk sesi tertutup.

- [ ] **Step 5: Periksa kompilasi unit domain**

Run:

```bash
npm run typecheck
git diff --check -- src/lib/validasi.ts src/lib/layanan/absensi.ts
```

Expected: kedua command exit `0`. Jangan menjalankan test suite.

---

### Task 2: Hilangkan keputusan kedaluwarsa dari alur peserta

**Files:**
- Modify: `src/lib/layanan/absensi.ts:160-316`

**Interfaces:**
- Consumes: token hash, status sesi, enrollment, dan unique constraint `Attendance.enrollmentId`.
- Produces: scan dan daftar sesi yang hanya bergantung pada token/status, bukan waktu.

- [ ] **Step 1: Hapus pemeriksaan waktu pada scan**

Pada `catatKehadiran`:

- hapus dependency `sekarang` bila hanya dipakai untuk validasi token; gunakan `new Date()` atau dependency yang sama hanya untuk `waktuScan`;
- hapus `kedaluwarsaPada` dari select sesi;
- hapus pemanggilan `tokenMasihBerlaku` dan error “QR absensi sudah kedaluwarsa”.

Pertahankan urutan pemeriksaan:

```text
sesi login → token ditemukan → sesi aktif → enrollment kelas → PAID → belum hadir → create attendance
```

Gunakan `waktu = sekarang()` hanya sebagai nilai `waktuScan` agar testability existing tidak rusak.

- [ ] **Step 2: Hapus filter waktu dari daftar sesi peserta**

Ubah `sesiAbsensiUntukPengguna` menjadi:

```ts
return db.attendanceSession.findMany({
	where: {
		aktif: true,
		kelas: {
			enrollments: {
				some: {
					userId: pengguna.id,
					status: "PAID",
					attendance: { is: null },
				},
			},
		},
	},
	select: {
		id: true,
		kelas: { select: { id: true, judul: true } },
	},
})
```

Hapus variabel `sekarang` dan `kedaluwarsaPada` dari hasil bila tidak ada konsumen yang memerlukannya. Cari seluruh penggunaan hasil sebelum mengubah shape.

- [ ] **Step 3: Periksa seluruh referensi kedaluwarsa**

Cari source produksi:

```bash
rg "tokenMasihBerlaku|GRACE_PERIOD_DETIK|hitungKedaluwarsa|masaBerlakuMenit|kedaluwarsaPada" src --glob '!**/*.test.ts'
```

Expected: referensi yang tersisa hanya kompatibilitas penyimpanan/response yang memang dibutuhkan; tidak ada keputusan validitas scan berdasarkan waktu.

- [ ] **Step 4: Verifikasi tipe dan diff**

Run:

```bash
npm run typecheck
git diff --check -- src/lib/layanan/absensi.ts
```

Expected: exit `0`; jangan menjalankan test suite.

---

### Task 3: Server action QR statis

**Files:**
- Modify: `src/app/(dashboard)/admin/absensi/aksi.ts`

**Interfaces:**
- Consumes: service Task 1 tanpa parameter durasi.
- Produces: `HasilQrAbsensi` dengan QR sekali tampil dan tanpa metadata kedaluwarsa.

- [ ] **Step 1: Sederhanakan hasil QR**

Ubah tipe:

```ts
export type HasilQrAbsensi = {
	pesan?: string
	sukses?: string
	qr?: {
		sessionId: string
		judulKelas?: string
		token: string
		url: string
		gambar: string
	}
}
```

- [ ] **Step 2: Hapus durasi dari pembukaan sesi**

Panggil service hanya dengan:

```ts
const hasil = await buatSesiAbsensi(sesi, {
	classId: String(data.get("classId") ?? ""),
})
```

Ubah pesan sukses menjadi:

```ts
"Sesi absensi dibuka tanpa batas waktu. Simpan atau tampilkan QR ini; token hanya ditampilkan sekali."
```

Hapus `kedaluwarsaPada` dari response.

- [ ] **Step 3: Hapus durasi dari penggantian QR**

Panggil:

```ts
const hasil = await perbaruiTokenSesi(
	sesi,
	String(data.get("sessionId") ?? ""),
)
```

Ubah pesan sukses menjadi “QR berhasil diganti. QR lama tidak dapat dipakai lagi.” dan hapus metadata waktu.

- [ ] **Step 4: Verifikasi tipe dan diff**

Run:

```bash
npm run typecheck
git diff --check -- 'src/app/(dashboard)/admin/absensi/aksi.ts'
```

Expected: exit `0`; jangan menjalankan test suite.

---

### Task 4: Panel admin QR statis dan representasi sesi terbaru

**Files:**
- Modify: `src/lib/layanan/absensi.ts:346-366`
- Modify: `src/app/(dashboard)/admin/absensi/page.tsx`
- Modify: `src/app/(dashboard)/admin/absensi/panel-qr.tsx`

**Interfaces:**
- Consumes: daftar kelas, seluruh riwayat sesi terurut terbaru, action Task 3.
- Produces: panel QR statis, pilihan kelas yang belum pernah memiliki sesi, dan satu baris utama terbaru per kelas.

- [ ] **Step 1: Kembalikan riwayat yang cukup untuk deduplikasi kompatibilitas**

Pertahankan `daftarSesiAbsensi` terurut `createdAt: "desc"`. Naikkan atau hapus `take: 50` bila pembatas tersebut dapat membuat kelas lama salah dianggap belum pernah memiliki sesi. Solusi minimum yang benar adalah menghapus `take`, karena daftar juga dipakai untuk menentukan hak membuat sesi.

Jangan melakukan query terpisah yang hanya memeriksa sesi aktif.

- [ ] **Step 2: Bentuk sesi utama dan kelas tersedia pada server component**

Di `page.tsx`:

```ts
const sesiTerbaruPerKelas = Array.from(
	new Map(sesiAbsensi.map((item) => [item.kelas.id, item])).values(),
)
const classIdPernahDipakai = new Set(sesiAbsensi.map((item) => item.kelas.id))
const pilihanKelas = kelas.map((item) => ({
	id: item.id,
	judul: item.judul,
	sudahMemilikiSesi: classIdPernahDipakai.has(item.id),
}))
```

Karena data sudah diurutkan terbaru dahulu, `Map` harus mempertahankan entri pertama. Jika constructor `Map` menimpa entri dengan duplikat, gunakan loop eksplisit:

```ts
const sesiUtama = new Map<string, (typeof sesiAbsensi)[number]>()
for (const item of sesiAbsensi) {
	if (!sesiUtama.has(item.kelas.id)) sesiUtama.set(item.kelas.id, item)
}
const sesiTerbaruPerKelas = [...sesiUtama.values()]
```

Gunakan hasil deduplikasi untuk tabel, tetapi gunakan seluruh riwayat untuk menonaktifkan pilihan kelas.

- [ ] **Step 3: Perbarui copy dan tabel admin**

Ubah:

- deskripsi halaman menjadi token hanya ditampilkan saat dibuat/diganti;
- alert menjadi penjelasan satu sesi permanen per kelas;
- teks pembukaan menjadi sesi hanya sekali;
- kolom “Kedaluwarsa token” menjadi “Masa berlaku”; isinya “Tanpa batas waktu” saat aktif dan “Ditutup permanen” saat tidak aktif;
- label status sesuai semantik tersebut;
- tindakan sesi aktif tetap **Tutup sesi**.

Jangan tampilkan tanggal sentinel.

- [ ] **Step 4: Sederhanakan `TampilanQrLms` menjadi QR statis**

Ganti nama internal menjadi `TampilanQrAbsensi`. Hapus:

- `INTERVAL_ROTASI_DETIK`;
- state countdown dan `autoRotate`;
- kedua timer `useEffect`;
- progress bar normal/projector;
- toggle Auto-Refresh;
- callback otomatis refresh.

Pertahankan:

- QR image;
- tautan cadangan;
- projector mode;
- tombol **Ganti QR** manual;
- loading state.

Copy projector: “QR ini aktif tanpa batas waktu selama sesi belum ditutup.”

- [ ] **Step 5: Hapus input masa berlaku dan tandai kelas terpakai**

Ubah tipe:

```ts
export type PilihanKelas = {
	id: string
	judul: string
	sudahMemilikiSesi: boolean
}
```

Render opsi:

```tsx
<option
	key={item.id}
	value={item.id}
	disabled={item.sudahMemilikiSesi}
>
	{item.judul}{item.sudahMemilikiSesi ? " — sesi sudah pernah dibuat" : ""}
</option>
```

Hapus seluruh field `masaBerlakuMenit`. Jika semua kelas sudah pernah dipakai, disable submit dan tampilkan copy yang menjelaskan tidak ada kelas tersedia.

Pada penggantian QR, FormData hanya mengirim `sessionId`.

- [ ] **Step 6: Verifikasi kompilasi dan hygiene seluruh UI**

Run:

```bash
npm run typecheck
git diff --check -- \
  src/lib/layanan/absensi.ts \
  'src/app/(dashboard)/admin/absensi/aksi.ts' \
  'src/app/(dashboard)/admin/absensi/page.tsx' \
  'src/app/(dashboard)/admin/absensi/panel-qr.tsx'
```

Expected: exit `0`; jangan menjalankan test suite.

---

### Task 5: Review akhir tanpa test suite otomatis

**Files:**
- Review only: seluruh file Tasks 1–4
- Modify only if review menemukan defect dalam scope

**Interfaces:**
- Consumes: implementasi lengkap.
- Produces: laporan yang membedakan bukti kompilasi dari pengujian perilaku pengguna.

- [ ] **Step 1: Audit aturan domain dari source**

Pastikan:

- pembukaan sesi memakai advisory lock dan pemeriksaan riwayat apa pun;
- tidak ada `updateMany` yang diam-diam menutup sesi lama;
- scan tidak membaca kedaluwarsa;
- ganti QR menolak sesi tertutup;
- token lama invalid karena hash diganti;
- daftar peserta tidak memfilter waktu;
- UI tidak menampilkan sentinel atau countdown;
- data lama tetap dipertahankan dan hanya sesi terbaru tampil sebagai baris utama;
- seluruh riwayat, bukan hanya 50 terbaru, menentukan kelas sudah pernah dipakai.

- [ ] **Step 2: Jalankan hanya verifikasi yang diizinkan**

Run:

```bash
npm run typecheck
git diff --check -- \
  src/lib/validasi.ts \
  src/lib/layanan/absensi.ts \
  'src/app/(dashboard)/admin/absensi/aksi.ts' \
  'src/app/(dashboard)/admin/absensi/page.tsx' \
  'src/app/(dashboard)/admin/absensi/panel-qr.tsx'
```

Expected: exit `0`.

Jangan menjalankan:

```text
npx vitest run
npm run test
npx playwright test
```

- [ ] **Step 3: Lakukan review independen read-only**

Reviewer harus memeriksa race condition PostgreSQL, RBAC, preservasi data lama, keamanan token, dan kemungkinan sesi kedua. Reviewer tidak boleh mengklaim runtime lulus karena test suite sengaja dilewati.

- [ ] **Step 4: Laporkan hasil secara jujur**

Laporan akhir wajib menyebut:

- file yang diubah;
- typecheck dan diff check aktual;
- test otomatis **tidak ditambahkan dan tidak dijalankan atas permintaan pengguna**;
- perilaku runtime menunggu pengujian mandiri pengguna;
- tidak ada commit/push.
