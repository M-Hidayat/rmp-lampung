/**
 * Token warna untuk dokumen cetak (React-PDF).
 *
 * KENAPA BERKAS INI ADA
 * Dokumen PDF tidak bisa memakai Tailwind/CSS variable seperti antarmuka web,
 * jadi sebelumnya setiap berkas menulis heksadesimal langsung. Akibatnya ada
 * nilai yang hanya muncul di satu berkas (mis. #F5F3EF, #44403C) sehingga sulit
 * diaudit. Berkas ini menjadi satu-satunya tempat nilai warna dokumen
 * didefinisikan, sejajar dengan peran token di DESIGN.md.
 *
 * HUBUNGAN DENGAN DESIGN.md
 * Dokumen cetak memakai palet ivory/gold tersendiri — ini disengaja, karena
 * keduanya adalah artefak seremonial (sertifikat & invoice), bukan permukaan
 * aplikasi. Yang diambil dari DESIGN.md adalah ATURANNYA, bukan warnanya:
 *   1. setiap peran punya tepat satu token;
 *   2. warna boleh jadi teks hanya bila lulus WCAG AA (>= 4.5:1);
 *   3. token dekoratif dilarang menjadi teks.
 *
 * Rasio kontras diukur terhadap latar yang benar-benar dipakai:
 *   ink       #1C1917 di atas paper/ivory  = 17.49:1  AAA
 *   inkSoft   #44403C di atas paper        = 10.27:1  AAA
 *   brown     #854D0E di atas paper        =  6.85:1  AA
 *   gray      #57534E di atas paper        =  7.63:1  AAA
 *   grayLight #6B6259 di atas paper        =  5.97:1  AA
 *   grayMid   #78716C di atas paper        =  4.80:1  AA (batas bawah, teks kecil non-kritis)
 *   gold      #D49A28 di atas paper        =  2.48:1  GAGAL -> DEKORATIF SAJA
 *
 * CATATAN PERBAIKAN
 * Sebelumnya catatan kaki invoice dan sertifikat memakai #A8A29E (2.52:1) yang
 * GAGAL WCAG AA untuk teks. Sekarang memakai `grayLight` (5.97:1).
 */
export const warnaCetak = {
	// --- Teks ---
	/** Judul utama & isi. 17.49:1 di atas paper. */
	ink: "#1C1917",
	/** Teks pendukung 8.5pt+. 10.27:1 di atas paper. */
	inkSoft: "#44403C",
	/**
	 * Identitas lembaga: nama institusi, judul blok, angka penting.
	 * 6.85:1 di atas paper.
	 */
	brown: "#854D0E",
	/** Teks kecil dan label. 7.63:1 di atas paper. */
	gray: "#57534E",
	/** Catatan kaki kecil. 5.97:1 di atas paper (menggantikan #A8A29E yang gagal). */
	grayLight: "#6B6259",
	/** Label invoice pada permukaan ivory. 4.80:1 di atas paper. */
	grayMid: "#78716C",

	// --- Permukaan ---
	/** Latar dokumen utama. */
	paper: "#FFFFFF",
	/** Latar halaman sertifikat. */
	ivory: "#FAF8F5",
	/** Permukaan hangat untuk blok dan kotak (mis. kotak kelas, segel). */
	ivoryWarm: "#FDF8ED",

	// --- Dekoratif (DILARANG menjadi teks) ---
	/**
	 * Aksen emas: bingkai, garis, simbol bintang. Hanya 2.48:1 di atas paper,
	 * jadi tidak boleh dipakai untuk teks apa pun.
	 */
	gold: "#D49A28",
	/** Garis emas lembut (border bawah kepala sertifikat). Dekoratif. */
	goldSoft: "#F3DC9B",
	/** Garis pemisah tipis. Dekoratif. */
	ivoryLine: "#EFECE6",
	/** Garis kotak di dalam permukaan ivoryWarm. Dekoratif. */
	ivoryBorder: "#E8DFC8",
	/** Garis pemisah pada latar ivory. Dekoratif. */
	ivoryRule: "#F5F3EF",
} as const

export type WarnaCetak = keyof typeof warnaCetak
