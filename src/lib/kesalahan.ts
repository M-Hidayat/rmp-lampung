/** Kode kesalahan domain. Dipakai untuk memetakan status HTTP. */
export type KodeKesalahan =
	| "VALIDASI"
	| "TIDAK_TERAUTENTIKASI"
	| "TIDAK_BERWENANG"
	| "TIDAK_DITEMUKAN"
	| "KONFLIK"
	| "TRANSISI_TIDAK_SAH"

const petaStatus: Record<KodeKesalahan, number> = {
	VALIDASI: 400,
	TIDAK_TERAUTENTIKASI: 401,
	TIDAK_BERWENANG: 403,
	TIDAK_DITEMUKAN: 404,
	KONFLIK: 409,
	TRANSISI_TIDAK_SAH: 422,
}

/**
 * Kesalahan yang aman ditampilkan ke pengguna. Pesan selalu Bahasa Indonesia
 * dan tidak memuat detail internal (query, stack, atau rahasia).
 */
export class KesalahanDomain extends Error {
	readonly kode: KodeKesalahan
	readonly detail?: Record<string, string>

	constructor(
		kode: KodeKesalahan,
		pesan: string,
		detail?: Record<string, string>,
	) {
		super(pesan)
		this.name = "KesalahanDomain"
		this.kode = kode
		this.detail = detail
	}

	get statusHttp(): number {
		return petaStatus[this.kode]
	}
}

export function kesalahanValidasi(
	pesan: string,
	detail?: Record<string, string>,
): KesalahanDomain {
	return new KesalahanDomain("VALIDASI", pesan, detail)
}

/**
 * Membentuk respons JSON yang aman. Kesalahan tak terduga selalu menjadi
 * pesan umum berbahasa Indonesia.
 */
export function keResponsKesalahan(kesalahan: unknown): {
	status: number
	body: { sukses: false; pesan: string; kode: string; detail?: Record<string, string> }
} {
	if (kesalahan instanceof KesalahanDomain) {
		return {
			status: kesalahan.statusHttp,
			body: {
				sukses: false,
				pesan: kesalahan.message,
				kode: kesalahan.kode,
				detail: kesalahan.detail,
			},
		}
	}

	console.error("[kesalahan-tak-terduga]", kesalahan)
	return {
		status: 500,
		body: {
			sukses: false,
			pesan: "Terjadi kesalahan pada server. Silakan coba lagi.",
			kode: "KESALAHAN_SERVER",
		},
	}
}
