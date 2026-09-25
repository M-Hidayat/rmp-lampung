# Design System Master File — RMP Lampung

> **SUMBER KEBENARAN: [`/DESIGN.md`](../DESIGN.md)**
>
> Berkas ini adalah ringkasan navigasi, **bukan** spesifikasi. Nilai normatif
> (warna, tipografi, radius, spasi, komponen) hanya ada di `DESIGN.md` dan
> diimplementasikan di `src/app/globals.css`.
>
> Berkas ini sebelumnya memuat palet hasil generate otomatis yang **berbeda**
> dari `DESIGN.md` (mis. Secondary `#334155`, CTA `#0369A1`, latar `#F8FAFC`,
> foregound `#020617`, dan tipografi Inter+Inter). Kontradiksi itu membuat warna
> berbeda antar halaman. Sekarang berkas ini tidak boleh lagi mendefinisikan
> nilai sendiri — bila ada perbedaan, `DESIGN.md` yang berlaku.

**Project:** RMP Lampung — Rumah Mama Pintar
**Ruang lingkup:** seluruh permukaan aplikasi (publik, autentikasi, dashboard admin & peserta)

---

## Ringkasan cepat (rujukan; nilai lengkap ada di `DESIGN.md`)

### Palet inti

| Peran | Hex | Token Tailwind | Rasio terukur |
|------|-----|----------------|---------------|
| Primary (aksi utama) | `#0F172A` | `bg-primary` | 17.85:1 putih di atasnya (AAA) |
| Brand (identitas kuliner) | `#B22222` | `bg-brand` | 6.68:1 di atas putih (AA) |
| Accent (permukaan CTA) | `#FFF7ED` | `bg-accent` | — |
| Accent foreground | `#C2410C` | `text-accent-foreground` | 4.88:1 di atas accent (AA) |
| Background | `#F9FAFB` | `bg-background` | 17.08:1 dengan foreground (AAA) |
| Card | `#FFFFFF` | `bg-card` | — |
| Muted foreground | `#475569` | `text-muted-foreground` | 7.58:1 di atas kartu (AAA) |
| Border | `#E2E8F0` | `border-border` | — |
| Ring (fokus) | `#C2410C` | `ring-ring` | 5.18:1 terhadap kartu |
| Success | `#15803D` | `text-success` / `bg-success` | 5.02:1 (AA) |
| Warning | `#B45309` | `text-warning` / `bg-warning` | 5.02:1 (AA) |
| Destructive | `#B91C1C` | `text-destructive` / `bg-destructive` | 6.47:1 (AA) |
| Decorative amber | `#FFC107` | `fill-decorative-amber` | **3.19:1 — dilarang untuk teks** |

### Tipografi

- **Judul:** Montserrat (bobot 700–800, letter-spacing `-0.02em` s.d. `-0.025em`)
- **Isi & data:** Inter
- Variabel font: `--font-montserrat`, `--font-inter`; dipetakan ke `font-heading` dan `font-sans`.

### Radius

`sm` 6px · `md` 8px · **`lg` 12px (default)** · `xl` 16px · `2xl` 24px · `full`

### Spasi

`xs` 4 · `sm` 8 · `md` 16 · `lg` 24 · `xl` 32 · `2xl` 48 · `3xl` 64 (piksel)

### Kedalaman

Tiga tingkat saja: datar (`border`), terangkat (`shadow-sm`), melayang (`shadow-md`).

---

## Aturan yang mengikat

1. **Warna hanya dari token semantik.** Kelas palet mentah Tailwind
   (`bg-zinc-100`, `text-slate-600`, `border-zinc-200`) dan heksadesimal di
   `className` dilarang. Ini penyebab utama tampilan berbeda antar halaman.
2. **Status memakai `Badge`**, perhatian sistem memakai `Alert`, keadaan kosong
   memakai `Empty`, pemisah memakai `Separator`, placeholder memuat memakai
   `Skeleton`. Jangan membuat markup bergaya sendiri untuk keperluan itu.
3. **Satu aksi utama per layar.** `Button variant="default"` (navy) untuk itu;
   `variant="gold"` untuk jalur bernilai berulang (daftar/bayar/hubungi).
4. **Kartu memakai komposisi penuh** `CardHeader` → `CardContent` → `CardFooter`,
   dan satu radius per kartu.
5. **Jarak memakai `gap-*`**, bukan `space-x-*` / `space-y-*`.
6. **Target sentuh minimal 44×44px**; cincin fokus selalu terlihat.
7. **Tidak ada konten yang dikarang** — testimoni, foto, logo, angka, dan klaim
   wajib bersumber dan dapat diperiksa.

## Verifikasi

Sebelum menyerahkan UI, jalankan:

```bash
# Lint DESIGN.md (struktur + referensi token + kontras WCAG).
# CATATAN PENTING: `npx -y @google/design.md lint ...` DIAM (exit 0, tanpa
# output) di Windows/git-bash sehingga hasilnya tidak bisa dipercaya.
# Panggil CLI-nya lewat Node secara langsung:
DESIGNMD=$(ls -d ~/AppData/Local/npm-cache/_npx/*/node_modules/@google/design.md 2>/dev/null | head -1)
node "$DESIGNMD/dist/index.js" lint DESIGN.md

npm run typecheck
npx vitest run
npx playwright test    # butuh server di :3001; jalankan detached + notify
npm run lint
```

### Checklist pra-pengiriman

- [ ] Tidak ada kelas palet mentah (`bg-zinc-*`, `text-slate-*`) atau heksadesimal di `className`
- [ ] Tidak ada `space-x-*` / `space-y-*` (pakai `gap-*`)
- [ ] Permukaan datar: `shadow-*` hanya pada elemen mengambang (dropdown, drawer, dialog)
- [ ] Radius hanya dari skala `sm 4 / md 6 / lg 8 / xl 12 / 2xl 16`
- [ ] Semua ikon dari Lucide; ikon dekoratif diberi `aria-hidden="true"`
- [ ] `cursor-pointer` pada elemen yang dapat diklik
- [ ] Transisi 150–300ms; `prefers-reduced-motion` dihormati
- [ ] Kontras teks minimal 4.5:1; cincin fokus minimal 3:1
- [ ] Keadaan fokus terlihat untuk navigasi keyboard
- [ ] Responsif pada 375 / 768 / 1024 / 1440 px, tanpa overflow horizontal
- [ ] Konten tidak tertutup header lengket (`scroll-mt-24` pada anchor)
