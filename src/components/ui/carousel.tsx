"use client"

import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Carousel berbasis Embla.
 *
 * Sumber: registry `@shadcn/carousel` (new-york-v4), dengan penyesuaian lokal:
 * impor memakai alias `@/` milik proyek, dan tombol navigasi memakai `Button`
 * proyek sehingga target sentuh 44px (DESIGN.md) serta bahasa datar tanpa
 * bayangan tetap terjaga — registry memakai `size-8` (32px) dan `shadow-sm`.
 *
 * Aksesibilitas:
 * - Wadah `role="region"` + `aria-roledescription="carousel"`.
 * - Tombol panah dinonaktifkan (bukan disembunyikan) saat tidak bisa digeser,
 *   sehingga fokus keyboard tidak pernah loncat.
 * - Slaid memakai `role="group"` dengan `aria-roledescription="slide"` dan label
 *   posisi, sehingga pembaca layar mengumumkan "3 dari 5".
 */

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
	opts?: CarouselOptions
	plugins?: CarouselPlugin
	orientation?: "horizontal" | "vertical"
	setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0]
	api: ReturnType<typeof useEmblaCarousel>[1]
	scrollPrev: () => void
	scrollNext: () => void
	canScrollPrev: boolean
	canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
	const context = React.useContext(CarouselContext)

	if (!context) {
		throw new Error("useCarousel harus dipakai di dalam <Carousel />")
	}

	return context
}

function Carousel({
	orientation = "horizontal",
	opts,
	setApi,
	plugins,
	className,
	children,
	label,
	autoplay = false,
	...props
}: React.ComponentProps<"div"> &
	CarouselProps & {
		label?: string
		/** Geser otomatis. Dinonaktifkan bila pengguna mematikan animasi. */
		autoplay?: boolean
	}) {
	// Autoplay dijalankan lewat `setInterval`, bukan plugin embla-carousel-autoplay,
	// supaya hanya ada satu sumber kebenaran dan bisa dihentikan saat kursor
	// menyentuh atau fokus masuk ke carousel — kontrol tetap di tangan pengguna.
	const [berhentiSementara, setBerhentiSementara] = React.useState(false)

	const [carouselRef, api] = useEmblaCarousel(
		{
			...opts,
			axis: orientation === "horizontal" ? "x" : "y",
		},
		plugins,
	)
	const [canScrollPrev, setCanScrollPrev] = React.useState(false)
	const [canScrollNext, setCanScrollNext] = React.useState(false)

	const onSelect = React.useCallback((api: CarouselApi) => {
		if (!api) return
		setCanScrollPrev(api.canScrollPrev())
		setCanScrollNext(api.canScrollNext())
	}, [])

	const scrollPrev = React.useCallback(() => {
		api?.scrollPrev()
	}, [api])

	const scrollNext = React.useCallback(() => {
		api?.scrollNext()
	}, [api])

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault()
				scrollPrev()
			} else if (event.key === "ArrowRight") {
				event.preventDefault()
				scrollNext()
			}
		},
		[scrollPrev, scrollNext],
	)

	React.useEffect(() => {
		if (!api || !setApi) return
		setApi(api)
	}, [api, setApi])

	// Geser otomatis: berpindah tiap 5 detik dan kembali ke awal setelah slaid
	// terakhir. Berhenti sementara saat kursor menyentuh atau fokus keyboard
	// masuk, sehingga pengguna yang sedang membaca tidak diganggu.
	React.useEffect(() => {
		if (!api || !autoplay || berhentiSementara) return

		// Hormati preferensi sistem: bila pengguna mematikan animasi, jangan
		// menggeser apa pun. Ini juga mencegah gerakan yang memicu mabuk gerak.
		const media = window.matchMedia("(prefers-reduced-motion: reduce)")
		if (media.matches) return

		const id = window.setInterval(() => {
			if (api.canScrollNext()) {
				api.scrollNext()
			} else {
				api.scrollTo(0)
			}
		}, 5000)

		return () => window.clearInterval(id)
	}, [api, autoplay, berhentiSementara])

	React.useEffect(() => {
		if (!api) return
		onSelect(api)
		api.on("reInit", onSelect)
		api.on("select", onSelect)

		return () => {
			api.off("select", onSelect)
		}
	}, [api, onSelect])

	return (
		<CarouselContext.Provider
			value={{
				carouselRef,
				api,
				opts,
				orientation:
					orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
				scrollPrev,
				scrollNext,
				canScrollPrev,
				canScrollNext,
			}}
		>
			<div
				onKeyDownCapture={handleKeyDown}
				onMouseEnter={() => autoplay && setBerhentiSementara(true)}
				onMouseLeave={() => autoplay && setBerhentiSementara(false)}
				onFocusCapture={() => autoplay && setBerhentiSementara(true)}
				onBlurCapture={() => autoplay && setBerhentiSementara(false)}
				className={cn("relative", className)}
				role="region"
				aria-roledescription="carousel"
				aria-label={label}
				data-slot="carousel"
				{...props}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	)
}

function CarouselContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { carouselRef, orientation } = useCarousel()

	return (
		<div
			ref={carouselRef}
			className="overflow-hidden"
			data-slot="carousel-content"
		>
			<div
				className={cn(
					"flex",
					orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
					className,
				)}
				{...props}
			/>
		</div>
	)
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
	const { orientation } = useCarousel()

	return (
		<div
			role="group"
			aria-roledescription="slide"
			data-slot="carousel-item"
			className={cn(
				"min-w-0 shrink-0 grow-0 basis-full",
				orientation === "horizontal" ? "pl-4" : "pt-4",
				className,
			)}
			{...props}
		/>
	)
}

function CarouselPrevious({
	className,
	variant = "outline",
	size = "icon",
	...props
}: React.ComponentProps<typeof Button>) {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel()

	return (
		<Button
			data-slot="carousel-previous"
			variant={variant}
			size={size}
			className={cn(
				"absolute touch-manipulation",
				// Panah disembunyikan di mobile: di layar sempit tombol 44px ini
				// menutupi kartu, dan pengguna mobile menggeser dengan sentuhan.
				// Kendali sisanya tetap ada lewat titik navigasi di bawah carousel,
				// jadi tidak ada fungsi yang hilang. Muncul lagi dari breakpoint sm.
				orientation === "horizontal"
					? "hidden top-1/2 -left-3 -translate-y-1/2 sm:inline-flex sm:-left-5"
					: "hidden -top-3 left-1/2 -translate-x-1/2 rotate-90 sm:inline-flex",
				className,
			)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			{...props}
		>
			<ArrowLeft aria-hidden="true" />
			<span className="sr-only">Slaid sebelumnya</span>
		</Button>
	)
}

function CarouselNext({
	className,
	variant = "outline",
	size = "icon",
	...props
}: React.ComponentProps<typeof Button>) {
	const { orientation, scrollNext, canScrollNext } = useCarousel()

	return (
		<Button
			data-slot="carousel-next"
			variant={variant}
			size={size}
			className={cn(
				"absolute touch-manipulation",
				// Sama seperti tombol sebelumnya: disembunyikan di mobile agar tidak
				// menutupi kartu. Muncul lagi dari breakpoint sm.
				orientation === "horizontal"
					? "hidden top-1/2 -right-3 -translate-y-1/2 sm:inline-flex sm:-right-5"
					: "hidden -bottom-3 left-1/2 -translate-x-1/2 rotate-90 sm:inline-flex",
				className,
			)}
			disabled={!canScrollNext}
			onClick={scrollNext}
			{...props}
		>
			<ArrowRight aria-hidden="true" />
			<span className="sr-only">Slaid berikutnya</span>
		</Button>
	)
}

function CarouselDots({ className }: { className?: string }) {
	const { api } = useCarousel()
	const [snaps, setSnaps] = React.useState<number[]>([])
	const [terpilih, setTerpilih] = React.useState(0)

	React.useEffect(() => {
		if (!api) return

		const perbarui = () => {
			setSnaps(api.scrollSnapList())
			setTerpilih(api.selectedScrollSnap())
		}

		perbarui()
		api.on("reInit", perbarui)
		api.on("select", perbarui)

		return () => {
			api.off("reInit", perbarui)
			api.off("select", perbarui)
		}
	}, [api])

	if (snaps.length <= 1) return null

	return (
		<div
			data-slot="carousel-dots"
			className={cn("flex items-center justify-center gap-2", className)}
		>
			{snaps.map((_, indeks) => (
				<button
					key={indeks}
					type="button"
					aria-label={`Ke slaid ${indeks + 1} dari ${snaps.length}`}
					aria-current={terpilih === indeks ? "true" : undefined}
					onClick={() => api?.scrollTo(indeks)}
					// Tombol kecil secara visual, tetapi area sentuhnya diperluas
					// lewat padding sehingga tetap nyaman di layar sentuh.
					className="flex size-6 cursor-pointer items-center justify-center rounded-full"
				>
					<span
						aria-hidden="true"
						className={cn(
							"size-1.5 rounded-full transition-colors duration-200",
							terpilih === indeks ? "bg-brand" : "bg-border",
						)}
					/>
				</button>
			))}
		</div>
	)
}

export {
	type CarouselApi,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	CarouselDots,
}