import { redirect } from "next/navigation"

import { sesiPengguna } from "@/lib/auth"
import { peranDiizinkanUntukPath } from "@/lib/rbac"

/**
 * Lapisan proteksi area pemilik.
 * Role selain PEMILIK otomatis dialihkan ke dashboard masing-masing.
 */
export default async function TataLetakAreaPemilik({
	children,
}: {
	children: React.ReactNode
}) {
	const sesi = await sesiPengguna()
	if (!sesi) redirect("/masuk?lanjut=/pemilik")

	const diizinkan = peranDiizinkanUntukPath("/pemilik") ?? []
	if (!diizinkan.includes(sesi.peran)) {
		if (sesi.peran === "ADMIN") redirect("/admin")
		redirect("/user")
	}

	return <>{children}</>
}
