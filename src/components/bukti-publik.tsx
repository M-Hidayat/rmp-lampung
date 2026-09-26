import Image from "next/image"
import {
	ArrowUpRight,
	Building2,
	GraduationCap,
	Newspaper,
	Quote,
	Star,
	Users,
} from "lucide-react"

import { LabelBagian } from "@/components/kerangka"
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	buktiPublik,
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

/**
 * Bintang penilaian.
 *
 * Memakai token `decorative-amber` (#FFC107) yang HANYA boleh jadi isian
 * grafis. Karena itu setiap bintang dekoratif diberi `aria-hidden` dan makna
 * penilaian dibawa oleh `aria-label` pada pembungkusnya.
 */
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
							? "fill-decorative-amber text-warning"
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
		<section id="ulasan" aria-label="Ulasan peserta" className="scroll-mt-24">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="flex max-w-2xl flex-col gap-3">
					<LabelBagian>Kata peserta</LabelBagian>
				</div>

				<Card className="shrink-0 lg:max-w-xs">
					<CardContent className="flex flex-col gap-4 p-6">
						<div className="flex items-center gap-4">
							<p className="font-heading text-4xl font-bold leading-none text-foreground">
								{profilMaps.rating.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
							</p>
							<div className="flex flex-col gap-1.5">
								<Bintang nilai={profilMaps.rating} />
								<p className="text-xs text-muted-foreground">
									{profilMaps.jumlahUlasan} ulasan Google
								</p>
							</div>
						</div>
						<a
							href={profilMaps.url}
							target="_blank"
							rel="noreferrer noopener"
							className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							Lihat di Google Maps
							<ArrowUpRight aria-hidden="true" className="size-4" />
						</a>
					</CardContent>
				</Card>
			</div>

			{/* Ulasan dipindahkan ke carousel agar dapat digeser di layar sempit
			    tanpa memaksa pengguna menggulir halaman sangat panjang. */}
			<Carousel
				className="mt-8"
				label="Ulasan peserta dari Google Maps"
				opts={{ align: "start", loop: false }}
			>
				<CarouselContent>
					{tampil.map((u, indeks) => (
						<CarouselItem
							key={u.nama + u.ketika}
							className="sm:basis-1/2 lg:basis-1/3"
							aria-label={`Ulasan ${indeks + 1} dari ${tampil.length}`}
						>
							<Card className="h-full">
								<CardContent className="flex h-full flex-col p-6">
									<Bintang nilai={5} ukuran="size-3.5" />
									<blockquote className="mt-3 flex-1">
										<Quote aria-hidden="true" className="size-4 text-brand" />
										<p className="mt-2 text-sm leading-6 text-card-foreground">{u.teks}</p>
									</blockquote>
									{/* Bukan <figcaption>: kartu ini memakai Card, bukan <figure>,
									    sehingga figcaption di sini akan melanggar struktur HTML. */}
									<div className="mt-4 border-t border-border pt-3">
										<p className="text-sm font-semibold text-foreground">{u.nama}</p>
										<p className="text-xs text-muted-foreground">
											{u.profil ? `${u.profil} · ` : ""}
											{u.ketika}
										</p>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
				<CarouselDots className="mt-5" />
			</Carousel>
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
		<section id="bukti" aria-label="Rekam jejak pihak ketiga" className="scroll-mt-24">
			<div className="flex max-w-2xl flex-col gap-3">
				<LabelBagian>Rekam jejak</LabelBagian>
			</div>

			<div className="mt-8 grid gap-5 lg:grid-cols-3">
				{daftar.map((bukti) => {
					const { teks, Ikon } = labelJenis[bukti.jenis]
					return (
						<Card key={bukti.id} className="h-full">
							<CardContent className="flex h-full min-w-0 flex-col p-6">
								<div className="flex items-center gap-2">
									<span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
										<Ikon aria-hidden="true" className="size-3.5 shrink-0 text-brand" />
										{teks}
									</span>
									<span className="text-xs text-muted-foreground">
										{formatBulan(bukti.tanggal)}
									</span>
								</div>

								<h3 className="mt-4 font-heading text-base font-bold leading-snug text-foreground">
									{bukti.judul}
								</h3>
								<p className="mt-1 text-xs font-medium text-muted-foreground">
									{bukti.penerbit}
								</p>
								<p className="mt-3 text-sm leading-6 text-muted-foreground">
									{bukti.ringkas}
								</p>

								{bukti.kutipan?.length ? (
									<blockquote className="mt-4 rounded-lg border border-border bg-muted p-4">
										<Quote aria-hidden="true" className="size-4 text-brand" />
										<p className="mt-2 text-sm leading-6 text-card-foreground">
											“{bukti.kutipan[0].teks}”
										</p>
										<footer className="mt-2 text-xs font-medium text-muted-foreground">
											{bukti.kutipan[0].oleh}
										</footer>
									</blockquote>
								) : null}

								{bukti.fakta?.length ? (
									<ul className="mt-4 flex flex-col gap-1.5">
										{bukti.fakta.map((f) => (
											<li key={f} className="flex gap-2 text-xs leading-5 text-muted-foreground">
												<span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
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
									<ArrowUpRight aria-hidden="true" className="size-4" />
								</a>
							</CardContent>
						</Card>
					)
				})}
			</div>

			<p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
				<Building2 aria-hidden="true" className="size-3.5 shrink-0 text-brand" />
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
		<section id="galeri" aria-label="Dokumentasi kegiatan" className="scroll-mt-24">
			<div className="flex max-w-2xl flex-col gap-3">
				<LabelBagian>Dokumentasi</LabelBagian>
			</div>

			{foto.length === 0 ? (
				<Card className="mt-8 border-dashed">
					<CardHeader className="items-center text-center">
						<CardTitle>Belum ada foto</CardTitle>
						<CardDescription>
							Dokumentasi kegiatan akan ditampilkan di sini.
						</CardDescription>
					</CardHeader>
				</Card>
			) : (
				<Carousel
					className="mt-8"
					label="Dokumentasi kegiatan Rumah Mama Pintar"
					opts={{ align: "start", loop: false }}
				>
					<CarouselContent>
						{foto.map((g, indeks) => (
							<CarouselItem
								key={g.src}
								className="sm:basis-1/2 lg:basis-1/3"
								aria-label={`Foto ${indeks + 1} dari ${foto.length}`}
							>
								<figure className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/20">
									<div className="relative aspect-4/3 overflow-hidden bg-muted">
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
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
					<CarouselDots className="mt-5" />
				</Carousel>
			)}
		</section>
	)
}