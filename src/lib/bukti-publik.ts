/**
 * Bukti publik Rumah Mama Pintar yang dapat diperiksa siapa pun.
 *
 * ATURAN (sama seperti identitas-rmp.ts):
 * - Hanya liputan/kerja sama yang PUNYA URL publik yang boleh masuk berkas ini.
 * - Tidak ada testimoni karangan, tidak ada angka yang dibulatkan tanpa dasar.
 * - Kutipan ditulis apa adanya beserta nama dan jabatan aslinya.
 * - Bila sumber hilang/berubah, hapus entri — jangan ganti dengan klaim baru.
 *
 * Semua entri di bawah ini diverifikasi pada 24 September 2026 dengan membaca
 * langsung halaman sumbernya, bukan dari ringkasan mesin pencari.
 */

export type JenisBukti = "liputan-media" | "institusi-pendidikan" | "organisasi"

export type BuktiPublik = {
	id: string
	jenis: JenisBukti
	/** Nama pihak ketiga yang memuat. */
	penerbit: string
	judul: string
	url: string
	/** Tanggal terbit/peristiwa dalam format ISO agar bisa diurutkan. */
	tanggal: string
	/** Ringkasan faktual, bukan promosi. */
	ringkas: string
	/** Kutipan langsung dari sumber, dengan penyebutan nama secara benar. */
	kutipan?: { teks: string; oleh: string }[]
	/** Angka faktual yang disebut sumber. */
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
			"Siswa kelas XII SMAN 13 Bandar Lampung mengikuti kunjungan edukatif ke Rumah Mama Pintar untuk belajar membuat kue, dari kue tradisional hingga kue modern, termasuk strategi pemasaran sederhana. Kegiatan ini bagian dari program sekolah double track.",
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
			"Ikatan Istri Partai Golkar (IIPG) Lampung Tengah menggelar pelatihan memasak bersama Rumah Mama Pintar di Pondok Cherry Glompong, Lampung Tengah, sebagai upaya pemberdayaan perempuan dan pembukaan peluang ekonomi keluarga.",
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
			"Ulasan mengenai ragam pelatihan usaha kuliner di Rumah Mama Pintar, mencakup kue, masakan, minuman, roti, jajanan pasar, hingga masakan catering. Disebutkan bahwa peserta datang dari berbagai kabupaten/kota di Lampung dan sebagian dari luar provinsi.",
		fakta: [
			"Materi yang disebut: kue, masakan, minuman, roti, jajanan pasar, pempek, batagor, bakso, mie ayam, soto, martabak, dan catering",
			"Tersedia kelas tatap muka dan kelas online",
			"Peserta disebut berasal dari berbagai kabupaten/kota di Lampung",
		],
	},
]

/** Ringkasan yang hanya memakai angka yang benar-benar ada di sumber. */
export function ringkasanBukti() {
	const penerbit = new Set(buktiPublik.map((b) => b.penerbit))
	const tahun = buktiPublik.map((b) => Number(b.tanggal.slice(0, 4)))
	return {
		jumlahLiputan: buktiPublik.length,
		jumlahPenerbit: penerbit.size,
		tahunTerawal: Math.min(...tahun),
		tahunTerbaru: Math.max(...tahun),
	}
}

/**
 * Ketidakcocokan yang ditemukan saat riset dan WAJIB diketahui pemilik.
 * Ditampilkan apa adanya di halaman profil agar tidak menyembunyikan masalah.
 */
export const catatanRiset = {
	alamat: {
		catatan:
			"Sumber publik menyebut alamat yang berbeda pada periode berbeda: artikel 2020 menulis 'Jalan Soekarno-Hatta, Labuhan Ratu, Kedaton', artikel SMAN 13 (2025) menulis 'Jl. Komarudin, Rajabasa', sedangkan data resmi terbaru menulis 'Jl. Kapten Abdul Haq No. 03, Rajabasa'. Kemungkinan lokasi pernah berpindah.",
		tindakan:
			"Konfirmasi alamat resmi yang berlaku sekarang sebelum dipakai di materi cetak atau peta.",
	},
	telepon: {
		catatan:
			"Artikel 2020 mencantumkan nomor 082177368100, sedangkan kontak resmi terbaru adalah +62 811-7970-171.",
		tindakan: "Pastikan nomor yang aktif untuk pendaftaran saat ini.",
	},
	fotoKegiatan: {
		catatan:
			"Foto kegiatan asli milik RMP belum tersedia sebagai berkas resmi dari pemilik. Foto yang dipublikasikan media pihak ketiga memiliki hak cipta penerbitnya sehingga tidak disalin ke situs ini.",
		tindakan:
			"Pemilik mengirim folder foto kegiatan (minimal 6–9 foto beresolusi tinggi) agar galeri dapat diisi dokumentasi asli.",
	},
} as const
