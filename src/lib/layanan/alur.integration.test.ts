/**
 * Uji integrasi alur inti terhadap basis data PostgreSQL terisolasi.
 *
 * Uji ini hanya berjalan bila variabel `TEST_DATABASE_URL` tersedia, sehingga
 * `npm test` tetap cepat dan bebas basis data. Jalankan dengan:
 *
 *   docker compose up -d db-uji
 *   TEST_DATABASE_URL=postgresql://rmp:rmp_dev_password@localhost:5433/rmp_lampung_uji \
 *     npx prisma migrate deploy
 *   npm run test:integrasi
 */
import { PrismaClient } from "@prisma/client"
import { afterAll, beforeEach, describe, expect, it } from "vitest"

import { KesalahanDomain } from "@/lib/kesalahan"
import { buatSesiAbsensi, catatKehadiran } from "@/lib/layanan/absensi"
import { buatKelas } from "@/lib/layanan/kelas"
import { daftarKelas } from "@/lib/layanan/pendaftaran"
import type { KlienDb } from "@/lib/prisma"
import type { SesiPengguna } from "@/lib/rbac"

const urlUji = process.env.TEST_DATABASE_URL
const adaDb = Boolean(urlUji)

const prisma = adaDb
	? new PrismaClient({ datasources: { db: { url: urlUji } } })
	: (null as unknown as PrismaClient)

const db = prisma as unknown as KlienDb

function sesiDari(pengguna: {
	id: string
	nama: string
	email: string
	peran: SesiPengguna["peran"]
}): SesiPengguna {
	return pengguna
}

async function bersihkan() {
	await prisma.certificate.deleteMany({
		where: {
			attendance: {
				enrollment: { user: { email: { endsWith: "@contoh.test" } } },
			},
		},
	})
	await prisma.attendance.deleteMany({
		where: {
			enrollment: { user: { email: { endsWith: "@contoh.test" } } },
		},
	})
	await prisma.attendanceSession.deleteMany({
		where: { kelas: { slug: { startsWith: "kelas-uji" } } },
	})
	await prisma.invoice.deleteMany({
		where: {
			payment: {
				enrollment: { user: { email: { endsWith: "@contoh.test" } } },
			},
		},
	})
	await prisma.payment.deleteMany({
		where: {
			enrollment: { user: { email: { endsWith: "@contoh.test" } } },
		},
	})
	await prisma.enrollment.deleteMany({
		where: { user: { email: { endsWith: "@contoh.test" } } },
	})
	await prisma.courseClass.deleteMany({
		where: { slug: { startsWith: "kelas-uji" } },
	})
	await prisma.user.deleteMany({
		where: { email: { endsWith: "@contoh.test" } },
	})
}

async function buatPengguna(
	email: string,
	peran: SesiPengguna["peran"],
	nama = "Pengguna Uji",
) {
	const pengguna = await prisma.user.create({
		data: {
			nama,
			email,
			passwordHash: "hash-uji-tidak-dipakai",
			peran,
			aktif: true,
		},
		select: { id: true, nama: true, email: true, peran: true },
	})
	return sesiDari(pengguna as never)
}

async function buatKelasUji(admin: SesiPengguna, kuota: number, slug: string) {
	return buatKelas(
		admin,
		{
			judul: "CONTOH - Kelas Uji Integrasi",
			slug,
			deskripsi:
				"Kelas contoh untuk pengujian integrasi alur pendaftaran dan absensi.",
			harga: 350000,
			kuota,
			jadwalMulai: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			lokasi: "CONTOH - Bandar Lampung",
			aktif: true,
		},
		{ db },
	)
}

describe.skipIf(!adaDb)("alur inti (integrasi)", () => {
	beforeEach(async () => {
		await bersihkan()
	})

	afterAll(async () => {
		if (adaDb) {
			await bersihkan()
			await prisma.$disconnect()
		}
	})

	it("menolak pendaftaran ganda pada kelas yang sama", async () => {
		const admin = await buatPengguna("admin-uji@contoh.test", "ADMIN")
		const peserta = await buatPengguna("peserta-uji@contoh.test", "USER")
		const kelas = await buatKelasUji(admin, 10, "kelas-uji-ganda")

		await daftarKelas(peserta, { slugKelas: "kelas-uji-ganda" }, { db })

		await expect(
			daftarKelas(peserta, { slugKelas: "kelas-uji-ganda" }, { db }),
		).rejects.toBeInstanceOf(KesalahanDomain)

		expect(await prisma.enrollment.count({ where: { classId: kelas.id } })).toBe(1)
	})

	it("menolak pendaftaran saat kuota kelas penuh", async () => {
		const admin = await buatPengguna("admin-kuota@contoh.test", "ADMIN")
		const pesertaA = await buatPengguna("peserta-a@contoh.test", "USER")
		const pesertaB = await buatPengguna("peserta-b@contoh.test", "USER")
		const kelas = await buatKelasUji(admin, 1, "kelas-uji-kuota")

		await daftarKelas(pesertaA, { slugKelas: "kelas-uji-kuota" }, { db })

		await expect(
			daftarKelas(pesertaB, { slugKelas: "kelas-uji-kuota" }, { db }),
		).rejects.toBeInstanceOf(KesalahanDomain)

		expect(await prisma.enrollment.count({ where: { classId: kelas.id } })).toBe(1)
	})

	it("menolak absensi bila pendaftaran belum lunas", async () => {
		const admin = await buatPengguna("admin-absen@contoh.test", "ADMIN")
		const peserta = await buatPengguna("peserta-absen@contoh.test", "USER")
		const kelas = await buatKelasUji(admin, 10, "kelas-uji-absen")
		await daftarKelas(peserta, { slugKelas: "kelas-uji-absen" }, { db })

		const sesiAbsensi = await buatSesiAbsensi(
			admin,
			{ classId: kelas.id, masaBerlakuMenit: 10 },
			{ db },
		)

		await expect(
			catatKehadiran(peserta, { token: sesiAbsensi.token }, { db }),
		).rejects.toBeInstanceOf(KesalahanDomain)

		expect(await prisma.attendance.count()).toBe(0)
	})

	it("menolak token absensi yang sudah kedaluwarsa dan absensi kedua", async () => {
		const admin = await buatPengguna("admin-token@contoh.test", "ADMIN")
		const peserta = await buatPengguna("peserta-token@contoh.test", "USER")
		const kelas = await buatKelasUji(admin, 10, "kelas-uji-token")
		const pendaftaran = await daftarKelas(
			peserta,
			{ slugKelas: "kelas-uji-token" },
			{ db },
		)

		// Pembayaran dianggap lunas (jalur webhook diuji terpisah).
		await prisma.payment.update({
			where: { id: pendaftaran.paymentId },
			data: { status: "PAID", dibayarPada: new Date() },
		})
		await prisma.enrollment.update({
			where: { id: pendaftaran.enrollmentId },
			data: { status: "PAID" },
		})

		const sesiKedaluwarsa = await buatSesiAbsensi(
			admin,
			{ classId: kelas.id, masaBerlakuMenit: 10 },
			{ db },
		)
		await prisma.attendanceSession.update({
			where: { id: sesiKedaluwarsa.sessionId },
			data: { kedaluwarsaPada: new Date(Date.now() - 60_000) },
		})

		await expect(
			catatKehadiran(peserta, { token: sesiKedaluwarsa.token }, { db }),
		).rejects.toBeInstanceOf(KesalahanDomain)
		expect(await prisma.attendance.count()).toBe(0)

		// Sesi baru yang masih berlaku: absensi pertama berhasil, kedua ditolak.
		const sesiBerlaku = await buatSesiAbsensi(
			admin,
			{ classId: kelas.id, masaBerlakuMenit: 10 },
			{ db },
		)

		await catatKehadiran(peserta, { token: sesiBerlaku.token }, { db })
		expect(await prisma.attendance.count()).toBe(1)

		await expect(
			catatKehadiran(peserta, { token: sesiBerlaku.token }, { db }),
		).rejects.toBeInstanceOf(KesalahanDomain)
		expect(await prisma.attendance.count()).toBe(1)
	})

	it("menyimpan hash token, bukan token mentah", async () => {
		const admin = await buatPengguna("admin-hash@contoh.test", "ADMIN")
		const kelas = await buatKelasUji(admin, 10, "kelas-uji-hash")

		const sesiAbsensi = await buatSesiAbsensi(
			admin,
			{ classId: kelas.id, masaBerlakuMenit: 10 },
			{ db },
		)

		const tersimpan = await prisma.attendanceSession.findUniqueOrThrow({
			where: { id: sesiAbsensi.sessionId },
			select: { tokenHash: true },
		})
		expect(tersimpan.tokenHash).not.toBe(sesiAbsensi.token)
		expect(tersimpan.tokenHash).toHaveLength(64)
	})
})
