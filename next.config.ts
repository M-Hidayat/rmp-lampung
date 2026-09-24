import type { NextConfig } from "next"

/**
 * Konfigurasi Next.js untuk sistem RMP Lampung.
 * Versi Next.js tidak diturunkan (lihat Keputusan Eksplisit pada README).
 */
const nextConfig: NextConfig = {
	// Output standalone: image runtime hanya membawa server.js + dependensi
	// yang benar-benar dipakai, tanpa devDependencies.
	output: "standalone",
	// @react-pdf/renderer hanya dijalankan di server (route handler dokumen).
	serverExternalPackages: ["@react-pdf/renderer"],
	typedRoutes: false,
}

export default nextConfig
