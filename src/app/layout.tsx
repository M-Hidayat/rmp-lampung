import type { Metadata, Viewport } from "next"
import { Inter, Montserrat } from "next/font/google"

import "./globals.css"
import { identitasTampilan } from "@/lib/identitas-rmp"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" })

export const metadata: Metadata = {
	title: {
		default: `${identitasTampilan.nama} — Sistem Kursus`,
		template: `%s | ${identitasTampilan.nama}`,
	},
	description:
		"Sistem pendaftaran, pembayaran, absensi, dan sertifikat kursus kuliner Rumah Mama Pintar di Bandar Lampung.",
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="id" className={`${inter.variable} ${montserrat.variable} scroll-smooth`}>
			<body className="min-h-dvh bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
				<a className="lewati-ke-konten" href="#konten-utama">
					Lewati ke konten utama
				</a>
				{children}
			</body>
		</html>
	)
}
