/**
 * Bukti publik Rumah Mama Pintar yang dapat diperiksa siapa pun.
 *
 * ATURAN (sama tegasnya dengan identitas-rmp.ts):
 * - Hanya liputan/kerja sama/ulasan yang PUNYA alamat publik yang boleh masuk.
 * - Tidak ada testimoni karangan, tidak ada angka yang dibulatkan tanpa dasar.
 * - Kutipan ditulis apa adanya, termasuk salah tulis aslinya, beserta nama asli.
 * - Bila sumber hilang/berubah, entri DIHAPUS — bukan diganti dengan klaim baru.
 *
 * Semua entri diverifikasi 25 September 2026 dengan membaca langsung halaman
 * sumbernya (bukan dari ringkasan mesin pencari), dan tautannya diuji ulang
 * saat deploy.
 */

export type JenisBukti = "liputan-media" | "institusi-pendidikan" | "organisasi"

export type BuktiPublik = {
	id: string
	jenis: JenisBukti
	penerbit: string
	judul: string
	url: string
	/** Tanggal terbit/peristiwa (ISO) agar bisa diurutkan. */
	tanggal: string
	ringkas: string
	kutipan?: { teks: string; oleh: string }[]
	fakta?: string[]
}

export const buktiPublik: BuktiPublik[] = [
	{
		id: "sman13-2025",
		jenis: "institusi-pendidikan",
		penerbit: "SMAN 13 Bandar Lampung",
		judul:
			"Kunjungan SMAN 13 Bandar Lampung ke RMP sebagai bagian dari Program Double Track",
		url: "https://sman13bdl.sch.id/informasi/publikasi/kunjungan-sman13-bandar-lampung-ke-rmp-rumah-mama-pintar-sebagai-bagian-dari-program-double-track",
		tanggal: "2025-01-18",
		ringkas:
			"Siswa kelas XII SMAN 13 Bandar Lampung mengikuti kunjungan edukatif ke Rumah Mama Pintar untuk belajar membuat kue, dari kue tradisional hingga kue modern, termasuk strategi pemasaran sederhana.",
		kutipan: [
			{
				teks:
					"Program ini sangat bermanfaat bagi siswa kami, terutama dalam mempersiapkan mereka untuk terjun ke dunia wirausaha.",
				oleh: "Febriansah, S.Pd., M.Pd. — Kepala SMAN 13 Bandar Lampung",
			},
			{
				teks:
					"Ini pengalaman yang sangat berharga. Kami jadi tahu cara membuat kue yang enak dan menarik.",
				oleh: "Rika Nopiani — siswa peserta",
			},
		],
		fakta: [
			"Dihadiri Kepala Sekolah dan keempat wakil kepala sekolah",
			"Materi mencakup pemilihan bahan baku, teknik pengemasan, dan pemasaran digital",
		],
	},
	{
		id: "iipg-2026",
		jenis: "organisasi",
		penerbit: "Monologis.id",
		judul: "IIPG Lampung Tengah Dorong Perempuan Kembangkan Keterampilan",
		url: "https://monologis.id/iipg-lampung-tengah-dorong-perempuan-kembangkan-keterampilan",
		tanggal: "2026-09-20",
		ringkas:
			"Ikatan Istri Partai Golkar (IIPG) Lampung Tengah menggelar pelatihan memasak bersama Rumah Mama Pintar di Pondok Cherry Glompong, Lampung Tengah, untuk pemberdayaan perempuan dan pembukaan peluang ekonomi keluarga.",
		kutipan: [
			{
				teks:
					"Dengan adanya pelatihan ini, saya harap akan muncul ide-ide baru yang kemudian bisa dikembangkan. Bukan hanya menambah skill memasak, tetapi juga menumbuhkan keberanian untuk mencoba dan berkreasi.",
				oleh: "drg. Yuniar Musa Ahmad — Ketua IIPG Lampung Tengah",
			},
			{
				teks:
					"Senang bisa ikut kegiatan seperti ini. Selain belajar memasak, kita juga bisa bertemu dengan ibu-ibu lainnya, bertukar pengalaman dan mendapatkan ilmu baru.",
				oleh: "Fitri Sukesi — peserta pelatihan",
			},
		],
	},
	{
		id: "travel2lampung-2020",
		jenis: "liputan-media",
		penerbit: "Travel2Lampung",
		judul: "Aneka Pelatihan Usaha Kuliner di Rumah Mama Pintar",
		url: "https://travel2lampung.com/aneka-pelatihan-usaha-kuliner-di-rumah-mama-pintar/",
		tanggal: "2020-04-20",
		ringkas:
			"Ulasan ragam pelatihan usaha kuliner di Rumah Mama Pintar, mencakup kue, masakan, minuman, roti, jajanan pasar, hingga masakan catering. Disebutkan peserta datang dari berbagai kabupaten/kota di Lampung dan sebagian dari luar provinsi.",
		fakta: [
			"Materi yang disebut: kue, masakan, minuman, roti, jajanan pasar, pempek, batagor, bakso, mie ayam, soto, martabak, dan catering",
			"Tersedia kelas tatap muka dan kelas online",
		],
	},
]

/* ------------------------------ Ulasan asli ------------------------------ */

export type UlasanMaps = {
	nama: string
	/** Waktu relatif seperti ditampilkan Google. */
	ketika: string
	teks: string
	/** Statistik kontributor bila disebut Google. */
	profil?: string
}

/**
 * Ulasan Google Maps milik RMP Pelatihan Bisnis Kuliner.
 *
 * Dikutip APA ADANYA dari panel ulasan Google (penarikan 25 Sep 2026).
 * Salah tulis asli sengaja DIPERTAHANKAN (mis. "untk", "bs", "dirmh") karena
 * itu bukti kutipan asli, bukan tulisan kami. Hanya emoji berlebih di ujung
 * ulasan yang dipotong dan ditandai elipsis. Makna tidak diubah sama sekali.
 * Semua dapat diperiksa di tautan peta pada `profilMaps.url`.
 */
export const ulasanMaps: UlasanMaps[] = [
	{
		nama: "M. Al Fatih & Gian",
		profil: "1 ulasan · 8 foto",
		ketika: "3 tahun lalu",
		teks: "Belajar di RMP sangat membantu sekali bagi saya untk bs memasak dg sangat mudah dan memuaskan. Diajari dg cara yg sangat detail dr basic sampai bs dan di selalu dibimbing melalui WA dr pengajar yg ramah saat praktek dirmh mengalami kesulitan. Pokok nya belajar di RMP tidak rugi.",
	},
	{
		nama: "Ayu Suchesty",
		profil: "2 ulasan · 12 foto",
		ketika: "4 tahun lalu",
		teks: "Alhamdulillah bisa bergabung kursus di RMP, selain menambah ilmu, menambah teman, juga menambah penghasilan. Diajarkan dari nol sampai bisa, dibimbing langsung oleh owner-nya & selalu bisa.",
	},
	{
		nama: "Erni Dwi rahmawati",
		profil: "1 ulasan · 15 foto",
		ketika: "3 tahun lalu",
		teks: "Alhamdulillah bs bergabung d RMP, Coach ny baik hati, sabar dan semua resep d berikan tanpa ad rahasia... Terimakasih Bunda Aini sdh memberikan ilmu ny semoga menjadi ladang pahala untuk Bunda Aini.",
	},
	{
		nama: "Diesrontje Lahawia",
		profil: "Local Guide · 25 ulasan · 47 foto",
		ketika: "3 tahun lalu",
		teks: "Belajar bersama di RMP untuk meraih sukses merupakan hal sangat positif juga membahagiakan diri sendiri. Jangan pernah bosan untuk berkarya. Banyak ilmu tentang kuliner yang yummy banget alias enak banget ketika belajar di sini (RMP).",
	},
	{
		nama: "fenti andriyani",
		profil: "4 ulasan · 2 foto",
		ketika: "3 tahun lalu",
		teks: "Alhamdulillah bersyukur pernah ikut pelatihan di RMP, keren mantaf, instrukturnya jg baik dan ramah.",
	},
]

/** Data listing Google Maps. Semua nilai di bawah ini terbaca dari halaman peta. */
export const profilMaps = {
	nama: "RMP Pelatihan Bisnis Kuliner (Kursus Kue, Masakan dan Minuman)",
	rating: 4.9,
	jumlahUlasan: 186,
	alamat: "Jl. Kapten Abdul Haq No.03, Rajabasa, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35141",
	kategori: "Kursus & pelatihan kuliner",
	url: "https://www.google.com/maps/place/RMP+Pelatihan+Bisnis+Kuliner+(Kursus+Kue,+Masakan+dan+Minuman)/data=!4m2!3m1!1s0x0:0x290845b36b1caebb",
	tanggalPenarikan: "2026-09-25",
} as const

/** Profil Instagram resmi. */
export const profilInstagram = {
	akun: "@rmp_pintar",
	nama: "RMP PINTAR",
	pengikut: "25,7 rb",
	postingan: 5514,
	url: "https://www.instagram.com/rmp_pintar/",
	bio: "Baking and Course | Rumah Mama Pintar (RMP) — Informasi jadwal kelas WA 08117970171",
	tanggalPenarikan: "2026-09-25",
} as const

/** Ringkasan yang hanya memakai angka yang benar-benar ada di sumber. */
export function ringkasanBukti() {
	const penerbit = new Set(buktiPublik.map((b) => b.penerbit))
	const tahun = buktiPublik.map((b) => Number(b.tanggal.slice(0, 4)))
	return {
		jumlahLiputan: buktiPublik.length,
		jumlahPenerbit: penerbit.size,
		jumlahUlasan: ulasanMaps.length,
		tahunTerawal: Math.min(...tahun),
		tahunTerbaru: Math.max(...tahun),
	}
}

/**
 * Ketidakcocokan yang ditemukan saat riset dan WAJIB diketahui pemilik.
 * Ditampilkan apa adanya di halaman profil agar tidak jadi masalah kemudian.
 */
export const catatanRiset = {
	alamatTerkonfirmasi: {
		catatan:
			"Google Maps dan kontak resmi terbaru sepakat pada 'Jl. Kapten Abdul Haq No.03, Rajabasa'. Artikel Travel2Lampung (2020) menulis 'Jl. Soekarno-Hatta, Labuhan Ratu, Kedaton' dan artikel SMAN 13 (2025) menulis 'Jl. Komarudin, Rajabasa' — kemungkinan RMP pernah berpindah lokasi. Alamat yang dipakai situs mengikuti Google Maps.",
	},
	telepon: {
		catatan:
			"Bio Instagram resmi mencantumkan WA 08117970171, konsisten dengan kontak di halaman Facebook. Artikel 2020 mencantumkan 082177368100 yang sudah tidak dipakai.",
	},
	fotoKegiatan: {
		catatan:
			"Foto kegiatan asli milik RMP belum tersedia sebagai berkas resmi dari pemilik. Foto pada ulasan Google dan Instagram memiliki hak cipta pengunggahnya sehingga tidak disalin ke situs ini.",
	},
	sertifikat: {
		catatan:
			"Ulasan menyebut instruktur dipanggil 'Bunda Aini'. Nama ini belum dikonfirmasi sebagai penandatangan sertifikat resmi.",
	},
} as const
