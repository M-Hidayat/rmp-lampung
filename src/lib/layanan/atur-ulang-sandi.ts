import { hashKataSandi } from "@/lib/kata-sandi"
import { KesalahanDomain, kesalahanValidasi } from "@/lib/kesalahan"
import { prisma, type KlienDb } from "@/lib/prisma"
import { detailZod, skemaEmail, skemaKataSandi } from "@/lib/validasi"
import { z } from "zod"
import {
	MASA_BERLAKU_ATUR_ULANG_MS,
	buatTokenAturUlang,
	hashTokenAturUlang,
	urlAturUlangSandi,
} from "@/lib/layanan/token-atur-ulang"
import {
	emailSiap,
	kirimEmail,
	pesanAturUlangSandi,
	type DependensiEmail,
} from "@/lib/email"

/**
 * Atur ulang kata sandi ("lupa kata sandi").
 *
 * Dua prinsip keamanan yang dipegang:
 *
 * 1. **Tidak membocorkan keberadaan akun.** Permintaan untuk email yang tidak
 *    terdaftar menghasilkan jawaban yang sama persis dengan email yang ada.
 *    Tanpa ini, formulir lupa kata sandi menjadi alat enumerasi akun.
 * 2. **Sekali pakai dan berbatas waktu.** Token mentah hanya ada di tautan
 *    email; basis data menyimpan hash SHA-256. Setelah dipakai atau kedaluwarsa,
 *    token tidak berlaku lagi. Semua token lama pengguna tersebut dihapus saat
 *    token baru diterbitkan, sehingga tautan lama mati seketika.
 *
 * Bila SMTP belum dikonfigurasi, permintaan tetap dicatat sebagai token yang
 * sah tetapi email tidak terkirim — dan fungsi mengembalikan `terkirim: false`
 * agar lapisan UI bisa memberi tahu admin, bukan berpura-pura berhasil.
 */

export type DependensiAturUlang = {
	db?: KlienDb
	hash?: (kataSandi: string) => Promise<string>
	email?: DependensiEmail
	appUrl?: string
	sekarang?: Date
}

export type HasilMintaAturUlang = {
	/** Selalu `true` bagi pemanggil: keberadaan akun tidak pernah dibocorkan. */
	permintaanDiterima: true
	/** Status pengiriman sebenarnya, agar UI dapat memberi tahu bila email mati. */
	emailTerkirim: boolean
	/** Tautan hanya diisi pada mode pengembangan tanpa SMTP; tidak pernah ke produksi. */
	tautanUji?: string
}

/** Bentuk aman status token untuk halaman atur ulang. */
export type StatusTokenAturUlang =
	| { sah: true; nama: string }
	| { sah: false; alasan: "TIDAK_DITEMUKAN" | "KEDALUWARSA" | "SUDAH_DIPAKAI" }

const skemaAturUlang = z.object({
	token: z.string().trim().min(20, "Tautan atur ulang tidak valid"),
	kataSandi: skemaKataSandi,
	kataSandiUlang: z.string().min(1, "Kata sandi wajib diulang"),
})

export type MasukanAturUlang = z.infer<typeof skemaAturUlang>

function masaBerlakuMenit(): number {
	return Math.round(MASA_BERLAKU_ATUR_ULANG_MS / 60000)
}

/**
 * Terbitkan token atur ulang untuk sebuah email, lalu kirim tautannya.
 * Selalu mengembalikan `permintaanDiterima: true`.
 */
export async function mintaAturUlangSandi(
	email: string,
	dependensi: DependensiAturUlang = {},
): Promise<HasilMintaAturUlang> {
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? new Date()

	const emailHasil = skemaEmail.safeParse(email)
	if (!emailHasil.success) {
		// Format email tidak valid: tidak ada yang perlu dikerjakan, tetapi
		// jawabannya tetap sama agar tidak membocorkan perbedaan.
		return { permintaanDiterima: true, emailTerkirim: false }
	}

	const pengguna = await db.user.findUnique({
		where: { email: emailHasil.data },
		select: { id: true, nama: true, email: true, aktif: true },
	})

	// Akun tidak ada atau nonaktif: jangan buat token, jangan kirim apa pun,
	// tetapi jawaban tetap identik.
	if (!pengguna || !pengguna.aktif) {
		return { permintaanDiterima: true, emailTerkirim: false }
	}

	const token = buatTokenAturUlang()
	const kedaluwarsaPada = new Date(
		sekarang.getTime() + MASA_BERLAKU_ATUR_ULANG_MS,
	)

	// Terbitkan token baru dan matikan semua token lama pengguna ini sekaligus,
	// sehingga tautan yang pernah dikirim tidak bisa dipakai lagi.
	await db.$transaction(async (tx) => {
		await tx.tokenAturUlangSandi.deleteMany({ where: { userId: pengguna.id } })
		await tx.tokenAturUlangSandi.create({
			data: {
				userId: pengguna.id,
				tokenHash: hashTokenAturUlang(token),
				kedaluwarsaPada,
			},
			select: { id: true },
		})
	})

	const appUrl =
		dependensi.appUrl ??
		process.env.APP_URL ??
		"http://localhost:3001"
	const tautan = urlAturUlangSandi(appUrl, token)

	if (!emailSiap(dependensi.email?.env ?? process.env) && !dependensi.email?.transporter) {
		// Jalur pengembangan: tautan ditulis ke log server saja agar alur bisa
		// diuji, dan dikembalikan sebagai `tautanUji` untuk keperluan uji otomatis.
		console.warn(
			"[atur-ulang-sandi] SMTP belum dikonfigurasi. Tautan atur ulang untuk %s: %s",
			pengguna.email,
			tautan,
		)
		return { permintaanDiterima: true, emailTerkirim: false, tautanUji: tautan }
	}

	const isi = pesanAturUlangSandi({
		nama: pengguna.nama,
		tautan,
		masaBerlakuMenit: masaBerlakuMenit(),
	})

	const hasilKirim = await kirimEmail(
		{ kepada: pengguna.email, ...isi },
		dependensi.email ?? {},
	)

	return {
		permintaanDiterima: true,
		emailTerkirim: hasilKirim.terkirim,
	}
}

/** Periksa status token tanpa mengubah apa pun (untuk halaman atur ulang). */
export async function statusTokenAturUlang(
	token: string,
	dependensi: DependensiAturUlang = {},
): Promise<StatusTokenAturUlang> {
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? new Date()

	if (!token || token.length < 20) {
		return { sah: false, alasan: "TIDAK_DITEMUKAN" }
	}

	const catatan = await db.tokenAturUlangSandi.findUnique({
		where: { tokenHash: hashTokenAturUlang(token) },
		select: {
			kedaluwarsaPada: true,
			dipakaiPada: true,
			pengguna: { select: { nama: true, aktif: true } },
		},
	})

	if (!catatan) return { sah: false, alasan: "TIDAK_DITEMUKAN" }
	if (catatan.dipakaiPada) return { sah: false, alasan: "SUDAH_DIPAKAI" }
	if (catatan.kedaluwarsaPada.getTime() <= sekarang.getTime()) {
		return { sah: false, alasan: "KEDALUWARSA" }
	}
	if (!catatan.pengguna.aktif) return { sah: false, alasan: "TIDAK_DITEMUKAN" }

	return { sah: true, nama: catatan.pengguna.nama }
}

/** Pakai token: set kata sandi baru, tandai token terpakai, hapus token lain. */
export async function pakaiTokenAturUlang(
	masukan: unknown,
	dependensi: DependensiAturUlang = {},
): Promise<{ email: string }> {
	const db = dependensi.db ?? prisma
	const hash = dependensi.hash ?? hashKataSandi
	const sekarang = dependensi.sekarang ?? new Date()

	const hasil = skemaAturUlang.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Data atur ulang kata sandi belum lengkap atau tidak valid.",
			detailZod(hasil.error),
		)
	}

	const { token, kataSandi, kataSandiUlang } = hasil.data
	if (kataSandi !== kataSandiUlang) {
		throw new KesalahanDomain("VALIDASI", "Ulangi kata sandi dengan nilai yang sama.", {
			kataSandiUlang: "Kata sandi dan ulangannya tidak sama",
		})
	}

	const tokenHash = hashTokenAturUlang(token)

	// Seluruh pemeriksaan dan penulisan dalam satu transaksi supaya token tidak
	// bisa dipakai dua kali walaupun dua permintaan datang bersamaan.
	return db.$transaction(async (tx) => {
		const catatan = await tx.tokenAturUlangSandi.findUnique({
			where: { tokenHash },
			select: {
				id: true,
				userId: true,
				kedaluwarsaPada: true,
				dipakaiPada: true,
				pengguna: { select: { email: true, aktif: true } },
			},
		})

		if (!catatan) {
			throw new KesalahanDomain(
				"TIDAK_DITEMUKAN",
				"Tautan atur ulang tidak valid atau sudah tidak berlaku.",
			)
		}
		if (catatan.dipakaiPada) {
			throw new KesalahanDomain(
				"TRANSISI_TIDAK_SAH",
				"Tautan atur ulang ini sudah pernah dipakai. Minta tautan baru.",
			)
		}
		if (catatan.kedaluwarsaPada.getTime() <= sekarang.getTime()) {
			throw new KesalahanDomain(
				"TRANSISI_TIDAK_SAH",
				"Tautan atur ulang sudah kedaluwarsa. Minta tautan baru.",
			)
		}
		if (!catatan.pengguna.aktif) {
			throw new KesalahanDomain(
				"TIDAK_BERWENANG",
				"Akun ini sedang tidak aktif. Hubungi admin Rumah Mama Pintar.",
			)
		}

		const passwordHash = await hash(kataSandi)

		await tx.user.update({
			where: { id: catatan.userId },
			data: { passwordHash },
			select: { id: true },
		})

		// Tandai terpakai, lalu bersihkan seluruh token pengguna ini.
		await tx.tokenAturUlangSandi.update({
			where: { id: catatan.id },
			data: { dipakaiPada: sekarang },
			select: { id: true },
		})
		await tx.tokenAturUlangSandi.deleteMany({
			where: { userId: catatan.userId },
		})

		return { email: catatan.pengguna.email }
	})
}

/**
 * Menerbitkan tautan atur ulang atas permintaan admin.
 *
 * Dipakai karena pengiriman email belum tersedia: admin membuat tautan di
 * dasbor lalu mengirimkannya sendiri ke peserta (mis. lewat WhatsApp). Token
 * yang dihasilkan identik dengan alur email — sekali pakai, berbatas waktu,
 * dan hanya hash-nya yang tersimpan.
 *
 * Tautan mentah hanya dikembalikan sekali di sini; tidak pernah dicatat ke log.
 */
export async function terbitkanTokenAturUlangOlehAdmin(
	idPengguna: string,
	dependensi: DependensiAturUlang = {},
): Promise<{ tautan: string; nama: string; email: string; kedaluwarsaPada: Date }> {
	const db = dependensi.db ?? prisma
	const sekarang = dependensi.sekarang ?? new Date()

	const pengguna = await db.user.findUnique({
		where: { id: idPengguna },
		select: { id: true, nama: true, email: true, aktif: true },
	})
	if (!pengguna) {
		throw new KesalahanDomain("TIDAK_DITEMUKAN", "Peserta tidak ditemukan.")
	}
	if (!pengguna.aktif) {
		throw new KesalahanDomain(
			"TRANSISI_TIDAK_SAH",
			"Akun peserta ini sedang tidak aktif. Aktifkan dulu sebelum menerbitkan tautan.",
		)
	}

	const token = buatTokenAturUlang()
	const kedaluwarsaPada = new Date(sekarang.getTime() + MASA_BERLAKU_ATUR_ULANG_MS)

	// Ganti seluruh token lama peserta ini agar tautan yang pernah dibuat mati.
	await db.$transaction(async (tx) => {
		await tx.tokenAturUlangSandi.deleteMany({ where: { userId: pengguna.id } })
		await tx.tokenAturUlangSandi.create({
			data: {
				userId: pengguna.id,
				tokenHash: hashTokenAturUlang(token),
				kedaluwarsaPada,
			},
			select: { id: true },
		})
	})

	const appUrl = dependensi.appUrl ?? process.env.APP_URL ?? "http://localhost:3001"

	return {
		tautan: urlAturUlangSandi(appUrl, token),
		nama: pengguna.nama,
		email: pengguna.email,
		kedaluwarsaPada,
	}
}
