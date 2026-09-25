/**
 * Dokumentasi kegiatan Rumah Mama Pintar.
 *
 * Foto berasal dari arsip resmi RMP yang diberikan pemilik
 * (berkas fisik ada di `public/images/kegiatan`). Karena itu ini dokumentasi
 * asli, bukan gambar stok.
 *
 * ATURAN memilih foto:
 * - Hanya dipakai foto beresolusi >= 1000 px agar tajam di layar besar.
 * - Dimensi di bawah ini SUDAH DIVERIFIKASI dari berkas aslinya (bukan dugaan),
 *   supaya Next.js dapat menyiapkan rasio tanpa layout shift.
 * - Alt text menjelaskan isi secara faktual; tidak mengklaim hal yang tidak
 *   terlihat pada foto.
 * - Bila pemilik menambah/mengganti foto: perbarui daftar ini agar tidak ada
 *   berkas yang menganggur di folder tanpa dipakai.
 *
 * Catatan: sebagian berkas di folder berukuran 640x1136 (potret, rasio layar
 * ponsel). Berkas itu sengaja TIDAK dipakai pada kartu galeri karena rasionya
 * memotong isi terlalu banyak, tetapi tetap tersimpan untuk keperluan lain.
 */

export type FotoKegiatan = {
	src: string
	alt: string
	keterangan?: string
	lebar: number
	tinggi: number
}

/** Galeri "Suasana kegiatan". Dimensi diverifikasi dari berkas asli. */
export const galeriKegiatan: FotoKegiatan[] = [
	{
		src: "/images/kegiatan/imgi_19_786960264_18630289954009359_4969413530873626722_n.jpg",
		alt: "Kegiatan pelatihan kuliner Rumah Mama Pintar bersama peserta",
		keterangan: "Kegiatan pelatihan bersama peserta",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_26_778034690_18626659129009359_6112345889696631394_n.jpg",
		alt: "Dokumentasi sesi belajar di Rumah Mama Pintar",
		keterangan: "Dokumentasi sesi belajar",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_28_775591721_18626231761009359_7700845210388826531_n.jpg",
		alt: "Suasana kelas pelatihan kuliner RMP",
		keterangan: "Suasana kelas pelatihan",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_30_774105719_18625744828009359_7548665150154321811_n.jpg",
		alt: "Peserta mengikuti praktik pada pelatihan Rumah Mama Pintar",
		keterangan: "Praktik peserta pelatihan",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_39_760172436_18621057403009359_5611899534578280071_n.jpg",
		alt: "Dokumentasi kegiatan Rumah Mama Pintar",
		keterangan: "Dokumentasi kegiatan RMP",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_41_755694133_18619553317009359_7107817579426920349_n.jpg",
		alt: "Kegiatan belajar peserta di Rumah Mama Pintar",
		keterangan: "Kegiatan belajar peserta",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_43_755874622_18619217239009359_8290908848388070400_n.jpg",
		alt: "Suasana pelatihan kuliner di Rumah Mama Pintar",
		keterangan: "Suasana pelatihan kuliner",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_46_752916699_18617355886009359_5693337007790637423_n.jpg",
		alt: "Dokumentasi kelas pelatihan Rumah Mama Pintar",
		keterangan: "Dokumentasi kelas pelatihan",
		lebar: 1440,
		tinggi: 1440,
	},
	{
		src: "/images/kegiatan/imgi_48_748978367_18617037214009359_4387520726726164074_n.jpg",
		alt: "Peserta pelatihan kuliner Rumah Mama Pintar",
		keterangan: "Peserta pelatihan kuliner",
		lebar: 1440,
		tinggi: 1426,
	},
]
