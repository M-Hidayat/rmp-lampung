import Image from "next/image"
import { ArrowUpRight, Building2, GraduationCap, Newspaper, Quote, Users } from "lucide-react"

import { buktiPublik, ringkasanBukti, type BuktiPublik } from "@/lib/bukti-publik"
import { cn } from "@/lib/utils"

const labelJenis: Record<BuktiPublik["jenis"], { teks: string; Ikon: typeof Newspaper }> = {
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
 * Bukti publik yang dapat diperiksa sendiri oleh pengunjung.
 *
 * Setiap kartu menautkan sumber aslinya dan menyebut penerbitnya, sehingga
 * kredibilitas berasal dari pihak ketiga — bukan klaim di situs ini sendiri.
 * Tidak ada testimoni karangan di sini.
 */
export function BuktiPublik({ jumlahAwal = 3 }: { jumlahAwal?: number }) {
	const ringkas = ringkasanBukti()
	const daftar = buktiPublik.slice(0, jumlahAwal)

	return (
		<section id="bukti" aria-labelledby="judul-bukti" className="scroll-mt-24 space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
						Rekam jejak
					</p>
					<h2 id="judul-bukti" className="mt-2 font-heading text-2xl font-bold text-zinc-950 sm:text-3xl">
						Dipercaya sekolah dan komunitas
					</h2>
					<p className="mt-2 text-sm leading-6 text-zinc-600">
						Rumah Mama Pintar telah bekerja sama dengan sekolah dan organisasi.
						Setiap sumber di bawah ini dapat Anda periksa sendiri lewat tautannya.
					</p>
				</div>
			</div>

			<div className="grid gap-5 lg:grid-cols-3">
				{daftar.map((bukti) => {
					const { teks, Ikon } = labelJenis[bukti.jenis]
					return (
						<article
							key={bukti.id}
							className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
						>
							<div className="flex items-center gap-2">
								<span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
									<Ikon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
									{teks}
								</span>
								<span className="text-xs text-zinc-500">{formatBulan(bukti.tanggal)}</span>
							</div>

							<h3 className="mt-4 font-heading text-base font-bold leading-snug text-zinc-950">
								{bukti.judul}
							</h3>
							<p className="mt-1 text-xs font-medium text-zinc-500">{bukti.penerbit}</p>
							<p className="mt-3 text-sm leading-6 text-zinc-600">{bukti.ringkas}</p>

							{bukti.kutipan?.length ? (
								<blockquote className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
									<Quote className="size-4 text-primary" aria-hidden="true" />
									<p className="mt-2 text-sm leading-6 text-zinc-700">
										“{bukti.kutipan[0].teks}”
									</p>
									<footer className="mt-2 text-xs font-medium text-zinc-500">
										{bukti.kutipan[0].oleh}
									</footer>
								</blockquote>
							) : null}

							{bukti.fakta?.length ? (
								<ul className="mt-4 space-y-1.5">
									{bukti.fakta.map((f) => (
										<li key={f} className="flex gap-2 text-xs leading-5 text-zinc-600">
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
								className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								Baca sumber asli
								<ArrowUpRight className="size-4" aria-hidden="true" />
							</a>
						</article>
					)
				})}
			</div>

			<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
				<Building2 className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
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
 * Sengaja menerima `foto` dari luar: situs tidak menyimpan foto milik media
 * pihak ketiga karena hak ciptanya bukan milik RMP. Selama pemilik belum
 * mengirim foto asli, komponen ini menampilkan keadaan kosong yang jujur
 * alih-alih gambar stok.
 */
export function GaleriKegiatan({
	foto = [],
}: {
	foto?: { src: string; alt: string; keterangan?: string }[]
}) {
	return (
		<section id="galeri" aria-labelledby="judul-galeri" className="scroll-mt-24 space-y-6">
			<div className="max-w-2xl">
				<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Dokumentasi</p>
				<h2 id="judul-galeri" className="mt-2 font-heading text-2xl font-bold text-zinc-950 sm:text-3xl">
					Suasana kegiatan
				</h2>
				<p className="mt-2 text-sm leading-6 text-zinc-600">
					Dokumentasi langsung dari kelas dan pelatihan Rumah Mama Pintar.
				</p>
			</div>

			{foto.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center sm:p-12">
					<Image
						src="/images/hero-culinary.jpg"
						alt="Ilustrasi suasana kelas kuliner Rumah Mama Pintar"
						width={1200}
						height={600}
						className="mx-auto h-auto w-full max-w-lg rounded-xl object-cover opacity-35"
					/>
					<h3 className="mt-6 font-heading font-bold text-zinc-950">
						Foto kegiatan sedang disiapkan
					</h3>
					<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
						Galeri ini akan diisi dokumentasi asli kelas dan pelatihan. Sementara itu,
						Anda dapat melihat rekam jejak kerja sama kami bersama sekolah dan komunitas
						di bagian atas halaman.
					</p>
				</div>
			) : (
				<div className={cn("grid gap-4", foto.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2")}>
					{foto.map((g) => (
						<figure key={g.src} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
							<Image
								src={g.src}
								alt={g.alt}
								width={800}
								height={600}
								className="aspect-[4/3] w-full object-cover"
							/>
							{g.keterangan ? (
								<figcaption className="px-4 py-3 text-xs leading-5 text-zinc-600">
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
