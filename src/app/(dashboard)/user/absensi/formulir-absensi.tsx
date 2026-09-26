"use client"

import { useActionState, useCallback, useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Camera, CheckCircle2, ScanLine, X } from "lucide-react"
import jsQR from "jsqr"

import { aksiScanAbsensi } from "../../aksi"
import type { HasilAksi } from "@/components/formulir-aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

/**
 * Absensi peserta berbasis pemindaian QR.
 *
 * Alur: buka kamera (satu layar penuh) -> pindai -> kehadiran tercatat otomatis.
 * Tidak ada langkah konfirmasi manual: begitu token terbaca, formulir langsung
 * dikirim sehingga peserta tidak perlu menekan apa pun lagi.
 *
 * Token tidak dapat diketik manual. Sumbernya hanya dua, keduanya resmi:
 * hasil pindai kamera, atau parameter `token` pada tautan yang dibagikan admin.
 *
 * Kamera memakai `jsQR` di atas canvas WebRTC (`getUserMedia`) agar berjalan di
 * seluruh browser desktop maupun mobile tanpa flag eksperimental.
 */
export function FormulirAbsensi({ token: tokenDariProps }: { token?: string }) {
	const searchParams = useSearchParams()
	const tokenUrl = searchParams.get("token") || tokenDariProps || ""

	const [token, setToken] = useState(tokenUrl)
	const [kameraAktif, setKameraAktif] = useState(false)
	const [statusKamera, setStatusKamera] = useState<string | null>(null)
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const formRef = useRef<HTMLFormElement | null>(null)
	// Menandai token yang sudah dikirim, agar auto-kirim tidak berulang saat
	// komponen render ulang (mis. saat status aksi berubah).
	const tokenTerkirimRef = useRef("")

	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksiScanAbsensi,
		undefined,
	)

	// Token dari tautan admin hanya diterapkan sekali per nilai, dilacak lewat
	// ref. Tanpa ref, perbandingannya harus membaca `token` sehingga dependensi
	// effect menjadi tidak jujur (dan bisa menimpa hasil pindai kamera).
	const tokenUrlTerakhirRef = useRef("")
	useEffect(() => {
		if (tokenUrl && tokenUrl !== tokenUrlTerakhirRef.current) {
			tokenUrlTerakhirRef.current = tokenUrl
			setToken(tokenUrl)
		}
	}, [tokenUrl])

	/**
	 * Auto-kirim: begitu ada token (dari pindai kamera atau tautan admin),
	 * kehadiran langsung dicatat tanpa perlu menekan tombol konfirmasi.
	 */
	useEffect(() => {
		const bersih = token.trim()
		if (!bersih) return
		if (sedangProses) return
		// Sudah pernah dikirim untuk token ini; jangan ulangi.
		if (tokenTerkirimRef.current === bersih) return

		tokenTerkirimRef.current = bersih
		formRef.current?.requestSubmit()
	}, [token, sedangProses])

	const tutupKamera = useCallback(() => setKameraAktif(false), [])

	// Escape menutup kamera, dan gulir halaman dikunci selama kamera terbuka.
	useEffect(() => {
		if (!kameraAktif) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") tutupKamera()
		}
		document.addEventListener("keydown", onKeyDown)

		const overflowSebelumnya = document.body.style.overflow
		document.body.style.overflow = "hidden"

		return () => {
			document.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = overflowSebelumnya
		}
	}, [kameraAktif, tutupKamera])

	// Pemindai QR: jsQR di atas frame canvas dari stream kamera.
	useEffect(() => {
		let stream: MediaStream | null = null
		let animId: number | null = null

		async function mulaiScanner() {
			if (!kameraAktif) return

			try {
				if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
					setStatusKamera(
						"Kamera tidak didukung atau memerlukan koneksi aman (HTTPS / localhost).",
					)
					setKameraAktif(false)
					return
				}

				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
				})

				if (videoRef.current) {
					videoRef.current.srcObject = stream
					videoRef.current.setAttribute("playsinline", "true")
					await videoRef.current.play()
				}

				const canvas = canvasRef.current || document.createElement("canvas")
				const ctx = canvas.getContext("2d", { willReadFrequently: true })

				const scanFrame = () => {
					if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && ctx) {
						canvas.width = videoRef.current.videoWidth
						canvas.height = videoRef.current.videoHeight
						ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

						const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
						const code = jsQR(imageData.data, imageData.width, imageData.height, {
							inversionAttempts: "dontInvert",
						})

						if (code && code.data) {
							const rawValue = code.data.trim()
							let tokenParsed = rawValue
							try {
								if (rawValue.startsWith("http")) {
									const parsedUrl = new URL(rawValue)
									tokenParsed = parsedUrl.searchParams.get("token") || rawValue
								}
							} catch {
								// Gunakan string mentah jika bukan URL
							}

							if (tokenParsed) {
								// Tutup kamera lalu isi token; efek auto-kirim di atas
								// yang mencatat kehadiran tanpa aksi tambahan.
								setKameraAktif(false)
								setToken(tokenParsed)
								return
							}
						}
					}
					animId = requestAnimationFrame(scanFrame)
				}

				animId = requestAnimationFrame(scanFrame)
			} catch (err) {
				setStatusKamera(
					`Tidak dapat mengakses kamera: ${err instanceof Error ? err.message : String(err)}`,
				)
				setKameraAktif(false)
			}
		}

		if (kameraAktif) {
			mulaiScanner()
		}

		return () => {
			if (animId) cancelAnimationFrame(animId)
			if (stream) {
				stream.getTracks().forEach((t) => t.stop())
			}
		}
	}, [kameraAktif])

	return (
		<div className="flex flex-col gap-6">
			<canvas ref={canvasRef} className="hidden" />

			{/* Kamera satu layar penuh. `fixed inset-0` agar bidang pandang
			    seluas mungkin — memindai QR dari proyektor butuh area besar. */}
			{kameraAktif ? (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Pemindai QR absensi"
					className="fixed inset-0 z-50 flex flex-col bg-primary"
				>
					<div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3">
						<p className="font-heading text-sm font-bold text-primary-foreground">
							Pindai QR Absensi
						</p>
						<Button
							type="button"
							variant="onDark"
							size="icon"
							onClick={tutupKamera}
							aria-label="Tutup kamera"
						>
							<X aria-hidden="true" />
						</Button>
					</div>

					{/* `min-h-0` wajib: tanpa itu anak flex tidak boleh menyusut dan
					    video akan mendorong bilah bawah keluar layar. */}
					<div className="relative min-h-0 flex-1">
						<video
							ref={videoRef}
							playsInline
							muted
							className="h-full w-full object-cover"
						/>
						{/* Bingkai bidik: murni pemandu visual, tidak menghalangi sentuhan. */}
						<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
							<div className="aspect-square w-[72vmin] max-w-[440px] rounded-xl border-2 border-primary-foreground/70" />
						</div>
					</div>

					<div className="shrink-0 px-4 py-4 text-center">
						<p className="text-xs leading-5 text-primary-muted">
							Arahkan kamera ke QR Code di layar admin. Kehadiran tercatat otomatis
							begitu kode terbaca.
						</p>
						{statusKamera ? (
							<p role="status" className="mt-2 text-xs text-primary-foreground">
								{statusKamera}
							</p>
						) : null}
					</div>
				</div>
			) : null}

			{/* Ajakan membuka kamera (tampil saat kamera tertutup). */}
			{!kameraAktif ? (
				<div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center">
					<div className="flex flex-col gap-3 py-2">
						<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
							<Camera className="size-6" aria-hidden="true" />
						</div>
						<div className="flex flex-col gap-1">
							<p className="font-heading text-sm font-bold text-foreground">Pindai QR Absensi</p>
							<p className="mx-auto max-w-sm text-xs text-muted-foreground">
								Gunakan kamera perangkat Anda untuk memindai QR code absensi yang ditampilkan admin di kelas.
							</p>
						</div>
						<Button
							type="button"
							size="sm"
							variant="gold"
							className="min-h-11 font-semibold"
							onClick={() => {
								setStatusKamera(null)
								setKameraAktif(true)
							}}
						>
							<ScanLine className="mr-1.5 size-4" aria-hidden="true" />
							Buka Kamera Pemindai
						</Button>
						{statusKamera ? (
							<p role="status" className="mt-1 rounded-lg border border-border bg-background p-2 text-xs text-foreground">
								{statusKamera}
							</p>
						) : null}
					</div>
				</div>
			) : null}

			{/* Formulir: hanya pembawa token. Tidak ada tombol konfirmasi —
			    pengiriman dilakukan otomatis oleh efek auto-kirim. */}
			<form ref={formRef} action={jalankan} className="flex flex-col gap-4">
				{status?.pesan ? (
					<div className="flex flex-col gap-3">
						<Alert variant="gagal" judul="Absensi gagal">
							<p>{status.pesan}</p>
						</Alert>
						{/* Auto-kirim hanya berjalan sekali per token. Bila gagal,
						    peserta diberi satu jalan keluar agar tidak buntu. */}
						<Button
							type="button"
							variant="outline"
							className="min-h-11 w-full font-semibold"
							disabled={sedangProses}
							onClick={() => {
								tokenTerkirimRef.current = token.trim()
								formRef.current?.requestSubmit()
							}}
						>
							{sedangProses ? "Mencoba lagi…" : "Coba catat lagi"}
						</Button>
					</div>
				) : null}

				{status?.sukses ? (
					<div
						role="status"
						className="animasi-absensi-naik flex flex-col items-center gap-3 rounded-lg border border-success/30 bg-success-surface p-6 text-center"
					>
						{/* Cincin berdenyut + centang membesar: umpan balik visual bahwa
						    kehadiran benar-benar tercatat. Murni dekoratif (`aria-hidden`),
						    maknanya dibawa teks di bawah. */}
						<span className="relative flex size-16 items-center justify-center" aria-hidden="true">
							<span className="animasi-absensi-denyut absolute inset-0 rounded-full bg-success/20" />
							<span className="animasi-absensi-muncul relative flex size-14 items-center justify-center rounded-full bg-success text-success-foreground">
								<CheckCircle2 className="size-8" />
							</span>
						</span>
						<div className="flex flex-col gap-1">
							<p className="font-heading text-base font-bold text-foreground">Absensi berhasil</p>
							<p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
								{status.sukses}
							</p>
						</div>
					</div>
				) : null}

				{sedangProses ? (
					<p role="status" className="text-center text-sm text-muted-foreground">
						Mencatat kehadiran…
					</p>
				) : null}

				<input type="hidden" name="token" value={token} />
			</form>
		</div>
	)
}