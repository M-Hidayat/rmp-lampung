import { prisma, type KlienDb } from "@/lib/prisma"
import { wajibKemampuan, type SesiPengguna } from "@/lib/rbac"
import { jumlahkanNominal, keAngka } from "@/lib/uang"
import { kesalahanValidasi } from "@/lib/kesalahan"
import { detailZod, skemaPeriodeLaporan } from "@/lib/validasi"
import { statusPendaftaranMemakaiKuota } from "@/lib/layanan/status"

export type DependensiLaporan = { db?: KlienDb }

export type StatistikOperasional = {
	totalKelasAktif: number
	totalPeserta: number
	pendaftaranMenunggu: number
	pendaftaranLunas: number
	totalKehadiran: number
	sertifikatAktif: number
}

/** Statistik ringkas untuk dashboard admin. */
export async function statistikOperasional(
	sesi: SesiPengguna | null,
	dependensi: DependensiLaporan = {},
): Promise<StatistikOperasional> {
	wajibKemampuan(sesi, "kelola_kelas")
	const db = dependensi.db ?? prisma

	const [
		totalKelasAktif,
		totalPeserta,
		pendaftaranMenunggu,
		pendaftaranLunas,
		totalKehadiran,
		sertifikatAktif,
	] = await Promise.all([
		db.courseClass.count({ where: { aktif: true } }),
		db.user.count({ where: { peran: "USER" } }),
		db.enrollment.count({ where: { status: "PENDING" } }),
		db.enrollment.count({ where: { status: "PAID" } }),
		db.attendance.count(),
		db.certificate.count({ where: { revokedAt: null } }),
	])

	return {
		totalKelasAktif,
		totalPeserta,
		pendaftaranMenunggu,
		pendaftaranLunas,
		totalKehadiran,
		sertifikatAktif,
	}
}

export type LaporanBisnis = {
	periode: { dari: Date; sampai: Date }
	totalPendapatan: string
	jumlahTransaksiBerhasil: number
	rataRataNilaiTransaksi: string
	kelas: {
		classId: string
		judul: string
		pesertaAktif: number
		pesertaLunas: number
		kehadiran: number
		pendapatan: string
	}[]
	kelasPopuler: { judul: string; pesertaLunas: number }[]
}

/**
 * Laporan bisnis pemilik.
 * Pendapatan dihitung hanya dari pembayaran PAID dalam periode.
 */
export async function laporanBisnis(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiLaporan = {},
): Promise<LaporanBisnis> {
	wajibKemampuan(sesi, "lihat_laporan_pemilik")
	const db = dependensi.db ?? prisma

	const hasil = skemaPeriodeLaporan.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Periode laporan tidak valid.",
			detailZod(hasil.error),
		)
	}
	const { dari, sampai } = hasil.data

	const pembayaran = await db.payment.findMany({
		where: {
			status: "PAID",
			dibayarPada: { gte: dari, lte: sampai },
		},
		select: {
			nominal: true,
			enrollment: {
				select: { classId: true, kelas: { select: { judul: true } } },
			},
		},
	})

	const totalPendapatan = jumlahkanNominal(
		pembayaran.map((p) => p.nominal.toString()),
	)
	const jumlahTransaksiBerhasil = pembayaran.length
	const rataRataNilaiTransaksi =
		jumlahTransaksiBerhasil === 0
			? "0.00"
			: (keAngka(totalPendapatan) / jumlahTransaksiBerhasil).toFixed(2)

	const pendapatanPerKelas = new Map<string, string>()
	for (const bayar of pembayaran) {
		const kunci = bayar.enrollment.classId
		pendapatanPerKelas.set(
			kunci,
			jumlahkanNominal([
				pendapatanPerKelas.get(kunci) ?? "0.00",
				bayar.nominal.toString(),
			]),
		)
	}

	const kelas = await db.courseClass.findMany({
		orderBy: { jadwalMulai: "desc" },
		select: {
			id: true,
			judul: true,
			_count: {
				select: {
					enrollments: {
						where: { status: { in: statusPendaftaranMemakaiKuota } },
					},
				},
			},
			enrollments: {
				select: { status: true, attendance: { select: { id: true } } },
			},
		},
	})

	const baris = kelas.map((item) => {
		const pesertaLunas = item.enrollments.filter(
			(e) => e.status === "PAID",
		).length
		const kehadiran = item.enrollments.filter((e) => e.attendance).length
		return {
			classId: item.id,
			judul: item.judul,
			pesertaAktif: item._count.enrollments,
			pesertaLunas,
			kehadiran,
			pendapatan: pendapatanPerKelas.get(item.id) ?? "0.00",
		}
	})

	const kelasPopuler = [...baris]
		.sort((a, b) => b.pesertaLunas - a.pesertaLunas)
		.slice(0, 5)
		.map((item) => ({ judul: item.judul, pesertaLunas: item.pesertaLunas }))

	return {
		periode: { dari, sampai },
		totalPendapatan,
		jumlahTransaksiBerhasil,
		rataRataNilaiTransaksi,
		kelas: baris,
		kelasPopuler,
	}
}

/** Transaksi berhasil dalam periode (untuk tabel laporan pemilik). */
export async function transaksiBerhasil(
	sesi: SesiPengguna | null,
	masukan: unknown,
	dependensi: DependensiLaporan = {},
) {
	wajibKemampuan(sesi, "lihat_laporan_pemilik")
	const db = dependensi.db ?? prisma

	const hasil = skemaPeriodeLaporan.safeParse(masukan)
	if (!hasil.success) {
		throw kesalahanValidasi(
			"Periode laporan tidak valid.",
			detailZod(hasil.error),
		)
	}

	return db.payment.findMany({
		where: {
			status: "PAID",
			dibayarPada: { gte: hasil.data.dari, lte: hasil.data.sampai },
		},
		orderBy: { dibayarPada: "desc" },
		take: 200,
		select: {
			id: true,
			pakasirRef: true,
			nominal: true,
			metode: true,
			dibayarPada: true,
			invoice: { select: { id: true, nomor: true } },
			enrollment: {
				select: {
					user: { select: { nama: true } },
					kelas: { select: { judul: true } },
				},
			},
		},
	})
}
