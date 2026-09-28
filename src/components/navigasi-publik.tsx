"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { LogoRmp, type TautanNavigasi } from "@/components/kerangka"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NavigasiPublik({
	tautan,
	tombolMasuk,
	aksi,
}: {
	tautan: TautanNavigasi[]
	tombolMasuk?: { href: string; label: string }
	aksi?: React.ReactNode
}) {
	const [terbuka, setTerbuka] = useState(false)

	return (
		<header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
				<Link href="/" className="inline-flex min-h-11 items-center transition-opacity hover:opacity-90">
					<LogoRmp />
				</Link>

				{/* Navigasi desktop */}
				<nav aria-label="Navigasi utama desktop" className="hidden items-center gap-1 md:flex">
					<ul className="flex items-center gap-1 lg:gap-2">
						{tautan.map((item) => (
							<li key={item.href} className="relative">
								<Link
									href={item.href}
									className={cn(
										"relative inline-flex min-h-11 items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
										item.active
											? "font-semibold text-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-brand"
											: "text-muted-foreground",
									)}
								>
									{item.label}
								</Link>
							</li>
						))}
						{aksi ? <li className="pl-3">{aksi}</li> : null}
					</ul>
				</nav>

				{/* Sakelar menu mobile */}
				<div className="flex items-center gap-2 md:hidden">
					{aksi ? <div className="text-xs">{aksi}</div> : null}
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => setTerbuka((v) => !v)}
						aria-label={terbuka ? "Tutup menu" : "Buka menu"}
						aria-expanded={terbuka}
						aria-controls="menu-mobile"
					>
						{terbuka ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
					</Button>
				</div>
			</div>

			{/* Menu mobile */}
			{terbuka ? (
				<div id="menu-mobile" className="bg-background/95 px-4 py-4 shadow-md backdrop-blur-md md:hidden">
					<nav aria-label="Navigasi utama mobile">
						<ul className="flex flex-col gap-1">
							{tautan.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={() => setTerbuka(false)}
										className={cn(
											"flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
											item.active
												? "bg-accent font-semibold text-accent-foreground"
												: "text-muted-foreground",
										)}
									>
										{item.label}
									</Link>
								</li>
							))}
							{tombolMasuk ? (
								<li>
									<Link
										href={tombolMasuk.href}
										onClick={() => setTerbuka(false)}
										className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
									>
										{tombolMasuk.label}
									</Link>
								</li>
							) : null}
						</ul>
					</nav>
				</div>
			) : null}
		</header>
	)
}