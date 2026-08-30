import { redirect } from "next/navigation"

import { sesiPengguna } from "@/lib/auth"
import { peranDiizinkanUntukPath } from "@/lib/rbac"

/**
 * Lapisan proteksi area operasional (admin dan pemilik).
 * Peserta (USER) yang mencoba akses /admin dialihkan kembali ke /user.
 */
export default async function TataLetakAreaAdmin({
	children,
}: {
	children: React.ReactNode
}) {
	const sesi = await sesiPengguna()
	if (!sesi) redirect("/masuk?lanjut=/admin")

	const diizinkan = peranDiizinkanUntukPath("/admin") ?? []
	if (!diizinkan.includes(sesi.peran)) redirect("/user")

	return <>{children}</>
}
