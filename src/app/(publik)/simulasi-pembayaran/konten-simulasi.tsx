"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "@/lib/uang"

export default function HalamanSimulasiPembayaran() {
	const searchParams = useSearchParams()
	const orderId = searchParams.get("order_id") ?? "-"
	const amount = searchParams.get("amount") ?? "0"
	const project = searchParams.get("proyek") ?? "rmp"
	const redirectUrl = searchParams.get("redirect") ?? "/user/pembayaran"
	const [sedangKirim, setSedangKirim] = useState(false)
	const [pesan, setPesan] = useState<string | null>(null)

	async function bayar(status: "completed" | "failed") {
		setSedangKirim(true)
		setPesan(null)
		try {
			const res = await fetch("/api/pakasir/webhook", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					project,
					order_id: orderId,
					amount: Number(amount),
					status,
					payment_method: "qris",
					completed_at: new Date().toISOString(),
				}),
			})
			if (!res.ok) {
				const data = await res.json()
				setPesan(`Gagal mengirim webhook: ${data.pesan || res.statusText}`)
			} else {
				window.location.href = redirectUrl
			}
		} catch (err) {
			setPesan(`Terjadi galat: ${err instanceof Error ? err.message : String(err)}`)
		} finally {
			setSedangKirim(false)
		}
	}

	return (
		<div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-8">
			<Card className="w-full rounded-2xl border border-[#EFECE6] bg-white shadow-xs">
				<CardHeader className="space-y-1 border-b border-[#F5F3EF] pb-4">
					<span className="text-xs font-bold uppercase tracking-wider text-[#854D0E]">
						Sandbox / Simulator Pembayaran
					</span>
					<CardTitle className="text-lg font-bold text-zinc-950 font-heading">Simulasi Pembayaran Pakasir</CardTitle>
					<CardDescription className="text-xs text-zinc-500">
						Halaman simulasi pembayaran lokal tanpa gateway pembayaran nyata.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 pt-4">
					<div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3.5 text-xs sm:text-sm space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-zinc-500">Order ID:</span>
							<span className="font-mono font-medium text-zinc-900">{orderId}</span>
						</div>
						<div className="flex justify-between items-center border-t border-[#EFECE6] pt-2">
							<span className="text-zinc-500">Total Nominal:</span>
							<span className="font-mono font-bold text-[#854D0E] text-base">{formatRupiah(amount)}</span>
						</div>
					</div>
					{pesan ? <p className="text-xs text-red-600 font-medium">{pesan}</p> : null}
				</CardContent>
				<CardFooter className="flex flex-col gap-2 border-t border-[#F5F3EF] pt-4">
					<Button
						variant="gold"
						className="w-full font-bold rounded-xl shadow-xs"
						onClick={() => bayar("completed")}
						disabled={sedangKirim || orderId === "-"}
					>
						{sedangKirim ? "Memproses..." : "Simulasi Bayar Lunas"}
					</Button>
					<Button
						variant="outline"
						className="w-full border-[#EFECE6] bg-white hover:bg-[#FAF8F5] rounded-xl text-zinc-600 text-xs"
						onClick={() => bayar("failed")}
						disabled={sedangKirim || orderId === "-"}
					>
						Simulasi Gagal / Batal
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
