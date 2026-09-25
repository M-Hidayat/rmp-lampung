import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Penanda proses memuat.
 *
 * Dipakai di dalam tombol saat aksi sedang berjalan. `Button` tidak punya prop
 * `isPending`/`isLoading`, jadi status menunggu disusun dari `Spinner` +
 * `disabled` (lihat aturan komposisi shadcn/ui).
 *
 * Sumber: registry `@shadcn/spinner`, dengan penyesuaian lokal: impor ikon
 * memakai `lucide-react` versi proyek dan memakai `cn` dari `@/lib/utils`
 * (registry memakai alias `cn` yang tidak ada di proyek ini).
 *
 * `role="status"` sudah menyampaikan keadaan ke pembaca layar; teks tombol di
 * sebelahnya menjelaskan proses apa yang sedang berjalan.
 */
function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2>) {
	return (
		<Loader2
			aria-hidden="true"
			className={cn("size-4 animate-spin", className)}
			{...props}
		/>
	)
}

export { Spinner }