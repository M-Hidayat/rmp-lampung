import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Lencana status. Satu-satunya cara menampilkan status di aplikasi ini.
 *
 * Varian dipetakan langsung ke status domain (lihat DESIGN.md bagian
 * Components) sehingga halaman mana pun memakai nama varian yang sama:
 * - `sukses`      -> hadir, lunas, terverifikasi, valid
 * - `menunggu`    -> menunggu pembayaran, sisa kuota, placeholder
 * - `destructive` -> penuh, dibatalkan, gagal
 * - `netral`      -> nonaktif, informasi
 *
 * Isian berteks putih; seluruh pasangan diuji dan lulus WCAG AA.
 */
const badgeVariants = cva(
	"inline-flex select-none items-center rounded-sm border px-2.5 py-1 text-xs font-semibold transition-colors",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground",
				sukses:
					"border-transparent bg-success text-success-foreground",
				menunggu:
					"border-transparent bg-warning text-warning-foreground",
				netral:
					"border-transparent bg-secondary text-secondary-foreground",
				outline: "border-border text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	)
}

export { Badge, badgeVariants }