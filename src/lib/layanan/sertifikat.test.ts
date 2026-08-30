import { describe, expect, it } from "vitest"

import { KesalahanDomain } from "@/lib/kesalahan"
import {
	ambilSertifikatUntukDokumen,
	terbitkanSertifikat,
	verifikasiSertifikatPublik,
} from "@/lib/layanan/sertifikat"
import type { KlienDb } from "@/lib/prisma"
import type { SesiPengguna } from "@/lib/rbac"

function sesi(peran: SesiPengguna["peran"], id = "pengguna-1"): SesiPengguna {
	return { id, nama: "Uji", email: `${id}@contoh.test`, peran }
}

async function tangkap(promise: Promise<unknown>): Promise<KesalahanDomain> {
	try {
		await promise
		throw new Error("seharusnya melempar KesalahanDomain")
	} catch (kesalahan) {
		expect(kesalahan).toBeInstanceOf(KesalahanDomain)
		return kesalahan as KesalahanDomain
	}
}

describe("penerbitan sertifikat", () => {
	it("menolak penerbitan bila pendaftaran belum lunas", async () => {
		const db = {
			attendance: {
				findUnique: async () => ({
					id: "kehadiran-1",
					certificate: null,
					enrollment: { id: "pendaftaran-1", status: "PENDING" },
				}),
			},
			certificate: {
				create: async () => {
					throw new Error("tidak boleh dipanggil")
				},
			},
		} as unknown as KlienDb

		const galat = await tangkap(
			terbitkanSertifikat(sesi("ADMIN"), "kehadiran-1", { db }),
		)
		expect(galat.kode).toBe("TRANSISI_TIDAK_SAH")
	})

	it("menerbitkan sertifikat untuk kehadiran yang lunas", async () => {
		let dataTersimpan: Record<string, unknown> = {}
		const db = {
			attendance: {
				findUnique: async () => ({
					id: "kehadiran-1",
					certificate: null,
					enrollment: { id: "pendaftaran-1", status: "PAID" },
				}),
			},
			certificate: {
				create: async (args: { data: Record<string, unknown> }) => {
					dataTersimpan = args.data
					return { id: "sertifikat-1", nomor: args.data.nomor }
				},
			},
		} as unknown as KlienDb

		const hasil = await terbitkanSertifikat(sesi("ADMIN"), "kehadiran-1", {
			db,
			sekarang: () => new Date("2026-08-18T10:00:00.000Z"),
			nomorSertifikat: () => "SRT/RMP/2026/ABC123",
		})

		expect(hasil.nomor).toBe("SRT/RMP/2026/ABC123")
		expect(dataTersimpan.attendanceId).toBe("kehadiran-1")
	})

	it("idempoten: mengembalikan sertifikat yang sudah ada", async () => {
		const db = {
			attendance: {
				findUnique: async () => ({
					id: "kehadiran-1",
					certificate: { id: "sertifikat-1", nomor: "SRT/RMP/2026/ABC123" },
					enrollment: { id: "pendaftaran-1", status: "PAID" },
				}),
			},
			certificate: {
				create: async () => {
					throw new Error("tidak boleh membuat sertifikat kedua")
				},
			},
		} as unknown as KlienDb

		await expect(
			terbitkanSertifikat(sesi("PEMILIK"), "kehadiran-1", { db }),
		).resolves.toEqual({ id: "sertifikat-1", nomor: "SRT/RMP/2026/ABC123" })
	})

	it("peserta tidak boleh menerbitkan sertifikat", async () => {
		const db = {
			attendance: {
				findUnique: async () => {
					throw new Error("tidak boleh dipanggil")
				},
			},
		} as unknown as KlienDb

		const galat = await tangkap(
			terbitkanSertifikat(sesi("USER"), "kehadiran-1", { db }),
		)
		expect(galat.kode).toBe("TIDAK_BERWENANG")
	})
})

describe("akses dokumen sertifikat", () => {
	function dbSertifikat(opsi: {
		userId: string
		revokedAt?: Date | null
	}): KlienDb {
		return {
			certificate: {
				findUnique: async () => ({
					id: "sertifikat-1",
					nomor: "SRT/RMP/2026/ABC123",
					diterbitkanPada: new Date("2026-08-18T10:00:00.000Z"),
					revokedAt: opsi.revokedAt ?? null,
					attendance: {
						waktuScan: new Date("2026-08-17T02:00:00.000Z"),
						enrollment: {
							userId: opsi.userId,
							user: { nama: "Peserta Contoh" },
							kelas: {
								judul: "CONTOH - Pelatihan Usaha Mie Ayam",
								lokasi: "Bandar Lampung",
								jadwalMulai: new Date("2026-08-17T02:00:00.000Z"),
							},
						},
					},
				}),
			},
		} as unknown as KlienDb
	}

	it("peserta lain tidak dapat membuka sertifikat bukan miliknya", async () => {
		const galat = await tangkap(
			ambilSertifikatUntukDokumen(sesi("USER", "peserta-2"), "sertifikat-1", {
				db: dbSertifikat({ userId: "peserta-1" }),
			}),
		)
		expect(galat.kode).toBe("TIDAK_BERWENANG")
	})

	it("pemilik dokumen dapat membuka sertifikatnya", async () => {
		const hasil = await ambilSertifikatUntukDokumen(
			sesi("USER", "peserta-1"),
			"sertifikat-1",
			{ db: dbSertifikat({ userId: "peserta-1" }) },
		)
		expect(hasil.nomor).toBe("SRT/RMP/2026/ABC123")
	})

	it("sertifikat yang dibatalkan tidak dapat diunduh", async () => {
		const galat = await tangkap(
			ambilSertifikatUntukDokumen(sesi("USER", "peserta-1"), "sertifikat-1", {
				db: dbSertifikat({
					userId: "peserta-1",
					revokedAt: new Date("2026-08-19T10:00:00.000Z"),
				}),
			}),
		)
		expect(galat.kode).toBe("TRANSISI_TIDAK_SAH")
	})
})

describe("verifikasi publik", () => {
	it("hanya mengembalikan data minimum dan status", async () => {
		const db = {
			certificate: {
				findUnique: async () => ({
					nomor: "SRT/RMP/2026/ABC123",
					diterbitkanPada: new Date("2026-08-18T10:00:00.000Z"),
					revokedAt: null,
					attendance: {
						enrollment: {
							user: { nama: "Peserta Contoh" },
							kelas: { judul: "CONTOH - Pelatihan Usaha Mie Ayam" },
						},
					},
				}),
			},
		} as unknown as KlienDb

		const hasil = await verifikasiSertifikatPublik("SRT/RMP/2026/ABC123", { db })
		expect(hasil).toEqual({
			ditemukan: true,
			nomor: "SRT/RMP/2026/ABC123",
			namaPeserta: "Peserta Contoh",
			judulKelas: "CONTOH - Pelatihan Usaha Mie Ayam",
			diterbitkanPada: new Date("2026-08-18T10:00:00.000Z"),
			status: "valid",
		})
		expect(Object.keys(hasil)).not.toContain("email")
	})

	it("menandai sertifikat yang dibatalkan", async () => {
		const db = {
			certificate: {
				findUnique: async () => ({
					nomor: "SRT/RMP/2026/ABC123",
					diterbitkanPada: new Date("2026-08-18T10:00:00.000Z"),
					revokedAt: new Date("2026-08-19T10:00:00.000Z"),
					attendance: {
						enrollment: {
							user: { nama: "Peserta Contoh" },
							kelas: { judul: "CONTOH - Pelatihan Usaha Mie Ayam" },
						},
					},
				}),
			},
		} as unknown as KlienDb

		const hasil = await verifikasiSertifikatPublik("SRT/RMP/2026/ABC123", { db })
		expect(hasil).toMatchObject({ ditemukan: true, status: "dibatalkan" })
	})

	it("mengembalikan tidak ditemukan untuk nomor asing", async () => {
		const db = {
			certificate: { findUnique: async () => null },
		} as unknown as KlienDb
		await expect(
			verifikasiSertifikatPublik("SRT/RMP/2026/TIDAKADA", { db }),
		).resolves.toEqual({ ditemukan: false })
	})
})
