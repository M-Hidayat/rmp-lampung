/**
 * Utilitas nominal rupiah.
 * Nominal disimpan sebagai Decimal pada basis data. Di dalam aplikasi nominal
 * dibandingkan sebagai string berskala dua desimal agar tidak terpengaruh
 * galat floating point.
 */
export type NominalSepertiDesimal =
	| number
	| string
	| { toString(): string }

export function keNominalString(nilai: NominalSepertiDesimal): string {
	const mentah = typeof nilai === "string" ? nilai : String(nilai)
	const bersih = mentah.trim()
	if (!/^-?\d+(\.\d+)?$/.test(bersih)) {
		throw new Error("Nominal tidak valid")
	}
	const negatif = bersih.startsWith("-")
	const absolut = negatif ? bersih.slice(1) : bersih
	const [bulat, pecahan = ""] = absolut.split(".")
	const duaDesimal = `${pecahan}00`.slice(0, 2)
	const hasil = `${bulat.replace(/^0+(?=\d)/, "")}.${duaDesimal}`
	return negatif && Number(absolut) !== 0 ? `-${hasil}` : hasil
}

/** Membandingkan dua nominal tanpa galat floating point. */
export function nominalSama(
	a: NominalSepertiDesimal,
	b: NominalSepertiDesimal,
): boolean {
	return keNominalString(a) === keNominalString(b)
}

export function keAngka(nilai: NominalSepertiDesimal): number {
	return Number(keNominalString(nilai))
}

export function jumlahkanNominal(daftar: NominalSepertiDesimal[]): string {
	const totalSen = daftar.reduce<number>((akumulasi, nilai) => {
		const [bulat, pecahan] = keNominalString(nilai).split(".")
		return akumulasi + Number(bulat) * 100 + Number(pecahan)
	}, 0)
	const negatif = totalSen < 0
	const absolut = Math.abs(totalSen)
	const hasil = `${Math.floor(absolut / 100)}.${String(absolut % 100).padStart(2, "0")}`
	return negatif ? `-${hasil}` : hasil
}

/** Nominal bulat rupiah untuk dikirim ke Pakasir (tanpa desimal). */
export function keRupiahBulat(nilai: NominalSepertiDesimal): number {
	return Math.round(keAngka(nilai))
}

export function formatRupiah(nilai: NominalSepertiDesimal): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(keAngka(nilai))
}

export function formatTanggal(nilai: Date | string): string {
	const tanggal = typeof nilai === "string" ? new Date(nilai) : nilai
	return new Intl.DateTimeFormat("id-ID", {
		dateStyle: "long",
		timeZone: "Asia/Jakarta",
	}).format(tanggal)
}

export function formatTanggalWaktu(nilai: Date | string): string {
	const tanggal = typeof nilai === "string" ? new Date(nilai) : nilai
	return new Intl.DateTimeFormat("id-ID", {
		dateStyle: "long",
		timeStyle: "short",
		timeZone: "Asia/Jakarta",
	}).format(tanggal)
}
