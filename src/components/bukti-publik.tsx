import Image from "next/image"
import {
	ArrowUpRight,
	Building2,
	GraduationCap,
	Instagram,
	MapPin,
	Newspaper,
	Quote,
	Star,
	Users,
} from "lucide-react"

import {
	buktiPublik,
	profilInstagram,
	profilMaps,
	ringkasanBukti,
	ulasanMaps,
	type BuktiPublik as TBukti,
} from "@/lib/bukti-publik"
import { galeriKegiatan, type FotoKegiatan } from "@/lib/galeri-kegiatan"
import { cn } from "@/lib/utils"

const labelJenis: Record<TBukti["jenis"], { teks: string; Ikon: typeof Newspaper }> = {
	"liputan-media": { teks: "Liputan media", Ikon: Newspaper },
	"institusi-pendidikan": { teks: "Institusi pendidikan", Ikon: GraduationCap },
	organisasi: { teks: "Organisasi & komunitas", Ikon: Users },
}

function formatBulan(tanggal: string) {
	return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(
		new Date(tanggal),
	)
}

/** Bintang penuh/kosong sebagai ikon, dengan label aksesibilitas yang benar. */
function Bintang({ nilai, ukuran = "size-4" }: { nilai: number; ukuran?: string }) {
	return (
		<span
			className="inline-flex items-center gap-0.5"
			role="img"
			aria-label={`Penilaian ${nilai} dari 5`}
		>
			{[1, 2, 3, 4, 5].map((i) => (
				<Star
					key={i}
					aria-hidden="true"
					className={cn(
						ukuran,
						i <= Math.round(nilai)
							? "fill-[var(--color-brand-gold)] text-[var(--color-brand-gold)]"
							: "fill-border text-border",
					)}
				/>
			))}
		</span>
	)
}

/**
 * Penilaian Google Maps beserta ulasan asli peserta.
 *
 * Kutipan di sini diambil apa adanya dari Google Maps, termasuk salah tulis
 * aslinya, dan setiap kartu menautkan sumbernya. Tidak ada ulasan yang dibuat
 * atau dihaluskan oleh sistem ini.
 */
export function UlasanPeserta({ batas = 3 }: { batas?: number }) {
	const tampil = ulasanMaps.slice(0, batas)

	return (
		<section id="ulasan" aria-labelledby="judul-ulasan" className="scroll-mt-24 space-y-6">
			<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
						Kata peserta
					</p>
					<h2 id="judul-ulasan" className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
						Ulasan asli dari Google
					</h2>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						Kutipan di bawah ditulis peserta sendiri di Google Maps dan tidak kami
						ubah, termasuk salah tulisnya. Silakan periksa langsung di tautannya.
					</p>
				</div>

				{/* Ringkasan penilaian */}
				<div className="shrink-0 rounded-2xl border border-border bg-card p-5 shadow-sm">
					<div className="flex items-center gap-4">
						<div>
							<p className="font-heading text-4xl font-bold leading-none text-foreground">
								{profilMaps.rating.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">dari 5</p>
						</div>
						<div>
							<Bintang nilai={profilMaps.rating} ukuran="size-4" />
							<p className="mt-1.5 text-xs text-muted-foreground">
								{profilMaps.jumlahUlasan} ulasan Google
							</p>
						</div>
					</div>
					<a
						href={profilMaps.url}
						target="_blank"
						rel="noreferrer noopener"
						className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						Lihat di Google Maps
						<ArrowUpRight className="size-4" aria-hidden="true" />
					</a>
				</div>
			</div>

			<div className="grid gap-5 md:grid-cols-3">
				{tampil.map((u) => (
					<figure
						key={u.nama + u.ketika}
						className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
					>
						<Bintang nilai={5} ukuran="size-3.5" />
						<blockquote className="mt-3 flex-1">
							<Quote className="size-4 text-accent-foreground" aria-hidden="true" />
							<p className="mt-2 text-sm leading-6 text-card-foreground">{u.teks}</p>
						</blockquote>
						<figcaption className="mt-4 border-t border-border pt-3">
							<p className="text-sm font-semibold text-foreground">{u.nama}</p>
							<p className="text-xs text-muted-foreground">
								{u.profil ? `${u.profil} · ` : ""}
								{u.ketika}
							</p>
						</figcaption>
					</figure>
				))}
			</div>

			{/* Tautan sosial resmi untuk verifikasi mandiri */}
			<div className="flex flex-wrap gap-3">
				<a
					href={profilInstagram.url}
					target="_blank"
					rel="noreferrer noopener"
					className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<Instagram className="size-4 text-accent-foreground" aria-hidden="true" />
					{profilInstagram.akun}
					<span className="font-normal text-muted-foreground">{profilInstagram.pengikut} pengikut</span>
				</a>
				<a
					href={profilMaps.url}
					target="_blank"
					rel="noreferrer noopener"
					className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<MapPin className="size-4 text-accent-foreground" aria-hidden="true" />
					{profilMaps.alamat.split(",")[0]}
				</a>
			</div>
		</section>
	)
}

/**
 * Liputan pihak ketiga: institusi pendidikan, organisasi, dan media.
 * Setiap kartu menautkan sumber aslinya agar dapat diperiksa sendiri.
 */
export function BuktiPublik({ jumlahAwal = 3 }: { jumlahAwal?: number }) {
	const ringkas = ringkasanBukti()
	const daftar = buktiPublik.slice(0, jumlahAwal)

	return (
		<section id="bukti" aria-labelledby="judul-bukti" className="scroll-mt-24 space-y-6">
			<div className="max-w-2xl">
				<p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">Rekam jejak</p>
				<h2 id="judul-bukti" className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
					Dipercaya sekolah dan komunitas
				</h2>
				<p className="mt-2 text-sm leading-6 text-muted-foreground">
					Rumah Mama Pintar telah bekerja sama dengan sekolah dan organisasi. Setiap
					sumber di bawah ini dapat Anda periksa sendiri lewat tautannya.
				</p>
			</div>

			<div className="grid gap-5 lg:grid-cols-3">
				{daftar.map((bukti) => {
					const { teks, Ikon } = labelJenis[bukti.jenis]
					return (
						<article
							key={bukti.id}
							className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
						>
							<div className="flex items-center gap-2">
								<span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-card-foreground">
									<Ikon className="size-3.5 shrink-0 text-accent-foreground" aria-hidden="true" />
									{teks}
								</span>
								<span className="text-xs text-muted-foreground">{formatBulan(bukti.tanggal)}</span>
							</div>

							<h3 className="mt-4 font-heading text-base font-bold leading-snug text-foreground">
								{bukti.judul}
							</h3>
							<p className="mt-1 text-xs font-medium text-muted-foreground">{bukti.penerbit}</p>
							<p className="mt-3 text-sm leading-6 text-muted-foreground">{bukti.ringkas}</p>

							{bukti.kutipan?.length ? (
								<blockquote className="mt-4 rounded-xl border border-border bg-muted p-4">
									<Quote className="size-4 text-accent-foreground" aria-hidden="true" />
									<p className="mt-2 text-sm leading-6 text-card-foreground">
										“{bukti.kutipan[0].teks}”
									</p>
									<footer className="mt-2 text-xs font-medium text-muted-foreground">
										{bukti.kutipan[0].oleh}
									</footer>
								</blockquote>
							) : null}

							{bukti.fakta?.length ? (
								<ul className="mt-4 space-y-1.5">
									{bukti.fakta.map((f) => (
										<li key={f} className="flex gap-2 text-xs leading-5 text-muted-foreground">
											<span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
											<span className="min-w-0">{f}</span>
										</li>
									))}
								</ul>
							) : null}

							<a
								href={bukti.url}
								target="_blank"
								rel="noreferrer noopener"
								className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 text-sm font-semibold text-accent-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								Baca sumber asli
								<ArrowUpRight className="size-4" aria-hidden="true" />
							</a>
						</article>
					)
				})}
			</div>

			<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
				<Building2 className="size-3.5 shrink-0 text-accent-foreground" aria-hidden="true" />
				<span>
					{ringkas.jumlahLiputan} sumber pihak ketiga dari {ringkas.jumlahPenerbit} penerbit
					berbeda, terbit antara {ringkas.tahunTerawal} sampai {ringkas.tahunTerbaru}.
				</span>
			</p>
		</section>
	)
}

/**
 * Galeri dokumentasi kegiatan.
 *
 * Memakai foto ASLI dari arsip resmi RMP (`src/lib/galeri-kegiatan.ts`).
 * Ukuran kartu seragam 4:3 dengan `object-cover` agar baris tetap rapi walau
 * rasio berkas aslinya berbeda-beda.
 */
export function GaleriKegiatan({ foto = galeriKegiatan }: { foto?: FotoKegiatan[] }) {
	return (
		<section id="galeri" aria-labelledby="judul-galeri" className="scroll-mt-24 space-y-6">
			<div className="max-w-2xl">
				<p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">Dokumentasi</p>
				<h2 id="judul-galeri" className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
					Suasana kegiatan
				</h2>
				<p className="mt-2 text-sm leading-6 text-muted-foreground">
					Dokumentasi langsung dari kelas dan pelatihan Rumah Mama Pintar.
				</p>
			</div>

			{foto.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
					<h3 className="font-heading font-bold text-foreground">Belum ada foto</h3>
					<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
						Dokumentasi kegiatan akan ditampilkan di sini.
					</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{foto.map((g) => (
						<figure
							key={g.src}
							className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
						>
							<div className="relative aspect-[4/3] overflow-hidden bg-muted">
								<Image
									src={g.src}
									alt={g.alt}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
								/>
							</div>
							{g.keterangan ? (
								<figcaption className="px-4 py-3 text-xs leading-5 text-muted-foreground">
									{g.keterangan}
								</figcaption>
							) : null}
						</figure>
					))}
				</div>
			)}
		</section>
	)
}
