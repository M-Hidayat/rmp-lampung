import { NextResponse, type NextRequest } from "next/server"

import { peranDiizinkanUntukPath } from "@/lib/rbac"

/**
 * Lapisan proteksi pertama.
 *
 * Middleware hanya memeriksa keberadaan cookie sesi sehingga tetap ringan dan
 * kompatibel dengan runtime edge (klien Prisma tidak dipanggil di sini).
 * Pemeriksaan peran yang mengikat dilakukan pada layout dashboard, route
 * handler/server action, query berlingkup peran, dan layanan domain.
 */
const namaCookieSesi = [
	"authjs.session-token",
	"__Secure-authjs.session-token",
	"next-auth.session-token",
	"__Secure-next-auth.session-token",
]

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname
	if (!peranDiizinkanUntukPath(path)) return NextResponse.next()

	const adaSesi = namaCookieSesi.some((nama) => request.cookies.has(nama))
	if (adaSesi) return NextResponse.next()

	const tujuan = new URL("/masuk", request.nextUrl.origin)
	tujuan.searchParams.set("lanjut", `${path}${request.nextUrl.search}`)
	return NextResponse.redirect(tujuan)
}

export const config = {
	matcher: ["/user/:path*", "/admin/:path*", "/pemilik/:path*"],
}
