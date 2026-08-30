import Link from "next/link"

import { LogoRmp } from "@/components/kerangka"
import { Button } from "@/components/ui/button"

export default function TataLetakAutentikasi({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-dvh flex-col bg-[#FAF8F5]">
			<header className="border-b border-[#EFECE6] bg-white/95 backdrop-blur-xs">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
					<Link href="/" className="transition-opacity hover:opacity-90">
						<LogoRmp />
					</Link>
					<Button asChild variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-950 font-medium">
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
