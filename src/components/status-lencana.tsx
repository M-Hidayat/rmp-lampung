import {
	labelStatusPembayaran,
	labelStatusPendaftaran,
	type StatusPembayaran,
	type StatusPendaftaran,
} from "@/lib/layanan/status"
import { Badge } from "@/components/ui/badge"

export function LencanaStatusPembayaran({ status }: { status: StatusPembayaran }) {
	return (
		<Badge variant={status === "PAID" ? "default" : "secondary"}>
			{labelStatusPembayaran[status]}
		</Badge>
	)
}

export function LencanaStatusPendaftaran({ status }: { status: StatusPendaftaran }) {
	return (
		<Badge variant={status === "PAID" ? "default" : "secondary"}>
			{labelStatusPendaftaran[status]}
		</Badge>
	)
}

export function LencanaStatusSertifikat({ dibatalkan }: { dibatalkan: boolean }) {
	return (
		<Badge variant={dibatalkan ? "destructive" : "outline"}>
			{dibatalkan ? "Dibatalkan" : "Valid"}
		</Badge>
	)
}

export function LencanaStatusAbsensi({ hadir }: { hadir: boolean }) {
	return (
		<Badge variant={hadir ? "default" : "secondary"}>
			{hadir ? "Hadir" : "Belum Hadir"}
		</Badge>
	)
}

export function LencanaAktif({ aktif }: { aktif: boolean }) {
	return (
		<Badge variant={aktif ? "default" : "secondary"}>
			{aktif ? "Aktif" : "Nonaktif"}
		</Badge>
	)
}
