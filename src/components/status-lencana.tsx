import {
	labelStatusPembayaran,
	labelStatusPendaftaran,
	type StatusPembayaran,
	type StatusPendaftaran,
} from "@/lib/layanan/status"

/**
 * Lencana status solid pill sesuai referensi dashboard Bodyshop SaaS.
 */
export function LencanaStatusPembayaran({
	status,
}: {
	status: StatusPembayaran
}) {
	const styles =
		status === "PAID"
			? "border border-emerald-200 bg-emerald-50 text-emerald-800"
			: status === "PENDING"
				? "border border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]"
				: "border border-red-200 bg-red-50 text-red-700"

	return (
		<span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 text-xs font-semibold select-none ${styles}`}>
			{labelStatusPembayaran[status]}
		</span>
	)
}

export function LencanaStatusPendaftaran({
	status,
}: {
	status: StatusPendaftaran
}) {
	const styles =
		status === "PAID"
			? "border border-emerald-200 bg-emerald-50 text-emerald-800"
			: status === "PENDING"
				? "border border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]"
				: "border border-red-200 bg-red-50 text-red-700"

	return (
		<span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 text-xs font-semibold select-none ${styles}`}>
			{labelStatusPendaftaran[status]}
		</span>
	)
}

export function LencanaStatusSertifikat({
	dibatalkan,
}: {
	dibatalkan: boolean
}) {
	return (
		<span
			className={`inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 text-xs font-semibold select-none ${
				dibatalkan
					? "border border-red-200 bg-red-50 text-red-700"
					: "border border-emerald-200 bg-emerald-50 text-emerald-800"
			}`}
		>
			{dibatalkan ? "Dibatalkan" : "Valid"}
		</span>
	)
}

export function LencanaStatusAbsensi({ hadir }: { hadir: boolean }) {
	return (
		<span
			className={`inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 text-xs font-semibold select-none ${
				hadir
					? "border border-emerald-200 bg-emerald-50 text-emerald-800"
					: "border border-zinc-200 bg-zinc-100 text-zinc-600"
			}`}
		>
			{hadir ? "Hadir" : "Belum Hadir"}
		</span>
	)
}

export function LencanaAktif({ aktif }: { aktif: boolean }) {
	return (
		<span
			className={`inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 text-xs font-semibold select-none ${
				aktif
					? "border border-emerald-200 bg-emerald-50 text-emerald-800"
					: "border border-zinc-200 bg-zinc-100 text-zinc-600"
			}`}
		>
			{aktif ? "Aktif" : "Nonaktif"}
		</span>
	)
}
