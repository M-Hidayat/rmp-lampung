import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Panggilan perhatian. Seluruh pesan sistem memakai komponen ini, bukan `div`
 * bergaya sendiri, agar bentuknya seragam di semua halaman.
 *
 * Warna diambil dari token semantik `*-surface` dengan ikon berwarna token
 * status padat. Teks badan tetap `foreground` sehingga kontrasnya sangat tinggi
 * (>= 16:1) di atas keempat permukaan.
 */
const variasiAlert = cva(
	"relative flex w-full gap-3 rounded-md border p-4 text-sm",
	{
		variants: {
			variant: {
				info: "border-border bg-info-surface text-foreground",
				sukses: "border-success/30 bg-success-surface text-foreground",
				peringatan: "border-warning/30 bg-warning-surface text-foreground",
				gagal: "border-destructive/30 bg-destructive-surface text-foreground",
			},
		},
		defaultVariants: { variant: "info" },
	},
)

const warnaIkon: Record<
	NonNullable<VariantProps<typeof variasiAlert>["variant"]>,
	string
> = {
	info: "text-muted-foreground",
	sukses: "text-success",
	peringatan: "text-warning",
	gagal: "text-destructive",
}

export type AlertProps = React.ComponentProps<"div"> &
	VariantProps<typeof variasiAlert> & { judul?: string }

export function Alert({
	className,
	variant = "info",
	judul,
	children,
	...props
}: AlertProps) {
	// `variant` dari cva bertipe `... | null | undefined`; disempitkan di sini
	// agar pemetaan ikon dan warna selalu terdefinisi.
	const varian: NonNullable<VariantProps<typeof variasiAlert>["variant"]> =
		variant ?? "info"

	const Ikon =
		varian === "sukses"
			? CheckCircle2
			: varian === "peringatan"
				? AlertTriangle
				: varian === "gagal"
					? AlertCircle
					: Info

	return (
		<div
			role={varian === "gagal" ? "alert" : "status"}
			className={cn(variasiAlert({ variant: varian }), className)}
			{...props}
		>
			<Ikon aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0", warnaIkon[varian])} />
			<div className="flex min-w-0 flex-col gap-1">
				{judul ? (
					<p className="font-heading font-bold leading-snug">{judul}</p>
				) : null}
				<div className="leading-relaxed text-muted-foreground">{children}</div>
			</div>
		</div>
	)
}