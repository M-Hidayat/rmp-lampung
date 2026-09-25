# Kelola Kelas Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah menu Kelola Kelas menjadi pusat kerja yang ringkas dengan halaman daftar, tambah, dan edit terpisah tanpa mengubah aturan bisnis kelas.

**Architecture:** Server pages tetap mengambil sesi dan data melalui domain service. Halaman daftar hanya merender ringkasan dan tindakan operasional; formulir yang sama digunakan oleh route tambah dan edit. Domain service memperoleh satu fungsi read-admin berdasarkan ID, sedangkan server action yang berhasil melakukan redirect ke daftar.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Prisma, Tailwind CSS, Vitest, Playwright.

## Global Constraints

- Tidak menambah dependency atau mengubah skema database.
- Tidak mengubah aturan slug unik, kuota, status aktif, RBAC, atau katalog publik.
- Tidak menghapus kelas; kelas lama tetap dinonaktifkan.
- Pertahankan seluruh perubahan pengguna yang sudah ada di dirty checkout.
- Gunakan Bahasa Indonesia yang natural dan faktual.
- Target interaksi minimum 44 piksel dan fokus keyboard harus terlihat.
- Jangan commit atau push tanpa permintaan pengguna.
- Implementasi lengkap lebih dahulu, kemudian pengujian dan review.

---

### Task 1: Kontrak data edit kelas admin

**Files:**
- Modify: `src/lib/layanan/kelas.ts`
- Create: `src/lib/layanan/kelas.test.ts`

**Interfaces:**
- Produces: `ambilKelasOperasional(sesi: SesiPengguna | null, classId: string, dependensi?: DependensiKelas)`.
- Returns: satu `CourseClass` beserta `_count.enrollments` yang hanya menghitung status pemakai kuota.
- Throws: `KesalahanDomain("TIDAK_DITEMUKAN", "Kelas tidak ditemukan.")` jika ID tidak ada.

- [ ] **Step 1: Tambahkan fungsi baca admin berdasarkan ID**

Di `src/lib/layanan/kelas.ts`, gunakan pola otorisasi yang sama dengan `daftarKelasOperasional()`:

```ts
export async function ambilKelasOperasional(
	sesi: SesiPengguna | null,
	classId: string,
	dependensi: DependensiKelas = {},
) {
	wajibKemampuan(sesi, "kelola_kelas")
	const db = dependensi.db ?? prisma
	const kelas = await db.courseClass.findUnique({
		where: { id: classId },
		include: {
			_count: {
				select: {
					enrollments: {
						where: { status: { in: statusPendaftaranMemakaiKuota } },
					},
				},
			},
		},
	})
	if (!kelas) throw new KesalahanDomain("TIDAK_DITEMUKAN", "Kelas tidak ditemukan.")
	return kelas
}
```

- [ ] **Step 2: Tambahkan unit test kontrak fungsi**

Di `src/lib/layanan/kelas.test.ts`, buat fake DB minimal dan uji:

```ts
it("mengambil kelas operasional berdasarkan id", async () => {
	const findUnique = vi.fn().mockResolvedValue({ id: "kelas-1", judul: "Kelas Roti", _count: { enrollments: 2 } })
	const hasil = await ambilKelasOperasional(admin, "kelas-1", { db: { courseClass: { findUnique } } as never })
	expect(hasil.id).toBe("kelas-1")
	expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "kelas-1" } }))
})

it("menolak id kelas yang tidak ditemukan", async () => {
	const db = { courseClass: { findUnique: vi.fn().mockResolvedValue(null) } } as never
	await expect(ambilKelasOperasional(admin, "hilang", { db })).rejects.toMatchObject({ kode: "TIDAK_DITEMUKAN" })
})
```

Gunakan bentuk `SesiPengguna` admin yang sama dengan test RBAC yang sudah ada; jangan melemahkan tipe produksi.

- [ ] **Step 3: Jalankan pemeriksaan task**

Run:

```bash
npx vitest run src/lib/layanan/kelas.test.ts
npm run typecheck
git diff --check -- src/lib/layanan/kelas.ts src/lib/layanan/kelas.test.ts
```

Expected: seluruh test baru lulus, TypeScript exit `0`, tidak ada whitespace error.

---

### Task 2: Formulir kelas reusable untuk halaman khusus

**Files:**
- Modify: `src/app/(dashboard)/admin/kelas/formulir-kelas.tsx`

**Interfaces:**
- Consumes: `aksiBuatKelas`, `aksiPerbaruiKelas`, dan `NilaiAwalKelas` yang sudah ada.
- Produces: `FormulirKelas` dengan pengelompokan visual serta tombol batal, tanpa mengubah nama field FormData.

- [ ] **Step 1: Tambahkan prop tujuan batal**

Perluas props secara minimum:

```ts
export function FormulirKelas({
	mode,
	nilaiAwal = {},
	hrefBatal = "/admin/kelas",
}: {
	mode: "buat" | "ubah"
	nilaiAwal?: NilaiAwalKelas
	hrefBatal?: string
})
```

Import `Link` dari `next/link`. Jangan menambah state baru selain state judul/slug yang sudah diperlukan.

- [ ] **Step 2: Kelompokkan field berdasarkan pekerjaan admin**

Susun ulang markup yang sudah ada menjadi tiga `fieldset` semantik:

```tsx
<fieldset className="space-y-4">
	<legend className="text-sm font-semibold text-zinc-950">Informasi kelas</legend>
	{/* judul, slug, deskripsi */}
</fieldset>
<fieldset className="space-y-4 border-t border-border pt-5">
	<legend className="text-sm font-semibold text-zinc-950">Harga dan kapasitas</legend>
	{/* harga, kuota */}
</fieldset>
<fieldset className="space-y-4 border-t border-border pt-5">
	<legend className="text-sm font-semibold text-zinc-950">Jadwal dan lokasi</legend>
	{/* jadwal mulai, selesai, lokasi */}
</fieldset>
```

Pertahankan seluruh `name`, validasi browser, pesan field, default value, dan algoritme slug yang ada. Jangan menambahkan field gambar jika belum dirender oleh formulir saat ini.

- [ ] **Step 3: Tambahkan action bar yang jelas**

```tsx
<div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
	<Button asChild variant="outline" className="min-h-11">
		<Link href={hrefBatal}>Batal</Link>
	</Button>
	<Button type="submit" variant="gold" className="min-h-11 font-semibold" disabled={sedangProses}>
		{/* label proses yang sudah ada */}
	</Button>
</div>
```

Jika `Button` proyek tidak mendukung `asChild`, gunakan `Link` dengan kelas tombol yang sudah tersedia di project; jangan mengubah API komponen global hanya untuk fitur ini.

- [ ] **Step 4: Jalankan pemeriksaan task**

Run:

```bash
npm run typecheck
git diff --check -- 'src/app/(dashboard)/admin/kelas/formulir-kelas.tsx'
```

Expected: exit `0`.

---

### Task 3: Halaman daftar sebagai pusat kerja

**Files:**
- Modify: `src/app/(dashboard)/admin/kelas/page.tsx`

**Interfaces:**
- Consumes: `daftarKelasOperasional()`, `sisaKuota()`, `aksiUbahStatusKelas`.
- Produces: halaman daftar tanpa instance `FormulirKelas`.

- [ ] **Step 1: Hapus formulir inline dan konversi waktu lokal dari halaman daftar**

Hapus import `FormulirKelas`, tipe `NilaiAwalKelas`, ikon/form markup tambah inline, seluruh bagian **Ubah data kelas**, dan helper `keNilaiWaktuLokal()`. Halaman daftar tidak boleh lagi membangun nilai awal formulir.

- [ ] **Step 2: Hitung ringkasan dari data yang sudah tersedia**

Setelah query kelas:

```ts
const jumlahAktif = kelas.filter((item) => item.aktif).length
const jumlahNonaktif = kelas.length - jumlahAktif
const jumlahPesertaAktif = kelas.reduce((total, item) => total + item._count.enrollments, 0)
```

Render empat kartu ringkas: Total kelas, Aktif, Nonaktif, Peserta menggunakan kuota. Jangan menambah query.

- [ ] **Step 3: Jadikan header actionable**

Tambahkan `Link` dan tombol/kelas native menuju `/admin/kelas/baru`:

```tsx
<Link href="/admin/kelas/baru" className="inline-flex min-h-11 items-center ...">
	<Plus className="size-4" aria-hidden="true" />
	Tambah Kelas
</Link>
```

Pertahankan copy kebijakan non-delete dan alert aturan kuota.

- [ ] **Step 4: Tambahkan edit per baris dan empty CTA**

Pada setiap baris, letakkan dua tindakan yang tidak ambigu:

```tsx
<Link href={`/admin/kelas/${item.id}/ubah`} className="inline-flex min-h-11 items-center ...">
	Edit
</Link>
<FormulirAksi ... />
```

Empty state harus memiliki pesan dan tautan **Tambah kelas pertama**. Tabel tetap dibungkus `TableWrapper`; action boleh wrap agar tidak terpotong pada viewport sempit.

- [ ] **Step 5: Jalankan pemeriksaan task**

Run:

```bash
npm run typecheck
git diff --check -- 'src/app/(dashboard)/admin/kelas/page.tsx'
```

Expected: exit `0`; pencarian berikut menghasilkan nol instance formulir:

```bash
rg '<FormulirKelas' 'src/app/(dashboard)/admin/kelas/page.tsx'
```

Gunakan `search_files` bila menjalankan melalui Hermes.

---

### Task 4: Route tambah dan edit khusus

**Files:**
- Create: `src/app/(dashboard)/admin/kelas/baru/page.tsx`
- Create: `src/app/(dashboard)/admin/kelas/[id]/ubah/page.tsx`
- Modify: `src/app/(dashboard)/aksi.ts`

**Interfaces:**
- Consumes: `FormulirKelas`, `ambilKelasOperasional`, `sesiPengguna`, `notFound`, `redirect`.
- Produces: dua halaman form khusus dan redirect sukses kembali ke `/admin/kelas`.

- [ ] **Step 1: Buat halaman tambah**

`src/app/(dashboard)/admin/kelas/baru/page.tsx` harus memiliki metadata, satu `h1`, breadcrumb/tautan kembali, penjelasan singkat, serta satu card berisi:

```tsx
<FormulirKelas mode="buat" />
```

Gunakan copy **Tambah kelas** dan target tautan minimum 44 piksel.

- [ ] **Step 2: Buat halaman edit berdasarkan ID**

Gunakan kontrak params Next.js 15:

```ts
type Props = { params: Promise<{ id: string }> }

export default async function HalamanUbahKelas({ params }: Props) {
	const { id } = await params
	const sesi = await sesiPengguna()
	let kelas
	try {
		kelas = await ambilKelasOperasional(sesi, id)
	} catch (kesalahan) {
		if (kesalahan instanceof KesalahanDomain && kesalahan.kode === "TIDAK_DITEMUKAN") notFound()
		throw kesalahan
	}
	// bangun NilaiAwalKelas dan render form
}
```

Pindahkan helper waktu WIB ke file page edit sebagai fungsi lokal. Header menampilkan judul, `LencanaAktif`, dan copy `X dari Y kursi digunakan`.

- [ ] **Step 3: Redirect setelah create/update sukses**

Di `src/app/(dashboard)/aksi.ts`, import `redirect` dari `next/navigation`. Setelah `revalidatePath()` berhasil pada `aksiBuatKelas` dan `aksiPerbaruiKelas`, panggil:

```ts
redirect("/admin/kelas")
```

Letakkan redirect di luar blok `try/catch` bila perlu agar exception internal Next.js tidak diubah oleh `keStatus`. Pola aman:

```ts
let berhasil = false
try {
	// mutasi + revalidate
	berhasil = true
} catch (kesalahan) {
	return keStatus(kesalahan, "...")
}
if (berhasil) redirect("/admin/kelas")
return {}
```

Jangan redirect ketika validasi gagal, agar pesan per-field tetap terlihat.

- [ ] **Step 4: Jalankan pemeriksaan task**

Run:

```bash
npm run typecheck
git diff --check -- 'src/app/(dashboard)/admin/kelas/baru/page.tsx' 'src/app/(dashboard)/admin/kelas/[id]/ubah/page.tsx' 'src/app/(dashboard)/aksi.ts'
```

Expected: exit `0`.

---

### Task 5: Pengujian perilaku dan audit akhir

**Files:**
- Create or modify: `e2e/kelola-kelas-admin.spec.ts`
- Test: seluruh file fitur dari Task 1–4

**Interfaces:**
- Verifies: daftar tidak merender form inline, route tambah/edit, 404, tindakan status, validasi, responsivitas.

- [ ] **Step 1: Gunakan fixture autentikasi admin yang sudah tersedia**

Periksa konfigurasi/test helper repository sebelum menulis login. Jika belum ada fixture, lakukan login melalui UI menggunakan kredensial test dari environment; jangan hardcode secret atau akun produksi. Jika environment test tidak menyediakan admin, tandai E2E admin sebagai blocker konfigurasi dan tetap jalankan pengujian domain serta source assertions—jangan menciptakan kredensial demo.

- [ ] **Step 2: Tambahkan skenario daftar dan navigasi**

E2E harus membuktikan:

```ts
await page.goto("/admin/kelas")
await expect(page.getByRole("heading", { level: 1, name: "Kelola kelas" })).toBeVisible()
await expect(page.getByRole("link", { name: "Tambah Kelas" })).toHaveAttribute("href", "/admin/kelas/baru")
await expect(page.locator("main form")).toHaveCount(/* hanya form status yang memang ada, bukan form kelas */)
await expect(page.getByLabel("Judul kelas")).toHaveCount(0)
```

Klik tambah, verifikasi URL dan field utama. Jika data kelas fixture tersedia, klik Edit pada satu baris dan verifikasi URL `/admin/kelas/<id>/ubah` serta nilai judul terisi.

- [ ] **Step 3: Uji responsivitas daftar dan form**

Pada viewport `390 × 844` dan `1440 × 900`, ukur:

```ts
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
expect(overflow).toBe(false)
```

Pastikan tombol Tambah/Edit/Batal dapat dijangkau dan tidak terpotong. Jangan mengandalkan screenshot saja.

- [ ] **Step 4: Jalankan seluruh gerbang**

Run berurutan:

```bash
npm run typecheck
npx vitest run
npx playwright test
npm run lint
npm run build
git diff --check
```

Expected:
- Typecheck exit `0`.
- Vitest seluruh file lulus.
- Playwright seluruh test lulus, atau blocker environment admin dilaporkan eksplisit tanpa mengklaim E2E lulus.
- Lint tidak memiliki error baru pada file scope.
- Build exit `0`; bila Windows mengunci Prisma DLL, identifikasi proses pemegang tanpa membunuh proses pengguna dan laporkan build sebagai terblokir, bukan lulus.
- Diff check exit `0`.

- [ ] **Step 5: Review independen**

Reviewer read-only memeriksa:

- Tidak ada form tambah/edit massal pada `/admin/kelas`.
- Redirect tidak menelan error validasi.
- Fungsi read edit tetap dilindungi `kelola_kelas`.
- 404 hanya untuk tidak ditemukan, bukan untuk error otorisasi/database.
- Tindakan status tetap tersedia dan data riwayat tidak dihapus.
- Tidak ada perubahan backend, dependency, atau file di luar scope yang tidak diperlukan.
- Copy natural, hierarchy jelas, target 44 piksel, fokus terlihat, dan mobile tidak overflow.

Perbaiki seluruh temuan Critical/Important, lalu ulangi gerbang yang relevan sebelum menyatakan selesai.

---

## Requirement-to-Task Map

| Persyaratan | Task |
|---|---:|
| Daftar menjadi pusat kerja | 3 |
| Ringkasan operasional | 3 |
| Tambah pada halaman khusus | 2, 4 |
| Edit berdasarkan ID dan 404 | 1, 4 |
| Form dikelompokkan | 2 |
| Redirect sukses ke daftar | 4 |
| Status aktif/nonaktif tetap tersedia | 3 |
| Slug unik dan batas kuota tetap berlaku | 1, 2, 5 |
| Responsif dan aksesibel | 2, 3, 4, 5 |
| Tidak ada dependency/skema baru | Seluruh task |
| Verifikasi lengkap dan review | 5 |

## Deliberate Omissions

- Pencarian, filter, pagination, bulk action, delete, modal, dan side panel tidak dibuat karena belum dibutuhkan.
- Tidak ada abstraksi form schema baru; validasi server `skemaKelas` tetap menjadi sumber kebenaran.
- Tidak ada komponen statistik generik; empat kartu hanya digunakan pada satu halaman.
