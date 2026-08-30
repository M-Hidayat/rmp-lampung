/**
 * Data awal sistem RMP Lampung.
 *
 * Semua data kelas diberi label CONTOH karena harga dan jadwal resmi RMP belum
 * terverifikasi dari sumber publik. Ganti data ini setelah pemilik memberikan
 * daftar kelas dan harga resmi.
 */
import { PrismaClient, Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const BIAYA_HASH = 12

function wajibEnv(kunci: string, bawaan?: string): string {
	const nilai = process.env[kunci] ?? bawaan
	if (!nilai) {
		throw new Error(
			`Variabel lingkungan ${kunci} belum diisi. Lihat berkas .env.example.`,
		)
	}
	return nilai
}

/** Tanggal relatif agar jadwal contoh selalu berada di masa depan. */
function hariDariSekarang(jumlahHari: number, jam = 9): Date {
	const tanggal = new Date()
	tanggal.setUTCDate(tanggal.getUTCDate() + jumlahHari)
	// 09:00 WIB = 02:00 UTC
	tanggal.setUTCHours(jam - 7, 0, 0, 0)
	return tanggal
}

async function buatAkun(
	email: string,
	nama: string,
	kataSandi: string,
	peran: "PEMILIK" | "ADMIN" | "USER",
	telepon?: string,
) {
	const passwordHash = await bcrypt.hash(kataSandi, BIAYA_HASH)
	return prisma.user.upsert({
		where: { email },
		update: { nama, peran, aktif: true, passwordHash, telepon },
		create: { email, nama, peran, aktif: true, passwordHash, telepon },
		select: { id: true, email: true, peran: true },
	})
}

const kelasContoh = [
	{
		judul: "CONTOH - Pelatihan Usaha Mie Ayam",
		slug: "contoh-pelatihan-usaha-mie-ayam",
		deskripsi:
			"Data contoh untuk pengembangan. Materi meliputi pembuatan mie, kuah, topping, penghitungan harga jual, dan strategi berjualan. Harga dan jadwal resmi menunggu konfirmasi pemilik.",
		harga: "350000",
		kuota: 15,
		jadwalMulai: hariDariSekarang(7),
		jadwalSelesai: hariDariSekarang(7, 15),
	},
	{
		judul: "CONTOH - Pelatihan Usaha Bakso",
		slug: "contoh-pelatihan-usaha-bakso",
		deskripsi:
			"Data contoh untuk pengembangan. Materi meliputi pengolahan daging, pembuatan bakso, kuah, dan perhitungan modal usaha.",
		harga: "400000",
		kuota: 12,
		jadwalMulai: hariDariSekarang(14),
		jadwalSelesai: hariDariSekarang(14, 15),
	},
	{
		judul: "CONTOH - Kelas Kue dan Roti Dasar",
		slug: "contoh-kelas-kue-dan-roti-dasar",
		deskripsi:
			"Data contoh untuk pengembangan. Materi meliputi dasar adonan, teknik pengembangan, pengemasan, dan penetapan harga jual.",
		harga: "450000",
		kuota: 10,
		jadwalMulai: hariDariSekarang(21),
		jadwalSelesai: hariDariSekarang(21, 15),
	},
	{
		judul: "CONTOH - Kelas Minuman Kekinian (arsip)",
		slug: "contoh-kelas-minuman-kekinian",
		deskripsi:
			"Data contoh untuk pengembangan. Kelas ini dinonaktifkan untuk menunjukkan bahwa kelas diarsipkan, bukan dihapus.",
		harga: "300000",
		kuota: 20,
		jadwalMulai: hariDariSekarang(-30),
		jadwalSelesai: hariDariSekarang(-30, 15),
		aktif: false,
	},
]

async function main() {
	const lokasiContoh =
		"CONTOH - Jl. Kapten Abdul Haq No. 03, Rajabasa, Bandar Lampung"

	const pemilik = await buatAkun(
		wajibEnv("SEED_OWNER_EMAIL", "pemilik@contoh.rmp-lampung.test"),
		"Pemilik RMP (data contoh)",
		wajibEnv("SEED_OWNER_PASSWORD", "PemilikContoh123!"),
		"PEMILIK",
	)

	const admin = await buatAkun(
		wajibEnv("SEED_ADMIN_EMAIL", "admin@contoh.rmp-lampung.test"),
		"Admin Operasional (data contoh)",
		wajibEnv("SEED_ADMIN_PASSWORD", "AdminContoh123!"),
		"ADMIN",
	)

	const peserta = await buatAkun(
		wajibEnv("SEED_USER_EMAIL", "peserta@contoh.rmp-lampung.test"),
		"Peserta Contoh",
		wajibEnv("SEED_USER_PASSWORD", "PesertaContoh123!"),
		"USER",
		"0800000000000",
	)

	for (const kelas of kelasContoh) {
		await prisma.courseClass.upsert({
			where: { slug: kelas.slug },
			update: {
				judul: kelas.judul,
				deskripsi: kelas.deskripsi,
				harga: new Prisma.Decimal(kelas.harga),
				kuota: kelas.kuota,
				jadwalMulai: kelas.jadwalMulai,
				jadwalSelesai: kelas.jadwalSelesai,
				lokasi: lokasiContoh,
				aktif: kelas.aktif ?? true,
			},
			create: {
				judul: kelas.judul,
				slug: kelas.slug,
				deskripsi: kelas.deskripsi,
				harga: new Prisma.Decimal(kelas.harga),
				kuota: kelas.kuota,
				jadwalMulai: kelas.jadwalMulai,
				jadwalSelesai: kelas.jadwalSelesai,
				lokasi: lokasiContoh,
				aktif: kelas.aktif ?? true,
			},
		})
	}

	// Daftarkan akun peserta contoh ke semua kelas aktif agar selalu siap untuk pengujian kehadiran
	const daftarKelas = await prisma.courseClass.findMany({ where: { aktif: true } })
	for (const k of daftarKelas) {
		await prisma.enrollment.upsert({
			where: {
				userId_classId: {
					userId: peserta.id,
					classId: k.id,
				},
			},
			update: { status: "PAID" },
			create: {
				userId: peserta.id,
				classId: k.id,
				status: "PAID",
			},
		})
	}

	console.log("Seed selesai.")
	console.info(`- Pemilik: ${pemilik.email}`)
	console.info(`- Admin  : ${admin.email}`)
	console.info(`- Peserta: ${peserta.email}`)
	console.info(
		`- Kelas contoh: ${kelasContoh.length} data (semua berlabel CONTOH)`,
	)
	console.info(
		"Ganti seluruh kata sandi contoh sebelum dipakai di lingkungan produksi.",
	)
}

main()
	.catch((kesalahan) => {
		console.error("[seed-gagal]", kesalahan)
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
