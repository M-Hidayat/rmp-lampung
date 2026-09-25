import { cn } from "@/lib/utils"

/**
 * Placeholder saat konten dimuat.
 *
 * Dipakai alih-alih spinner agar tata letak tidak melompat (CLS) dan ukuran
 * placeholder menyerupai konten akhirnya.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			aria-hidden="true"
			className={cn("animate-pulse rounded-md bg-muted", className)}
			{...props}
		/>
	)
}

export { Skeleton }
