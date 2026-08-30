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
				"w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-xs",
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
			className={cn("w-full min-w-[36rem] caption-bottom text-sm", className)}
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
			className={cn("p-4 text-left text-xs text-zinc-500", className)}
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
			className={cn("bg-zinc-50/80 text-xs font-medium text-zinc-500 border-b border-zinc-200", className)}
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
			className={cn("divide-y divide-zinc-200 bg-white", className)}
			{...props}
		/>
	)
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			className={cn("transition-colors hover:bg-zinc-50/50 align-middle", className)}
			{...props}
		/>
	)
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			scope="col"
			className={cn("h-10 px-4 text-left align-middle font-medium text-zinc-500 text-xs", className)}
			{...props}
		/>
	)
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return <td className={cn("p-4 align-middle text-zinc-900 text-sm", className)} {...props} />
}
