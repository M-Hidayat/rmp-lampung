import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Kontrol input bersama. Tinggi 44px agar target sentuh memenuhi minimum
 * (DESIGN.md bagian Layout).
 *
 * Keadaan tidak valid ditandai `aria-invalid`, yang juga mengubah cincin fokus
 * menjadi warna destructive — satu-satunya sinyal error, jadi tidak ada dua
 * gaya error yang berbeda antar formulir.
 */
const inputBase =
	"flex w-full rounded-md border border-input bg-card px-3 text-sm text-foreground transition-colors duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive"

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				ref={ref}
				className={cn(inputBase, "h-11", className)}
				{...props}
			/>
		)
	},
)
Input.displayName = "Input"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				className={cn(inputBase, "min-h-24 py-3", className)}
				{...props}
			/>
		)
	},
)
Textarea.displayName = "Textarea"

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
	({ className, ...props }, ref) => {
		return (
			<select
				ref={ref}
				className={cn(inputBase, "h-11 cursor-pointer", className)}
				{...props}
			/>
		)
	},
)
Select.displayName = "Select"