"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Camera, CheckCircle2, ScanLine, X } from "lucide-react"
import jsQR from "jsqr"

import { aksiScanAbsensi } from "../../aksi"
import type { HasilAksi } from "@/components/formulir-aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
			<div className="rounded-2xl border border-dashed border-[#E8DFC8] bg-[#FAF8F5] p-6 text-center">
				{kameraAktif ? (
					<div className="space-y-4">
						<div className="relative mx-auto aspect-square max-w-[280px] overflow-hidden rounded-xl border-2 border-[#D49A28] bg-black shadow-md">
							<video
								ref={videoRef}
								playsInline
								muted
								className="h-full w-full object-cover"
							/>
						</div>
						<p className="text-xs text-zinc-600">
							Arahkan kamera ke QR Code di layar admin atau proyektor...
						</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="rounded-xl border-[#EFECE6] bg-white"
							onClick={() => setKameraAktif(false)}
						>
							<X className="size-3.5 mr-1" />
							Tutup Kamera
						</Button>
					</div>
				) : (
					<div className="space-y-3 py-2">
						<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#FDF8ED] text-[#D49A28] shadow-2xs">
							<Camera className="size-6" />
						</div>
						<div className="space-y-1">
							<p className="text-sm font-bold text-zinc-950 font-heading">Pindai QR Absensi Kamera</p>
							<p className="text-xs text-zinc-500 max-w-sm mx-auto">
								Gunakan kamera perangkat Anda untuk memindai QR code absensi yang ditampilkan admin.
							</p>
						</div>
						<Button
							type="button"
							size="sm"
							variant="gold"
							className="rounded-xl font-semibold shadow-xs"
							onClick={() => {
								setStatusKamera(null)
								setKameraAktif(true)
							}}
						>
							<ScanLine className="size-4 mr-1.5" />
							Buka Kamera Pemindai
						</Button>
					</div>
				)}
				{statusKamera ? (
					<p className="mt-3 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">{statusKamera}</p>
				) : null}
			</div>

			{/* Formulir Konfirmasi / Input Manual */}
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

				<div className="space-y-1.5">
					<Label htmlFor="token" className="text-xs font-medium text-zinc-700">
						Token absensi
					</Label>
					<Input
						id="token"
						name="token"
						value={token}
						onChange={(e) => setToken(e.target.value)}
						placeholder="Tempel token atau pindai QR di atas"
						required
						autoComplete="off"
						aria-describedby="bantuan-token"
						className="font-mono text-sm rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
					<p id="bantuan-token" className="text-xs text-zinc-500">
						Token terisi otomatis saat Anda memindai QR atau membuka tautan absensi.
					</p>
				</div>

				<Button
					type="submit"
					variant="gold"
					className="w-full font-semibold rounded-xl shadow-xs"
					disabled={sedangProses || !token.trim()}
				>
					<CheckCircle2 className="size-4 mr-1.5" />
					{sedangProses ? "Memproses absensi…" : "Konfirmasi & Catat Kehadiran"}
				</Button>
			</form>
		</div>
	)
}
