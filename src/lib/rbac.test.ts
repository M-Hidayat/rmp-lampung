import { describe, expect, it } from "vitest"

import { KesalahanDomain } from "@/lib/kesalahan"
import { adalahPeranOperasional, berandaDashboard, memilikiKemampuan, peranDiizinkanUntukPath, wajibKemampuan, wajibPemilikDokumenAtauOperasional, wajibSesi, type SesiPengguna } from "@/lib/rbac"

function sesi(peran: SesiPengguna["peran"], id = "pengguna-1"): SesiPengguna { return { id, nama: "Uji", email: `${id}@contoh.test`, peran } }

describe("pembatasan peran", () => {
	it("admin memiliki kemampuan operasional dan laporan bisnis", () => {
		expect(memilikiKemampuan("ADMIN", "kelola_kelas")).toBe(true)
		expect(memilikiKemampuan("ADMIN", "lihat_laporan_bisnis")).toBe(true)
		expect(adalahPeranOperasional("ADMIN")).toBe(true)
	})
	it("peserta tidak memiliki kemampuan operasional", () => {
		expect(memilikiKemampuan("USER", "kelola_kelas")).toBe(false)
		expect(adalahPeranOperasional("USER")).toBe(false)
	})
	it("menolak sesi kosong", () => {
		expect(() => wajibSesi(null)).toThrowError(KesalahanDomain)
	})
	it("menolak kemampuan yang tidak dimiliki", () => {
		expect(() => wajibKemampuan(sesi("USER"), "kelola_kelas")).toThrowError(KesalahanDomain)
	})
})

describe("isolasi dokumen", () => {
	it("peserta hanya membuka miliknya dan admin boleh membuka dokumen operasional", () => {
		expect(wajibPemilikDokumenAtauOperasional(sesi("USER", "u1"), "u1").id).toBe("u1")
		expect(() => wajibPemilikDokumenAtauOperasional(sesi("USER", "u1"), "u2")).toThrowError(KesalahanDomain)
		expect(wajibPemilikDokumenAtauOperasional(sesi("ADMIN", "a1"), "u2").peran).toBe("ADMIN")
	})
})

describe("pemetaan path dashboard", () => {
	it("membatasi admin dan mengizinkan area user sesuai role", () => {
		expect(peranDiizinkanUntukPath("/admin/kelas")).toEqual(["ADMIN"])
		expect(peranDiizinkanUntukPath("/user")).toEqual(["USER", "ADMIN"])
		expect(peranDiizinkanUntukPath("/kelas")).toBeNull()
	})
	it("mengarahkan beranda sesuai role", () => {
		expect(berandaDashboard("ADMIN")).toBe("/admin")
		expect(berandaDashboard("USER")).toBe("/user")
	})
})
