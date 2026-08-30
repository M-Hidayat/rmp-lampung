"use client"

import Image from "next/image"
import { useActionState, useState, useEffect, useTransition } from "react"
import { Maximize2, RefreshCw, X, QrCode } from "lucide-react"

import { aksiBukaSesiQr, aksiPerbaruiTokenQr, type HasilQrAbsensi } from "./aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type PilihanKelas = { id: string; judul: string }

type DataQr = NonNullable<HasilQrAbsensi["qr"]>

const INTERVAL_ROTASI_DETIK = 30

/** Menampilkan QR dinamis sekali tampil beserta live countdown bar & Projector Mode. */
function TampilanQrLms({
	qr,
	sessionId,
	onRefresh,
	sedangMemperbarui,
}: {
	qr: DataQr
	sessionId: string
	onRefresh: (sid: string) => void
	sedangMemperbarui: boolean
}) {
	const [sisaDetik, setSisaDetik] = useState(INTERVAL_ROTASI_DETIK)
	const [autoRotate, setAutoRotate] = useState(true)
	const [isProjectorMode, setIsProjectorMode] = useState(false)

	// Reset countdown saat token QR baru diterima
	useEffect(() => {
		setSisaDetik(INTERVAL_ROTASI_DETIK)
	}, [qr.token])

	// Countdown timer per detik
	useEffect(() => {
		if (!autoRotate) return

		const timer = setInterval(() => {
			setSisaDetik((prev) => {
				if (prev <= 1) {
					onRefresh(sessionId)
					return INTERVAL_ROTASI_DETIK
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [autoRotate, sessionId, onRefresh])

	const persentase = (sisaDetik / INTERVAL_ROTASI_DETIK) * 100

	return (
		<>
			{/* Normal Card Mode */}
			<div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 text-center">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
					<div className="flex items-center gap-2">
						<span className="relative flex size-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
						</span>
						<span className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
							LMS Dynamic QR (Live)
						</span>
					</div>

					<div className="flex items-center gap-3">
						<label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-600 select-none">
							<input
								type="checkbox"
								checked={autoRotate}
								onChange={(e) => setAutoRotate(e.target.checked)}
								className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950"
							/>
							<span>Auto-Refresh</span>
						</label>

						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-8 text-xs"
							onClick={() => setIsProjectorMode(true)}
						>
							<Maximize2 className="size-3.5 mr-1" />
							Layar Penuh Proyektor
						</Button>
					</div>
				</div>

				{/* Progress Bar Waktu QR */}
				<div className="space-y-1.5 max-w-sm mx-auto">
					<div className="flex justify-between text-xs text-zinc-500 font-medium">
						<span>QR berganti dalam:</span>
						<span className="font-mono font-semibold text-zinc-950">{sisaDetik}s</span>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
						<div
							className={`h-full transition-all duration-1000 ${
								sisaDetik <= 5 ? "bg-red-500" : sisaDetik <= 10 ? "bg-amber-500" : "bg-zinc-900"
							}`}
							style={{ width: `${persentase}%` }}
						/>
					</div>
				</div>

				{/* QR Code Container */}
				<div className="relative mx-auto flex aspect-square max-w-[260px] items-center justify-center rounded-lg border border-zinc-200 bg-white p-3 shadow-xs">
					<Image
						src={qr.gambar}
						alt="QR code absensi dinamis"
						width={260}
						height={260}
						unoptimized
						className={`h-auto w-full transition-opacity duration-200 ${
							sedangMemperbarui ? "opacity-30" : "opacity-100"
						}`}
					/>
					{sedangMemperbarui ? (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 text-xs font-semibold text-zinc-900 rounded-lg gap-2">
							<RefreshCw className="size-4 animate-spin" />
							<span>Memperbarui QR...</span>
						</div>
					) : null}
				</div>

				<div className="flex flex-wrap items-center justify-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onRefresh(sessionId)}
						disabled={sedangMemperbarui}
					>
						<RefreshCw className={`size-3.5 mr-1.5 ${sedangMemperbarui ? 'animate-spin' : ''}`} />
						{sedangMemperbarui ? "Memperbarui..." : "Perbarui QR Sekarang"}
					</Button>
				</div>

				<p className="break-all text-[11px] font-mono text-zinc-400 max-w-md mx-auto">
					Tautan cadangan: {qr.url}
				</p>
			</div>

			{/* Fullscreen Projector Modal */}
			{isProjectorMode ? (
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50">
					<div className="absolute right-6 top-6">
						<Button
							type="button"
							variant="outline"
							className="border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
							onClick={() => setIsProjectorMode(false)}
						>
							<X className="size-4 mr-1" /> Tutup Layar Penuh (ESC)
						</Button>
					</div>

					<div className="w-full max-w-md space-y-6 text-center">
						<div className="space-y-1">
							<span className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
								Sesi Absensi Kelas (Live Projector)
							</span>
							<h2 className="text-2xl font-bold tracking-tight text-zinc-50 pt-2">
								Arahkan Kamera ke QR Code
							</h2>
							<p className="text-xs text-zinc-400">
								QR Code berotasi otomatis setiap 30 detik untuk mencatat kehadiran fisik.
							</p>
						</div>

						{/* Big QR in Projector */}
						<div className="relative mx-auto flex aspect-square max-w-[320px] items-center justify-center rounded-lg border border-zinc-700 bg-white p-4 shadow-2xl">
							<Image
								src={qr.gambar}
								alt="QR code absensi dinamis proyektor"
								width={320}
								height={320}
								unoptimized
								className="h-auto w-full"
							/>
						</div>

						{/* Countdown Bar in Dark */}
						<div className="space-y-1.5 max-w-xs mx-auto">
							<div className="flex justify-between text-xs text-zinc-400">
								<span>QR Berganti Otomatis:</span>
								<span className="font-mono font-medium text-zinc-200">{sisaDetik} detik</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
								<div
									className={`h-full transition-all duration-1000 ${
										sisaDetik <= 5 ? "bg-red-500" : sisaDetik <= 10 ? "bg-amber-500" : "bg-zinc-100"
									}`}
									style={{ width: `${persentase}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}

/** Panel pembuatan sesi absensi beserta QR LMS otomatis. */
export function PanelQrAbsensi({ kelas }: { kelas: PilihanKelas[] }) {
	const [status, jalankanBuka, sedangMembuka] = useActionState<
		HasilQrAbsensi | undefined,
		FormData
	>(aksiBukaSesiQr, undefined)

	const [dataQrAktif, setDataQrAktif] = useState<DataQr | null>(null)
	const [sedangMemperbarui, startTransition] = useTransition()
	const [pesanRotasi, setPesanRotasi] = useState<string | null>(null)

	useEffect(() => {
		if (status?.qr) {
			setDataQrAktif(status.qr)
		}
	}, [status])

	const handleRefreshQr = (sessionId: string) => {
		setPesanRotasi(null)
		startTransition(async () => {
			const fd = new FormData()
			fd.append("sessionId", sessionId)
			fd.append("masaBerlakuMenit", "10")
			const res = await aksiPerbaruiTokenQr(undefined, fd)
			if (res.qr) {
				setDataQrAktif(res.qr)
			} else if (res.pesan) {
				setPesanRotasi(res.pesan)
			}
		})
	}

	return (
		<div className="space-y-6">
			{status?.pesan ? (
				<Alert variant="gagal" judul="Sesi absensi tidak dibuka">
					<p>{status.pesan}</p>
				</Alert>
			) : null}
			{pesanRotasi ? (
				<Alert variant="gagal" judul="Gagal rotasi QR">
					<p>{pesanRotasi}</p>
				</Alert>
			) : null}
			{status?.sukses && !dataQrAktif ? (
				<Alert variant="sukses">
					<p>{status.sukses}</p>
				</Alert>
			) : null}

			{dataQrAktif ? (
				<TampilanQrLms
					qr={dataQrAktif}
					sessionId={dataQrAktif.sessionId}
					onRefresh={handleRefreshQr}
					sedangMemperbarui={sedangMemperbarui}
				/>
			) : (
				<form action={jalankanBuka} className="space-y-4">
					<div className="space-y-1.5">
						<Label htmlFor="classId" className="text-xs font-medium text-zinc-700">Pilih Kelas</Label>
						<Select id="classId" name="classId" required defaultValue="" className="font-medium">
							<option value="" disabled>
								Pilih kelas untuk absensi
							</option>
							{kelas.map((item) => (
								<option key={item.id} value={item.id}>
									{item.judul}
								</option>
							))}
						</Select>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="masaBerlakuMenit" className="text-xs font-medium text-zinc-700">
							Masa berlaku sesi keseluruhan (menit)
						</Label>
						<Input
							id="masaBerlakuMenit"
							name="masaBerlakuMenit"
							type="number"
							min={1}
							max={180}
							defaultValue={60}
						/>
						<p className="text-xs text-zinc-500">
							QR code akan aktif dan berotasi otomatis setiap 30 detik selama sesi dibuka.
						</p>
					</div>
					<Button type="submit" className="w-full" disabled={sedangMembuka}>
						<QrCode className="size-4 mr-1.5" />
						{sedangMembuka ? "Membuka sesi absensi…" : "Buka Sesi & Tampilkan Dynamic QR"}
					</Button>
				</form>
			)}
		</div>
	)
}
