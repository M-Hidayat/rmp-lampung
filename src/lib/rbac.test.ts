import { describe, expect, it } from "vitest"

import { KesalahanDomain } from "@/lib/kesalahan"
import {
	adalahPeranOperasional,
	berandaDashboard,
	memilikiKemampuan,
	peranDiizinkanUntukPath,
	wajibKemampuan,
	wajibPemilikDokumenAtauOperasional,
	wajibSesi,
	type SesiPengguna,
} from "@/lib/rbac"

function sesi(peran: SesiPengguna["peran"], id = "pengguna-1"): SesiPengguna {
	return { id, nama: "Uji", email: `${id}@contoh.test`, peran }
}

describe("pembatasan peran", () => {
	it("admin tidak boleh mengelola admin atau membuka laporan pemilik", () => {
		expect(memilikiKemampuan("ADMIN", "kelola_kelas")).toBe(true)
		expect(memilikiKemampuan("ADMIN", "kelola_admin")).toBe(false)
		expect(memilikiKemampuan("ADMIN", "lihat_laporan_pemilik")).toBe(false)
		expect(memilikiKemampuan("ADMIN", "audit_sertifikat")).toBe(false)
	})

	it("pemilik mewarisi seluruh kemampuan admin", () => {
		for (const kemampuan of [
			"kelola_kelas",
			"kelola_peserta",
			"kelola_pembayaran",
			"kelola_absensi",
			"kelola_sertifikat",
			"lihat_dokumen_operasional",
			"lihat_laporan_pemilik",
			"kelola_admin",
		] as const) {
			expect(memilikiKemampuan("PEMILIK", kemampuan)).toBe(true)
		}
	})

	it("peserta tidak memiliki kemampuan operasional apa pun", () => {
		expect(memilikiKemampuan("USER", "kelola_kelas")).toBe(false)
		expect(memilikiKemampuan("USER", "lihat_dokumen_operasional")).toBe(false)
		expect(adalahPeranOperasional("USER")).toBe(false)
		expect(adalahPeranOperasional("ADMIN")).toBe(true)
	})

	it("menolak tanpa sesi dengan kode TIDAK_TERAUTENTIKASI", () => {
		try {
			wajibSesi(null)
			expect.unreachable("seharusnya melempar kesalahan")
		} catch (kesalahan) {
			expect(kesalahan).toBeInstanceOf(KesalahanDomain)
			expect((kesalahan as KesalahanDomain).kode).toBe("TIDAK_TERAUTENTIKASI")
		}
	})

	it("menolak kemampuan yang tidak dimiliki dengan kode TIDAK_BERWENANG", () => {
		try {
			wajibKemampuan(sesi("ADMIN"), "kelola_admin")
			expect.unreachable("seharusnya melempar kesalahan")
		} catch (kesalahan) {
			expect((kesalahan as KesalahanDomain).kode).toBe("TIDAK_BERWENANG")
		}
	})
})

describe("isolasi dokumen", () => {
	it("peserta hanya boleh membuka dokumen miliknya", () => {
		expect(
			wajibPemilikDokumenAtauOperasional(sesi("USER", "peserta-1"), "peserta-1")
				.id,
		).toBe("peserta-1")

		try {
			wajibPemilikDokumenAtauOperasional(sesi("USER", "peserta-1"), "peserta-2")
			expect.unreachable("seharusnya melempar kesalahan")
		} catch (kesalahan) {
			expect((kesalahan as KesalahanDomain).kode).toBe("TIDAK_BERWENANG")
		}
	})

	it("peran operasional boleh membuka dokumen peserta lain", () => {
		expect(
			wajibPemilikDokumenAtauOperasional(sesi("ADMIN", "admin-1"), "peserta-2")
				.peran,
		).toBe("ADMIN")
	})
})

describe("pemetaan path dashboard", () => {
	it("membatasi area pemilik hanya untuk PEMILIK", () => {
		expect(peranDiizinkanUntukPath("/pemilik")).toEqual(["PEMILIK"])
		expect(peranDiizinkanUntukPath("/pemilik/admin")).toEqual(["PEMILIK"])
	})

	it("mengizinkan pemilik masuk ke area admin", () => {
		expect(peranDiizinkanUntukPath("/admin/kelas")).toEqual([
			"ADMIN",
			"PEMILIK",
		])
	})

	it("mengembalikan null untuk path publik", () => {
		expect(peranDiizinkanUntukPath("/kelas")).toBeNull()
	})

	it("mengarahkan beranda sesuai peran", () => {
		expect(berandaDashboard("PEMILIK")).toBe("/pemilik")
		expect(berandaDashboard("ADMIN")).toBe("/admin")
		expect(berandaDashboard("USER")).toBe("/user")
	})
})
