/**
 * Identitas publik RMP.
 *
 * ATURAN: setiap nilai `terverifikasi: true` WAJIB memiliki sumber publik yang
 * dapat diperiksa. Nilai yang belum ditemukan tetap berupa placeholder
 * eksplisit ("[PLACEHOLDER: ...]") dan tidak boleh dikarang.
 * Rangkuman riset ada di `dokumentasi/identitas-rmp.md`.
 */

export type FaktaIdentitas<T> = {
	nilai: T
	terverifikasi: boolean
	sumber?: string[]
	catatan?: string
}

export const identitasRmp = {
	namaUsaha: {
		nilai: "RMP - Pelatihan Bisnis Kuliner",
		terverifikasi: true,
		sumber: [
			"https://www.facebook.com/rumahmasyarakatpintar.rmp/",
			"https://www.waze.com/id/live-map/directions/id/lampung/rmp-pelatihan-bisnis-kuliner-(kursus-kue,-masakan-dan-minuman)",
		],
	} satisfies FaktaIdentitas<string>,

	namaResmiBadanUsaha: {
		nilai: "[PLACEHOLDER: nama badan usaha resmi belum ditemukan pada sumber publik]",
		terverifikasi: false,
		catatan:
			"Nama akun media sosial memakai 'rumahmasyarakatpintar.rmp', namun bentuk badan usaha resmi belum terkonfirmasi.",
	} satisfies FaktaIdentitas<string>,

	jenisKursus: {
		nilai: "Kursus masakan, roti, kue, dan minuman; tersedia kelas tatap muka dan kelas online",
		terverifikasi: true,
		sumber: ["https://www.facebook.com/rumahmasyarakatpintar.rmp/"],
	} satisfies FaktaIdentitas<string>,

	alamat: {
		nilai: "Jl. Kapten Abdul Haq No. 03, Rajabasa, Kota Bandar Lampung, Lampung 35141",
		terverifikasi: true,
		sumber: [
			"https://www.waze.com/id/live-map/directions/id/lampung/rmp-pelatihan-bisnis-kuliner-(kursus-kue,-masakan-dan-minuman)",
			"https://www.instagram.com/reel/DJnjRO8vS6e/",
		],
		catatan:
			"Sumber publik memuat dua penomoran (No. 03 dan No. 50). Nomor 03 dipakai karena muncul pada unggahan resmi terbaru; wajib dikonfirmasi pemilik sebelum produksi.",
	} satisfies FaktaIdentitas<string>,

	kota: {
		nilai: "Bandar Lampung",
		terverifikasi: true,
		sumber: ["https://www.facebook.com/rumahmasyarakatpintar.rmp/"],
	} satisfies FaktaIdentitas<string>,

	telepon: {
		nilai: "+62 811-7970-171",
		terverifikasi: true,
		sumber: [
			"https://www.facebook.com/rumahmasyarakatpintar.rmp/",
			"https://www.instagram.com/reel/C1EmcjnLNrN/",
		],
	} satisfies FaktaIdentitas<string>,

	whatsapp: {
		nilai: "https://api.whatsapp.com/send?phone=628117970171",
		terverifikasi: true,
		sumber: ["https://www.instagram.com/reel/DJnjRO8vS6e/"],
	} satisfies FaktaIdentitas<string>,

	email: {
		nilai: "didikkominfolpg@gmail.com",
		terverifikasi: true,
		sumber: ["https://www.facebook.com/rumahmasyarakatpintar.rmp/"],
		catatan:
			"Email ini tercantum pada halaman Facebook resmi. Konfirmasi pemilik dianjurkan sebelum dipakai sebagai kontak transaksional.",
	} satisfies FaktaIdentitas<string>,

	mediaSosial: {
		nilai: [
			{
				nama: "Facebook",
				url: "https://www.facebook.com/rumahmasyarakatpintar.rmp/",
			},
			{ nama: "Instagram", url: "https://www.instagram.com/rmp_pintar/" },
			{ nama: "TikTok", url: "https://www.tiktok.com/@rmp_pintar" },
		],
		terverifikasi: true,
		sumber: [
			"https://www.facebook.com/rumahmasyarakatpintar.rmp/",
			"https://www.instagram.com/reel/DJnjRO8vS6e/",
		],
		catatan:
			"Nama akun 'rmp_pintar' tercantum pada halaman Facebook resmi; tautan Instagram/TikTok disusun dari nama akun tersebut dan perlu dikonfirmasi.",
	} satisfies FaktaIdentitas<{ nama: string; url: string }[]>,

	logo: {
		nilai: "[PLACEHOLDER: berkas logo resmi belum tersedia dari pemilik]",
		terverifikasi: false,
		catatan:
			"Sistem tidak membuat logo. UI memakai penanda teks 'RMP' sampai berkas resmi diberikan pemilik.",
	} satisfies FaktaIdentitas<string>,

	kelasYangPernahDitawarkan: {
		nilai: [
			"Pelatihan usaha mie ayam",
			"Pelatihan bakso",
			"Kursus kue",
			"Kursus masakan",
			"Kursus roti",
			"Kursus minuman",
		],
		terverifikasi: true,
		sumber: [
			"https://www.facebook.com/rumahmasyarakatpintar.rmp/videos/pelatihan-usaha-mie-ayam/4180165805643857/",
			"https://www.tiktok.com/@ainifortuna/video/7351021743101709574",
			"https://www.facebook.com/rumahmasyarakatpintar.rmp/",
		],
		catatan:
			"Judul, harga, dan jadwal resmi tiap kelas belum terkonfirmasi, sehingga data seed diberi label CONTOH.",
	} satisfies FaktaIdentitas<string[]>,

	polaPendaftaranSaatIni: {
		nilai: "Pendaftaran publik saat ini diarahkan melalui WhatsApp dan pesan langsung media sosial",
		terverifikasi: true,
		sumber: [
			"https://www.instagram.com/reel/DJnjRO8vS6e/",
			"https://www.instagram.com/reel/C1EmcjnLNrN/",
		],
	} satisfies FaktaIdentitas<string>,

	hargaResmi: {
		nilai: "[PLACEHOLDER: daftar harga resmi belum ditemukan pada sumber publik]",
		terverifikasi: false,
	} satisfies FaktaIdentitas<string>,
} as const

/** Teks pendek yang aman dipakai di UI dan dokumen PDF. */
export const identitasTampilan = {
	nama: identitasRmp.namaUsaha.nilai,
	alamat: identitasRmp.alamat.nilai,
	kota: identitasRmp.kota.nilai,
	telepon: identitasRmp.telepon.nilai,
	email: identitasRmp.email.nilai,
	jenisKursus: identitasRmp.jenisKursus.nilai,
} as const

/** Daftar fakta yang masih berupa placeholder (dipakai halaman profil). */
export function daftarPlaceholder(): { kunci: string; catatan: string }[] {
	return Object.entries(identitasRmp)
		.filter(([, fakta]) => !fakta.terverifikasi)
		.map(([kunci, fakta]) => ({
			kunci,
			catatan:
				"catatan" in fakta && fakta.catatan
					? fakta.catatan
					: "Data belum terverifikasi dari sumber publik.",
		}))
}
