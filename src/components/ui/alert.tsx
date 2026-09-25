import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const variasiAlert = cva(
	"relative w-full rounded-md border p-4 text-sm shadow-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
	{
		variants: {
			variant: {
				// Memakai token semantik, bukan palet mentah, agar seragam di semua
				// halaman yang nanti ikut memakai shadcn.
				info: "border-border bg-info-surface text-foreground [&>svg]:text-muted-foreground",
				sukses:
					"border-success/30 bg-success-surface text-foreground [&>svg]:text-success",
				peringatan:
					"border-warning/30 bg-warning-surface text-foreground [&>svg]:text-warning",
				gagal:
					"border-destructive/30 bg-destructive-surface text-foreground [&>svg]:text-destructive",
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
				<div className="text-sm leading-relaxed text-current/80">{children}</div>
			</div>
		</div>
	)
}
