"use client"

import Image from "next/image"
import { useActionState, useEffect, useRef, useState, useTransition } from "react"
import { Maximize2, QrCode, RefreshCw, X } from "lucide-react"

import { aksiBukaSesiQr, aksiPerbaruiTokenQr, type HasilQrAbsensi } from "./aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type PilihanKelas = { id: string; judul: string; sudahMemilikiSesi: boolean }
type DataQr = NonNullable<HasilQrAbsensi["qr"]>

function TampilanQrAbsensi({ qr, onRefresh, sedangMemperbarui }: { qr: DataQr; onRefresh: (sessionId: string) => void; sedangMemperbarui: boolean }) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	return <>
		<div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-4 text-center sm:p-6">
			<div className="flex flex-col items-center justify-between gap-3 border-b border-border pb-4 sm:flex-row">
				<span className="text-xs font-semibold uppercase tracking-wider text-foreground">QR absensi aktif</span>
				<Button type="button" variant="outline" size="sm" className="min-h-11" onClick={() => dialogRef.current?.showModal()}><Maximize2 className="mr-1 size-3.5" /> Layar Penuh Proyektor</Button>
			</div>
			<div className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-lg border border-border bg-card p-3 ">
				<Image src={qr.gambar} alt="QR code absensi" width={260} height={260} unoptimized className={`h-auto w-full ${sedangMemperbarui ? "opacity-30" : "opacity-100"}`} />
				{sedangMemperbarui ? <div role="status" className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-card/85 text-xs font-semibold"><RefreshCw className="size-4 animate-spin" /> Mengganti QR…</div> : null}
			</div>
			<Button type="button" variant="outline" size="sm" className="min-h-11" onClick={() => onRefresh(qr.sessionId)} disabled={sedangMemperbarui}><RefreshCw className={`mr-1.5 size-3.5 ${sedangMemperbarui ? "animate-spin" : ""}`} />{sedangMemperbarui ? "Mengganti…" : "Ganti QR"}</Button>
			<p className="mx-auto max-w-md break-all text-xs font-mono text-muted-foreground">Tautan cadangan: <a className="inline-flex min-h-11 items-center underline" href={qr.url}>{qr.url}</a></p>
		</div>
		<dialog ref={dialogRef} aria-label="QR absensi layar penuh" className="m-auto h-full w-full max-w-none bg-primary p-4 text-primary-foreground backdrop:bg-primary sm:p-6">
			<Button type="button" variant="outline" className="absolute right-4 top-4 min-h-11 border-primary-muted/30 bg-primary text-primary-foreground hover:bg-primary-muted/20" onClick={() => dialogRef.current?.close()}><X className="mr-1 size-4" /> Tutup</Button>
			<div className="flex min-h-full items-center justify-center"><div className="w-full max-w-md flex flex-col gap-5 text-center">
				<h2 className="text-2xl font-bold">Arahkan kamera ke QR Code</h2><p className="text-sm text-primary-muted">QR ini aktif tanpa batas waktu selama sesi belum ditutup.</p>
				<div className="mx-auto aspect-square w-full max-w-[320px] rounded-lg bg-card p-4"><Image src={qr.gambar} alt="QR code absensi proyektor" width={320} height={320} unoptimized className="h-auto w-full" /></div><p className="break-all text-xs text-primary-muted">{qr.url}</p>
			</div></div>
		</dialog>
	</>
}

export function TombolGantiQr({ sessionId, judulKelas }: { sessionId: string; judulKelas: string }) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [hasil, setHasil] = useState<HasilQrAbsensi>()
	const [pending, mulai] = useTransition()
	function ganti() {
		setHasil(undefined); dialogRef.current?.showModal()
		mulai(async () => { const data = new FormData(); data.set("sessionId", sessionId); setHasil(await aksiPerbaruiTokenQr(undefined, data)) })
	}
	return <>
		<Button type="button" variant="outline" size="sm" className="min-h-11" onClick={ganti} disabled={pending}><RefreshCw className={`mr-1.5 size-4 ${pending ? "animate-spin" : ""}`} />Ganti QR</Button>
		<dialog ref={dialogRef} aria-labelledby={`judul-qr-${sessionId}`} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg bg-card p-5 shadow-md backdrop:bg-primary/70 sm:p-6">
			<div className="flex flex-col gap-4 text-center"><h2 id={`judul-qr-${sessionId}`} className="text-lg font-bold">QR {judulKelas}</h2>
				{pending ? <p role="status" className="py-12 text-sm">Membuat QR baru…</p> : null}
				{hasil?.pesan ? <Alert variant="gagal" judul="QR tidak dapat diganti"><p>{hasil.pesan}</p></Alert> : null}
				{hasil?.sukses ? <p role="status" aria-live="polite" className="text-sm font-medium text-success">{hasil.sukses}</p> : null}
				{hasil?.qr ? <><div className="mx-auto aspect-square w-full max-w-[320px] rounded-lg border bg-card p-3"><Image src={hasil.qr.gambar} alt={`QR absensi ${judulKelas}`} width={320} height={320} unoptimized className="h-auto w-full" /></div><p className="break-all text-xs text-muted-foreground"><a className="inline-flex min-h-11 items-center underline" href={hasil.qr.url}>{hasil.qr.url}</a></p></> : null}
				<Button type="button" variant="outline" className="min-h-11 w-full" onClick={() => dialogRef.current?.close()}><X className="mr-1 size-4" />Tutup</Button>
			</div>
		</dialog>
	</>
}

export function PanelQrAbsensi({ kelas }: { kelas: PilihanKelas[] }) {
	const [status, jalankanBuka, sedangMembuka] = useActionState<HasilQrAbsensi | undefined, FormData>(aksiBukaSesiQr, undefined)
	const [dataQrAktif, setDataQrAktif] = useState<DataQr | null>(null)
	const [sedangMemperbarui, startTransition] = useTransition()
	const [hasilGanti, setHasilGanti] = useState<HasilQrAbsensi>()
	const adaKelasTersedia = kelas.some((item) => !item.sudahMemilikiSesi)
	useEffect(() => { if (status?.qr) setDataQrAktif(status.qr) }, [status])
	function gantiQr(sessionId: string) {
		setHasilGanti(undefined)
		startTransition(async () => { const data = new FormData(); data.append("sessionId", sessionId); const hasil = await aksiPerbaruiTokenQr(undefined, data); setHasilGanti(hasil); if (hasil.qr) setDataQrAktif(hasil.qr) })
	}
	return <div className="flex flex-col gap-6">
		{status?.pesan ? <Alert variant="gagal" judul="Sesi absensi tidak dibuka"><p>{status.pesan}</p></Alert> : null}
		{status?.sukses ? <p role="status" aria-live="polite" className="text-sm font-medium text-success">{status.sukses}</p> : null}
		{hasilGanti?.pesan ? <Alert variant="gagal" judul="QR tidak dapat diganti"><p>{hasilGanti.pesan}</p></Alert> : null}
		{hasilGanti?.sukses ? <p role="status" aria-live="polite" className="text-sm font-medium text-success">{hasilGanti.sukses}</p> : null}
		{dataQrAktif ? <TampilanQrAbsensi qr={dataQrAktif} onRefresh={gantiQr} sedangMemperbarui={sedangMemperbarui} /> : <form action={jalankanBuka} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5"><Label htmlFor="classId" className="text-xs font-medium text-muted-foreground">Pilih kelas</Label><Select id="classId" name="classId" required defaultValue="" disabled={!adaKelasTersedia}><option value="" disabled>{adaKelasTersedia ? "Pilih kelas untuk absensi" : "Tidak ada kelas tersedia"}</option>{kelas.map((item) => <option key={item.id} value={item.id} disabled={item.sudahMemilikiSesi}>{item.judul}{item.sudahMemilikiSesi ? " — sesi sudah pernah dibuat" : ""}</option>)}</Select></div>
			{!adaKelasTersedia ? <p role="status" className="text-xs text-muted-foreground">Semua kelas sudah pernah memiliki sesi absensi. Sesi baru tidak dapat dibuat.</p> : null}
			<Button type="submit" className="min-h-11 w-full" disabled={sedangMembuka || !adaKelasTersedia}><QrCode className="mr-1.5 size-4" />{sedangMembuka ? "Membuka sesi absensi…" : "Buka sesi & tampilkan QR"}</Button>
		</form>}
	</div>
}
