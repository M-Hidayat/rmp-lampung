import { z } from "zod"

/** Skema validasi batas server. Seluruh pesan memakai Bahasa Indonesia. */

export const skemaEmail = z
	.string({ message: "Email wajib diisi" })
	.trim()
	.min(1, "Email wajib diisi")
	.email("Format email tidak valid")
	.transform((nilai) => nilai.toLowerCase())

export const skemaKataSandi = z
	.string({ message: "Kata sandi wajib diisi" })
	.min(8, "Kata sandi minimal 8 karakter")
	.max(72, "Kata sandi maksimal 72 karakter")
	.regex(/[A-Za-z]/, "Kata sandi harus memuat minimal satu huruf")
	.regex(/\d/, "Kata sandi harus memuat minimal satu angka")

export const skemaNama = z
	.string({ message: "Nama wajib diisi" })
	.trim()
	.min(3, "Nama minimal 3 karakter")
	.max(100, "Nama maksimal 100 karakter")

export const skemaTelepon = z
	.string()
	.trim()
	.regex(/^[0-9+\-\s()]{8,20}$/, "Nomor telepon tidak valid")
	.optional()
	.or(z.literal("").transform(() => undefined))

/** Registrasi publik: peran tidak pernah diterima dari input. */
export const skemaRegistrasi = z.object({
	nama: skemaNama,
	email: skemaEmail,
	telepon: skemaTelepon,
	kataSandi: skemaKataSandi,
})
export type MasukanRegistrasi = z.infer<typeof skemaRegistrasi>

export const skemaMasuk = z.object({
	email: skemaEmail,
	kataSandi: z.string().min(1, "Kata sandi wajib diisi"),
})

export const skemaSlug = z
	.string({ message: "Slug wajib diisi" })
	.trim()
	.min(3, "Slug minimal 3 karakter")
	.max(80, "Slug maksimal 80 karakter")
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug hanya boleh huruf kecil, angka, dan tanda hubung",
	)

export const skemaKelas = z
	.object({
		judul: z.string().trim().min(3, "Judul kelas minimal 3 karakter").max(150),
		slug: skemaSlug,
		deskripsi: z
			.string()
			.trim()
			.min(20, "Deskripsi kelas minimal 20 karakter")
			.max(5000),
		harga: z
			.number({ message: "Harga wajib diisi" })
			.int("Harga harus bilangan bulat rupiah")
			.min(0, "Harga tidak boleh negatif")
			.max(100_000_000, "Harga melebihi batas wajar"),
		kuota: z
			.number({ message: "Kuota wajib diisi" })
			.int("Kuota harus bilangan bulat")
			.min(1, "Kuota minimal 1 peserta")
			.max(1000, "Kuota maksimal 1000 peserta"),
		jadwalMulai: z.coerce.date({ message: "Jadwal mulai tidak valid" }),
		jadwalSelesai: z.coerce
			.date({ message: "Jadwal selesai tidak valid" })
			.optional(),
		lokasi: z.string().trim().min(3, "Lokasi wajib diisi").max(200),
		gambarUrl: z
			.string()
			.trim()
			.url("URL gambar tidak valid")
			.optional()
			.or(z.literal("").transform(() => undefined)),
		aktif: z.boolean().default(true),
	})
	.refine(
		(nilai) =>
			!nilai.jadwalSelesai || nilai.jadwalSelesai >= nilai.jadwalMulai,
		{
			message: "Jadwal selesai tidak boleh lebih awal dari jadwal mulai",
			path: ["jadwalSelesai"],
		},
	)
export type MasukanKelas = z.infer<typeof skemaKelas>

export const skemaPendaftaranKelas = z.object({
	slugKelas: skemaSlug,
})

export const skemaBuatSesiAbsensi = z.object({
	classId: z.string().trim().min(1, "Kelas wajib dipilih"),
	masaBerlakuMenit: z
		.number()
		.int()
		.min(1, "Masa berlaku minimal 1 menit")
		.max(120, "Masa berlaku maksimal 120 menit")
		.default(10),
})

export const skemaScanAbsensi = z.object({
	token: z
		.string({ message: "Token absensi wajib diisi" })
		.trim()
		.min(20, "Token absensi tidak valid")
		.max(200, "Token absensi tidak valid"),
})

export const skemaWebhookPakasir = z.object({
	amount: z.union([z.number(), z.string()]),
	order_id: z.string().trim().min(1),
	project: z.string().trim().min(1),
	status: z.string().trim().min(1),
	payment_method: z.string().trim().optional(),
	completed_at: z.string().trim().optional(),
})
export type PayloadWebhookPakasir = z.infer<typeof skemaWebhookPakasir>

export const skemaBuatAdmin = z.object({
	nama: skemaNama,
	email: skemaEmail,
	kataSandi: skemaKataSandi,
})

export const skemaPeriodeLaporan = z
	.object({
		dari: z.coerce.date({ message: "Tanggal awal tidak valid" }),
		sampai: z.coerce.date({ message: "Tanggal akhir tidak valid" }),
	})
	.refine((nilai) => nilai.sampai >= nilai.dari, {
		message: "Tanggal akhir tidak boleh lebih awal dari tanggal awal",
		path: ["sampai"],
	})

export const skemaNomorSertifikat = z
	.string({ message: "Nomor sertifikat wajib diisi" })
	.trim()
	.min(5, "Nomor sertifikat tidak valid")
	.max(60, "Nomor sertifikat tidak valid")

/** Mengubah error Zod menjadi peta pesan per field. */
export function detailZod(error: z.ZodError): Record<string, string> {
	const hasil: Record<string, string> = {}
	for (const isu of error.issues) {
		const kunci = isu.path.join(".") || "formulir"
		if (!hasil[kunci]) hasil[kunci] = isu.message
	}
	return hasil
}
