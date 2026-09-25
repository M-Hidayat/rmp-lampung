import Link from "next/link"

import { LogoRmp } from "@/components/kerangka"
import { Button } from "@/components/ui/button"

export default function TataLetakAutentikasi({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="border-b border-border bg-card">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
					<Link href="/" className="inline-flex min-h-11 items-center transition-opacity hover:opacity-90">
						<LogoRmp />
					</Link>
					<Button asChild variant="ghost" size="sm">
						<Link href="/kelas">Katalog Kelas</Link>
					</Button>
				</div>
			</header>
			<main
				id="konten-utama"
				className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10"
			>
				<div className="w-full">{children}</div>
			</main>
		</div>
	)
}