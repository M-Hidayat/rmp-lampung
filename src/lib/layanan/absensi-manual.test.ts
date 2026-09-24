import { describe, expect, it, vi } from "vitest"

import { catatKehadiranManual } from "@/lib/layanan/absensi"

const admin = { id: "admin-1", nama: "Admin", email: "a@b.c", peran: "ADMIN" as const }
const pengguna = { id: "user-1", nama: "Peserta", email: "p@b.c", peran: "USER" as const }

/** Fake DB minimal untuk menyalin bentuk pemanggilan service. */
function buatDb(opts: {
	enrollment?: unknown
	sesiAktif?: unknown
	create?: ReturnType<typeof vi.fn>
}) {
	const create = opts.create ?? vi.fn(async () => ({ id: "att-1", waktuScan: new Date("2026-01-01T00:00:00Z") }))
	const db = {
		$transaction: async (fn: (tx: unknown) => unknown) =>
			fn({
				enrollment: {
					findUnique: vi.fn(async () => opts.enrollment ?? null),
				},
				attendanceSession: {
					findFirst: vi.fn(async () => opts.sesiAktif ?? null),
				},
				attendance: { create },
			}),
	}
	return { db: db as never, create }
}

const enrollmentLunas = {
	id: "enr-1",
	status: "PAID",
	classId: "kelas-1",
	attendance: null,
	kelas: { judul: "Tata Boga" },
}

describe("catatKehadiranManual", () => {
	it("menolak pengguna tanpa kemampuan kelola_absensi", async () => {
		const { db } = buatDb({ enrollment: enrollmentLunas, sesiAktif: { id: "sesi-1" } })
		await expect(
			catatKehadiranManual(pengguna, { enrollmentId: "enr-1" }, { db }),
		).rejects.toMatchObject({ kode: "TIDAK_BERWENANG" })
	})

	it("mencatat kehadiran pada sesi aktif untuk pendaftaran lunas", async () => {
		const { db, create } = buatDb({ enrollment: enrollmentLunas, sesiAktif: { id: "sesi-1" } })
		const hasil = await catatKehadiranManual(admin, { enrollmentId: "enr-1" }, { db })

		expect(hasil.judulKelas).toBe("Tata Boga")
		expect(create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({ enrollmentId: "enr-1", sessionId: "sesi-1" }),
			}),
		)
	})

	it("menolak pendaftaran yang belum lunas", async () => {
		const { db } = buatDb({
			enrollment: { ...enrollmentLunas, status: "PENDING" },
			sesiAktif: { id: "sesi-1" },
		})
		await expect(
			catatKehadiranManual(admin, { enrollmentId: "enr-1" }, { db }),
		).rejects.toMatchObject({ kode: "TRANSISI_TIDAK_SAH" })
	})

	it("menolak peserta yang sudah tercatat hadir", async () => {
		const { db } = buatDb({
			enrollment: { ...enrollmentLunas, attendance: { id: "att-lama" } },
			sesiAktif: { id: "sesi-1" },
		})
		await expect(
			catatKehadiranManual(admin, { enrollmentId: "enr-1" }, { db }),
		).rejects.toMatchObject({ kode: "KONFLIK" })
	})

	it("menolak bila kelas belum punya sesi absensi aktif", async () => {
		const { db } = buatDb({ enrollment: enrollmentLunas, sesiAktif: null })
		await expect(
			catatKehadiranManual(admin, { enrollmentId: "enr-1" }, { db }),
		).rejects.toMatchObject({ kode: "TRANSISI_TIDAK_SAH" })
	})

	it("menolak enrollmentId kosong lewat validasi", async () => {
		const { db } = buatDb({ enrollment: enrollmentLunas, sesiAktif: { id: "sesi-1" } })
		await expect(
			catatKehadiranManual(admin, { enrollmentId: "" }, { db }),
		).rejects.toMatchObject({ kode: "VALIDASI" })
	})
})
