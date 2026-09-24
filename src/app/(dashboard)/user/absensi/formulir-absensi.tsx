"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Camera, CheckCircle2, ScanLine, X } from "lucide-react"
import jsQR from "jsqr"

import { aksiScanAbsensi } from "../../aksi"
import type { HasilAksi } from "@/components/formulir-aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

/**
 * Absensi peserta berbasis pemindaian QR.
 * Token tidak lagi dapat diketik manual: token hanya masuk lewat hasil pindai
 * kamera atau tautan absensi, sehingga kehadiran selalu berasal dari QR resmi
 * yang ditampilkan admin.
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

	const [status, jalankan, sedangProses] = useActionState<HasilAksi, FormData>(
		aksiScanAbsensi,
		undefined,
	)

	useEffect(() => {
		if (tokenUrl && tokenUrl !== token) {
			setToken(tokenUrl)
		}
	}, [tokenUrl])

	// Universal QR Scanner via jsQR canvas processor
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
					return
				}

				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } },
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
								setToken(tokenParsed)
								setKameraAktif(false)
								setTimeout(() => {
									formRef.current?.requestSubmit()
								}, 100)
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
		<div className="space-y-6">
			<canvas ref={canvasRef} className="hidden" />

			{/* Panel Kamera / Scanner */}
			<div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center">
				{kameraAktif ? (
					<div className="space-y-4">
						<div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-lg border-2 border-primary bg-black shadow-sm">
							<video
								ref={videoRef}
								playsInline
								muted
								className="h-full w-full object-cover"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Arahkan kamera ke QR Code di layar admin atau proyektor…
						</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="min-h-11"
							onClick={() => setKameraAktif(false)}
						>
							<X className="mr-1 size-3.5" aria-hidden="true" />
							Tutup Kamera
						</Button>
					</div>
				) : (
					<div className="space-y-3 py-2">
						<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
							<Camera className="size-6" aria-hidden="true" />
						</div>
						<div className="space-y-1">
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
					</div>
				)}
				{statusKamera ? (
					<p role="status" className="mt-3 rounded-lg border border-border bg-background p-2 text-xs text-foreground">
						{statusKamera}
					</p>
				) : null}
			</div>

			{/* Formulir konfirmasi: token hanya berasal dari hasil pindai / tautan. */}
			<form ref={formRef} action={jalankan} className="space-y-4">
				{status?.pesan ? (
					<Alert variant="gagal" judul="Absensi gagal">
						<p>{status.pesan}</p>
					</Alert>
				) : null}
				{status?.sukses ? (
					<Alert variant="sukses" judul="Absensi berhasil">
						<p>{status.sukses}</p>
					</Alert>
				) : null}

				<input type="hidden" name="token" value={token} />

				<p className="text-xs text-muted-foreground">
					Token terisi otomatis dari hasil pemindaian QR. Bila kamera tidak tersedia, buka tautan
					absensi yang dibagikan admin.
				</p>

				<Button
					type="submit"
					variant="gold"
					className="min-h-11 w-full font-semibold"
					disabled={sedangProses || !token.trim()}
				>
					<CheckCircle2 className="mr-1.5 size-4" aria-hidden="true" />
					{sedangProses ? "Memproses absensi…" : "Konfirmasi & Catat Kehadiran"}
				</Button>
			</form>
		</div>
	)
}
