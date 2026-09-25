"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Garis pemisah antar konten.
 *
 * Dekoratif (role="none"), sehingga pembaca layar tidak mengumumkannya —
 * pemisahan makna tetap dibawa oleh struktur judul/landmark.
 */
function Separator({
	className,
	orientation = "horizontal",
	...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
	return (
		<div
			data-slot="separator"
			role="none"
			className={cn(
				"shrink-0 bg-border",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className,
			)}
			{...props}
		/>
	)
}

export { Separator }
