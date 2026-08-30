import type { NextConfig } from "next"

/**
 * Konfigurasi Next.js untuk sistem RMP Lampung.
 * Versi Next.js tidak diturunkan (lihat Keputusan Eksplisit pada README).
 */
const nextConfig: NextConfig = {
	// @react-pdf/renderer hanya dijalankan di server (route handler dokumen).
	serverExternalPackages: ["@react-pdf/renderer"],
	typedRoutes: false,
}

export default nextConfig
