import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
	"inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 select-none",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-zinc-900 text-white shadow-xs hover:bg-zinc-800",
				secondary:
					"border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
				destructive:
					"border-transparent bg-red-600 text-white shadow-xs hover:bg-red-500",
				outline: "text-zinc-950 border-zinc-200",
				brand:
					"border-orange-200 bg-orange-50 text-orange-700",
				sukses:
					"border-emerald-200 bg-emerald-50 text-emerald-700",
				success:
					"border-emerald-200 bg-emerald-50 text-emerald-700",
				gagal:
					"border-red-200 bg-red-50 text-red-700",
				menunggu:
					"border-amber-200 bg-amber-50 text-amber-700",
				netral:
					"border-zinc-200 bg-zinc-100 text-zinc-700",
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
