import type { Metadata, Viewport } from "next"

import "./globals.css"
import { identitasTampilan } from "@/lib/identitas-rmp"

export const metadata: Metadata = {
	title: {
		default: `${identitasTampilan.nama} — Sistem Kursus`,
		template: `%s | ${identitasTampilan.nama}`,
	},
	description:
		"Sistem pendaftaran, pembayaran, absensi, dan sertifikat kursus kuliner RMP di Bandar Lampung.",
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="id" className="scroll-smooth">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			</head>
			<body className="min-h-dvh bg-zinc-50/50 text-zinc-950 antialiased selection:bg-zinc-900 selection:text-zinc-50">
				<a className="lewati-ke-konten" href="#konten-utama">
					Lewati ke konten utama
				</a>
				{children}
			</body>
		</html>
	)
}
