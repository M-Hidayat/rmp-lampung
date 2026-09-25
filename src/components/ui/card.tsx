import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Kartu mengikuti komposisi penuh (Header → Content → Footer) dan satu bentuk
 * untuk seluruh aplikasi: radius `lg` (8px) dan border 1px.
 *
 * Permukaan **datar** — tanpa bayangan. Kedalaman dipakai hanya untuk elemen
 * yang benar-benar mengambang (lihat DESIGN.md bagian Elevation). Media di dalam
 * kartu tidak memakai radius sendiri.
 *
 * `min-w-0` wajib: saat kartu menjadi item grid/flex, lebar minimumnya default
 * `auto` sehingga satu kata panjang tanpa spasi (mis. deskripsi kelas) dapat
 * melebarkan kolom dan menimbulkan overflow horizontal di layar kecil.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card"
			className={cn(
				"flex min-w-0 flex-col rounded-lg border border-border bg-card text-card-foreground",
				className,
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn("flex flex-col gap-1.5 p-6", className)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				"min-w-0 break-words font-heading text-base font-bold leading-snug tracking-tight text-card-foreground",
				className,
			)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("min-w-0 break-words text-sm leading-relaxed text-muted-foreground", className)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("p-6 pt-0", className)}
			{...props}
		/>
	)
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center p-6 pt-0", className)}
			{...props}
		/>
	)
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }