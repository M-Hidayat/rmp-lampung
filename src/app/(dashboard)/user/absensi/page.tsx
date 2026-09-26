import type { Metadata } from "next"

import { FormulirAbsensi } from "./formulir-absensi"

export const metadata: Metadata = { title: "Absensi" }
export const dynamic = "force-dynamic"

type Props = { searchParams: Promise<{ token?: string }> }

export default async function HalamanAbsensiUser({ searchParams }: Props) {
	const { token } = await searchParams

	return (
		<div className="mx-auto max-w-xl flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
					Absensi
				</h1>
				<p className="text-xs text-muted-foreground mt-0.5">
					Kehadiran tercatat satu kali per pendaftaran yang sudah berstatus lunas.
				</p>
			</div>

			<div className="bg-card rounded-lg border border-border p-6 ">
				<FormulirAbsensi token={token} />
			</div>
		</div>
	)
}
