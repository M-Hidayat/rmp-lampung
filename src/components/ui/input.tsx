import * as React from "react"

import { cn } from "@/lib/utils"

const inputBase =
	"flex w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-950 shadow-xs transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				ref={ref}
				className={cn(inputBase, "h-9", className)}
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
				className={cn(inputBase, "min-h-[80px] py-2", className)}
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
				className={cn(inputBase, "h-9 cursor-pointer", className)}
				{...props}
			/>
		)
	},
)
Select.displayName = "Select"
