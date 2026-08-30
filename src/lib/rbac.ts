import { KesalahanDomain } from "@/lib/kesalahan"

export type Peran = "PEMILIK" | "ADMIN" | "USER"

export type SesiPengguna = {
	id: string
	nama: string
	email: string
	peran: Peran
}

/** Kemampuan yang dapat diperiksa secara eksplisit. */
export type Kemampuan =
	| "kelola_kelas"
	| "kelola_peserta"
	| "kelola_pembayaran"
	| "kelola_absensi"
	| "kelola_sertifikat"
	| "lihat_dokumen_operasional"
	| "lihat_laporan_pemilik"
	| "kelola_admin"
	| "audit_sertifikat"

const kemampuanOperasional: Kemampuan[] = [
	"kelola_kelas",
	"kelola_peserta",
	"kelola_pembayaran",
	"kelola_absensi",
	"kelola_sertifikat",
	"lihat_dokumen_operasional",
]

const kemampuanPemilik: Kemampuan[] = [
	...kemampuanOperasional,
	"lihat_laporan_pemilik",
	"kelola_admin",
	"audit_sertifikat",
]

const petaKemampuan: Record<Peran, Kemampuan[]> = {
	PEMILIK: kemampuanPemilik,
	ADMIN: kemampuanOperasional,
	USER: [],
}

export function memilikiKemampuan(peran: Peran, kemampuan: Kemampuan): boolean {
	return petaKemampuan[peran].includes(kemampuan)
}

/** ADMIN dan PEMILIK dianggap peran operasional. */
export function adalahPeranOperasional(peran: Peran): boolean {
	return peran === "ADMIN" || peran === "PEMILIK"
}

export function wajibSesi(sesi: SesiPengguna | null | undefined): SesiPengguna {
	if (!sesi) {
		throw new KesalahanDomain(
			"TIDAK_TERAUTENTIKASI",
			"Anda harus masuk terlebih dahulu untuk melanjutkan.",
		)
	}
	return sesi
}

export function wajibKemampuan(
	sesi: SesiPengguna | null | undefined,
	kemampuan: Kemampuan,
): SesiPengguna {
	const pengguna = wajibSesi(sesi)
	if (!memilikiKemampuan(pengguna.peran, kemampuan)) {
		throw new KesalahanDomain(
			"TIDAK_BERWENANG",
			"Anda tidak memiliki hak akses untuk tindakan ini.",
		)
	}
	return pengguna
}

export function wajibPeran(
	sesi: SesiPengguna | null | undefined,
	daftarPeran: Peran[],
): SesiPengguna {
	const pengguna = wajibSesi(sesi)
	if (!daftarPeran.includes(pengguna.peran)) {
		throw new KesalahanDomain(
			"TIDAK_BERWENANG",
			"Anda tidak memiliki hak akses untuk halaman ini.",
		)
	}
	return pengguna
}

/**
 * Dokumen (invoice/sertifikat) hanya boleh dibaca pemiliknya atau peran
 * operasional yang sah.
 */
export function wajibPemilikDokumenAtauOperasional(
	sesi: SesiPengguna | null | undefined,
	userIdPemilikDokumen: string,
): SesiPengguna {
	const pengguna = wajibSesi(sesi)
	const bolehOperasional = memilikiKemampuan(
		pengguna.peran,
		"lihat_dokumen_operasional",
	)
	if (pengguna.id !== userIdPemilikDokumen && !bolehOperasional) {
		throw new KesalahanDomain(
			"TIDAK_BERWENANG",
			"Dokumen ini bukan milik akun Anda.",
		)
	}
	return pengguna
}

/** Beranda dashboard sesuai peran. */
export function berandaDashboard(peran: Peran): string {
	switch (peran) {
		case "PEMILIK":
			return "/pemilik"
		case "ADMIN":
			return "/admin"
		default:
			return "/user"
	}
}

/** Peran yang diizinkan mengakses sebuah prefix path dashboard. */
export function peranDiizinkanUntukPath(path: string): Peran[] | null {
	if (path === "/pemilik" || path.startsWith("/pemilik/")) return ["PEMILIK"]
	if (path === "/admin" || path.startsWith("/admin/")) return ["ADMIN", "PEMILIK"]
	if (path === "/user" || path.startsWith("/user/"))
		return ["USER", "ADMIN", "PEMILIK"]
	return null
}
