import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-zinc-900 text-white shadow-xs hover:bg-zinc-800",
				brand:
					"bg-[#D49A28] text-white shadow-xs hover:bg-[#B87B1A] active:bg-[#9E6711]",
				gold:
					"bg-[#D49A28] text-white shadow-xs hover:bg-[#B87B1A] active:bg-[#9E6711]",
				"gold-outline":
					"border border-[#D49A28] bg-white text-[#925B08] shadow-xs hover:bg-[#FDF8ED] hover:text-[#7A4B07]",
				destructive:
					"bg-red-600 text-white shadow-xs hover:bg-red-500",
				outline:
					"border border-zinc-200 bg-white text-zinc-900 shadow-xs hover:bg-zinc-100 hover:text-zinc-900",
				secondary:
					"bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-200",
				ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
				link: "text-zinc-900 underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-6 text-sm font-semibold",
				icon: "size-9 rounded-md",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

export type VariasiTombol = VariantProps<typeof buttonVariants>["variant"]

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button"
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	},
)
Button.displayName = "Button"

export { Button, buttonVariants }
