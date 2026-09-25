import { Skeleton } from "@/components/ui/skeleton"

type LoadingSkeletonProps = { variant?: "public" | "auth" | "dashboard" }

/**
 * Placeholder saat konten dimuat.
 *
 * Memakai komponen `Skeleton` (bukan `div` ber-`animate-pulse` sendiri) supaya
 * warna placeholder selalu berasal dari token `muted` dan bentuknya seragam
 * dengan sisa aplikasi.
 */
export function LoadingSkeleton({ variant = "public" }: LoadingSkeletonProps) {
	const kartu = variant === "dashboard" ? 4 : 3
	const gridKartu =
		variant === "dashboard" ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3"

	return (
		<div role="status" aria-live="polite" aria-busy="true" className="flex w-full flex-col gap-6">
			<span className="sr-only">Memuat halaman…</span>

			<div className={variant === "auth" ? "mx-auto flex w-full max-w-md flex-col gap-4" : "flex flex-col gap-4"}>
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-72 max-w-full" />
			</div>

			{variant === "auth" ? (
				<Skeleton className="mx-auto h-64 w-full max-w-md rounded-lg" />
			) : (
				<div className={`grid gap-5 ${gridKartu}`}>
					{Array.from({ length: kartu }, (_, i) => (
						<div key={i} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-4/5" />
						</div>
					))}
				</div>
			)}
		</div>
	)
}