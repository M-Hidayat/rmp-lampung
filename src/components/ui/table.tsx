import * as React from "react"

import { cn } from "@/lib/utils"

/** Pembungkus tabel adaptif: dapat digulir horizontal pada layar kecil dengan styling halus. */
export function TableWrapper({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<div
			className={cn(
				"w-full overflow-x-auto rounded-md border border-border bg-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
				className,
			)}
			tabIndex={0}
		>
			{children}
		</div>
	)
}
export function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<table
			className={cn("w-full min-w-[32rem] sm:min-w-[38rem] caption-bottom text-sm", className)}
			{...props}
		/>
	)
}

export function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			className={cn("p-4 text-left text-sm text-muted-foreground", className)}
			{...props}
		/>
	)
}

export function TableHeader({
	className,
	...props
}: React.ComponentProps<"thead">) {
	return (
		<thead
			className={cn("border-b border-border bg-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}
			{...props}
		/>
	)
}

export function TableBody({
	className,
	...props
}: React.ComponentProps<"tbody">) {
	return (
		<tbody
			className={cn("divide-y divide-border bg-white", className)}
			{...props}
		/>
	)
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			className={cn("align-middle transition-colors duration-150 hover:bg-muted", className)}
			{...props}
		/>
	)
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			scope="col"
			className={cn("h-11 px-4 text-left align-middle text-xs font-semibold text-muted-foreground", className)}
			{...props}
		/>
	)
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return <td className={cn("p-4 align-middle text-sm text-foreground", className)} {...props} />
}
