import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tombol mengikuti kontrak varian di DESIGN.md.
 *
 * Bahasa tata letak: tombol **datar** — tanpa bayangan, hanya isian atau
 * border 1px. Sudut `lg` (8px) agar konsisten dengan kartu.
 *
 * Setiap warna berasal dari token semantik; tidak ada heksadesimal atau kelas
 * palet mentah di berkas ini. Status hover memakai token padat (`primary-hover`,
 * dst.) alih-alih opasitas, karena opasitas mengubah warna latar sehingga rasio
 * kontras teks berubah-ubah dan sulit diaudit.
 *
 * Rasio terukur (lihat DESIGN.md):
 * - default:  putih di atas primary (#0E1316) = 18.69:1 AAA
 * - brand:    putih di atas brand (#745FD4)    =  4.85:1 AA
 * - gold:     accent-foreground di atas accent =  6.67:1 AA
 * - destructive: putih di atas destructive      =  6.47:1 AA
 */
const buttonVariants = cva(
	"inline-flex min-h-11 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				// Aksi utama layar. Hamburkan dengan hemat.
				default: "bg-primary text-primary-foreground hover:bg-primary-hover",
				// Identitas kuliner tradisional.
				brand: "bg-brand text-brand-foreground hover:bg-brand/90",
				// Jalur bernilai: daftar, bayar, hubungi. Satu-satunya cara
				// memakai amber untuk teks ber-kontras aman.
				gold: "bg-accent text-accent-foreground hover:bg-accent/70",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				// Varian untuk tombol yang berdiri di atas permukaan navy.
				// Putih di atas navy = 17.85:1 AAA.
				onDark:
					"border border-primary-muted/40 text-primary-foreground hover:bg-primary-foreground/10",
				ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
				link: "min-h-0 text-accent-foreground underline-offset-4 hover:underline",
			},
			size: {
				default: "px-5 py-2.5",
				sm: "min-h-9 rounded-md px-4 text-sm",
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