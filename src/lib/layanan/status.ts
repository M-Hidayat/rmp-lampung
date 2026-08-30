/**
 * Status domain dan aturan transisi. Nilai sengaja identik dengan enum Prisma
 * agar layanan domain dapat diuji tanpa mengimpor klien basis data.
 */

export type StatusPendaftaran = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED"
export type StatusPembayaran = "PENDING" | "PAID" | "FAILED" | "EXPIRED"

const transisiPembayaran: Record<StatusPembayaran, StatusPembayaran[]> = {
	PENDING: ["PENDING", "PAID", "FAILED", "EXPIRED"],
	// PAID bersifat final; webhook ulang dengan status PAID diperlakukan idempoten.
	PAID: ["PAID"],
	FAILED: ["FAILED", "PAID"],
	EXPIRED: ["EXPIRED"],
}

export function transisiPembayaranSah(
	dari: StatusPembayaran,
	ke: StatusPembayaran,
): boolean {
	return transisiPembayaran[dari].includes(ke)
}

/** Status pendaftaran yang mengikuti status pembayaran. */
export function statusPendaftaranDariPembayaran(
	status: StatusPembayaran,
): StatusPendaftaran {
	switch (status) {
		case "PAID":
			return "PAID"
		case "FAILED":
			return "CANCELLED"
		case "EXPIRED":
			return "EXPIRED"
		default:
			return "PENDING"
	}
}

/** Status pendaftaran yang masih memakai kuota kelas. */
export const statusPendaftaranMemakaiKuota: StatusPendaftaran[] = [
	"PENDING",
	"PAID",
]

export const labelStatusPembayaran: Record<StatusPembayaran, string> = {
	PENDING: "Menunggu pembayaran",
	PAID: "Lunas",
	FAILED: "Gagal",
	EXPIRED: "Kedaluwarsa",
}

export const labelStatusPendaftaran: Record<StatusPendaftaran, string> = {
	PENDING: "Menunggu pembayaran",
	PAID: "Terdaftar (lunas)",
	CANCELLED: "Dibatalkan",
	EXPIRED: "Kedaluwarsa",
}
