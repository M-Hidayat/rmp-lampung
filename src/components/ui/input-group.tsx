"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * Pembungkus kontrol dengan tambahan di sisi dalam (ikon, tombol, teks).
 *
 * Dipakai agar tombol/ikon tidak lagi diposisikan manual dengan `absolute` di
 * atas `Input` — pola itu rapuh dan tidak ramah pembaca layar.
 *
 * Sumber: registry `@shadcn/input-group` (new-york-v4), dengan penyesuaian
 * lokal agar menyatu dengan primitif proyek:
 * - `InputGroupInput` memakai `Input` milik proyek, sehingga tinggi 44px
 *   (target sentuh minimum DESIGN.md) tetap terjaga — registry memakai 36px
 *   (`h-9`) dan tidak punya permukaan `bg-card`.
 * - `InputGroup` mengikuti token proyek: `bg-card`, cincin fokus `ring`
 *   tunggal (bukan `ring-[3px]`), dan **tanpa bayangan** sesuai bahasa tata
 *   letak datar RMP (registry memakai `shadow-xs`).
 * - Tidak ada varian gelap: aplikasi ini satu mode terang.
 */

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="input-group"
			role="group"
			className={cn(
				"group/input-group relative flex h-11 w-full min-w-0 items-center rounded-md border border-input bg-card transition-colors duration-150",
				"has-[>textarea]:h-auto",

				// Penyelarasan bilah tambahan di dalam pembungkus.
				"has-[>[data-align=inline-start]]:[&>input]:pl-2",
				"has-[>[data-align=inline-end]]:[&>input]:pr-2",
				"has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
				"has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

				// Cincin fokus dipindahkan ke pembungkus agar tampak satu kontrol utuh.
				"has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1 has-[[data-slot=input-group-control]:focus-visible]:ring-ring",

				// Keadaan tidak valid mengikuti kontrak token `aria-invalid` proyek.
				"has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-1 has-[[data-slot][aria-invalid=true]]:ring-destructive",

				className,
			)}
			{...props}
		/>
	)
}

const inputGroupAddonVariants = cva(
	"flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4",
	{
		variants: {
			align: {
				"inline-start": "order-first pl-3",
				"inline-end": "order-last pr-3",
				"block-start": "order-first w-full justify-start px-3 pt-3",
				"block-end": "order-last w-full justify-start px-3 pb-3",
			},
		},
		defaultVariants: {
			align: "inline-start",
		},
	},
)

function InputGroupAddon({
	className,
	align = "inline-start",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
	return (
		<div
			role="group"
			data-slot="input-group-addon"
			data-align={align}
			className={cn(inputGroupAddonVariants({ align }), className)}
			onClick={(kejadian) => {
				// Klik pada tambahan teks/ikon memfokuskan kontrolnya, tetapi klik
				// pada tombol di dalamnya dibiarkan apa adanya.
				if ((kejadian.target as HTMLElement).closest("button")) return
				kejadian.currentTarget.parentElement?.querySelector("input")?.focus()
			}}
			{...props}
		/>
	)
}

function InputGroupButton({
	className,
	type = "button",
	variant = "ghost",
	...props
}: React.ComponentProps<typeof Button>) {
	return (
		<Button
			type={type}
			variant={variant}
			className={cn("size-9 min-h-9 shrink-0 rounded-md p-0", className)}
			{...props}
		/>
	)
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	)
}

function InputGroupInput({
	className,
	...props
}: React.ComponentProps<"input">) {
	return (
		<Input
			data-slot="input-group-control"
			className={cn(
				"h-full flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0 aria-invalid:ring-0",
				className,
			)}
			{...props}
		/>
	)
}

function InputGroupTextarea({
	className,
	...props
}: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="input-group-control"
			className={cn(
				"flex min-h-24 w-full flex-1 resize-none rounded-none border-0 bg-transparent px-3 py-3 text-sm text-foreground shadow-none focus-visible:outline-none",
				className,
			)}
			{...props}
		/>
	)
}

export {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
}