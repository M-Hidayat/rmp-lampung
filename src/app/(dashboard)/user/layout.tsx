import { redirect } from "next/navigation"

import { sesiPengguna } from "@/lib/auth"
import { peranDiizinkanUntukPath } from "@/lib/rbac"

/**
 * Lapisan proteksi area peserta (dievaluasi di server).
 * User dan Admin/Pemilik diperbolehkan memiliki area peserta.
 */
export default async function TataLetakAreaUser({
	children,
}: {
	children: React.ReactNode
}) {
	const sesi = await sesiPengguna()
	if (!sesi) redirect("/masuk?lanjut=/user")

	const diizinkan = peranDiizinkanUntukPath("/user") ?? []
	if (!diizinkan.includes(sesi.peran)) redirect("/")

	return <>{children}</>
}
