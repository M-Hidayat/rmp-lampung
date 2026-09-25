import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex min-h-11 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				// Aksi utama: navy. Kontras putih-di-atas-navy = 17.85:1 (LULUS AA).
				default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
				// Aksen brand kuliner tradisional (crimson). 6.68:1 di atas putih.
				brand: "bg-brand text-brand-foreground shadow-sm hover:bg-brand/90",
				// Permukaan CTA hangat. Teks memakai accent-foreground (#C2410C,
				// 5.18:1) BUKAN tertiary (#EA580C, 3.56:1 yang gagal AA).
				gold: "bg-accent text-accent-foreground border border-brand-border shadow-sm hover:bg-accent/70",
				"gold-outline":
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "min-h-0 text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "px-4 py-2.5",
				sm: "min-h-9 rounded-md px-3 text-xs",
				lg: "min-h-12 px-6 text-base",
				icon: "size-11 min-h-11 p-0",
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
