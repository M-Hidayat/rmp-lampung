import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const variasiAlert = cva(
	"relative w-full rounded-lg border p-4 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
	{
		variants: {
			variant: {
				info: "border-zinc-200 bg-zinc-50 text-zinc-900 [&>svg]:text-zinc-900",
				sukses: "border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-600",
				peringatan: "border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600",
				gagal: "border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600",
			},
		},
		defaultVariants: { variant: "info" },
	},
)

export type AlertProps = React.ComponentProps<"div"> &
	VariantProps<typeof variasiAlert> & { judul?: string }

export function Alert({
	className,
	variant = "info",
	judul,
	children,
	...props
}: AlertProps) {
	const renderIcon = () => {
		switch (variant) {
			case "sukses":
				return <CheckCircle2 className="size-4 shrink-0" />
			case "peringatan":
				return <AlertTriangle className="size-4 shrink-0" />
			case "gagal":
				return <AlertCircle className="size-4 shrink-0" />
			default:
				return <Info className="size-4 shrink-0" />
		}
	}

	return (
		<div
			role={variant === "gagal" ? "alert" : "status"}
			className={cn(variasiAlert({ variant }), className)}
			{...props}
		>
			{renderIcon()}
			<div className="space-y-1">
				{judul ? <h5 className="font-semibold leading-none tracking-tight">{judul}</h5> : null}
				<div className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{children}</div>
			</div>
		</div>
	)
}
