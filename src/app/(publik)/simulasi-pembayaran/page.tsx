import { Suspense } from "react"
import HalamanSimulasiPembayaran from "./konten-simulasi"

export default function Page() {
	return (
		<Suspense fallback={<div className="p-8 text-center">Memuat simulator pembayaran...</div>}>
			<HalamanSimulasiPembayaran />
		</Suspense>
	)
}
