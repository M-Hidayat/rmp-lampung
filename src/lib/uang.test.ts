import { describe, expect, it } from "vitest"

import {
	jumlahkanNominal,
	keAngka,
	keNominalString,
	keRupiahBulat,
	nominalSama,
} from "@/lib/uang"

describe("utilitas nominal", () => {
	it("menormalkan nominal ke dua desimal", () => {
		expect(keNominalString(350000)).toBe("350000.00")
		expect(keNominalString("350000.5")).toBe("350000.50")
		expect(keNominalString("0350000.456")).toBe("350000.45")
	})

	it("menolak nominal yang tidak valid", () => {
		expect(() => keNominalString("tiga ratus ribu")).toThrow(
			"Nominal tidak valid",
		)
	})

	it("membandingkan nominal tanpa galat floating point", () => {
		expect(nominalSama("350000", 350000)).toBe(true)
		expect(nominalSama("350000.00", "350000.000")).toBe(true)
		expect(nominalSama("350000", "350001")).toBe(false)
	})

	it("menjumlahkan nominal dalam satuan sen", () => {
		expect(jumlahkanNominal(["0.10", "0.20"])).toBe("0.30")
		expect(jumlahkanNominal(["350000", "400000.50"])).toBe("750000.50")
	})

	it("membulatkan nominal untuk dikirim ke Pakasir", () => {
		expect(keRupiahBulat("350000.49")).toBe(350000)
		expect(keRupiahBulat("350000.50")).toBe(350001)
		expect(keAngka("350000.50")).toBe(350000.5)
	})
})
