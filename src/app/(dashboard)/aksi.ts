"use server"

import { revalidatePath } from "next/cache"

import { signOut } from "@/lib/auth"
import { sesiPengguna } from "@/lib/auth"
import { KesalahanDomain } from "@/lib/kesalahan"
import {
	buatSesiAbsensi,
	catatKehadiran,
	perbaruiTokenSesi,
	tutupSesiAbsensi,
} from "@/lib/layanan/absensi"
import { buatAdmin, ubahStatusAktifAdmin } from "@/lib/layanan/admin"
import { buatKelas, perbaruiKelas, ubahStatusAktifKelas } from "@/lib/layanan/kelas"
import { batalkanPendaftaranSaya } from "@/lib/layanan/pembayaran"
import { lanjutkanPembayaran } from "@/lib/layanan/pendaftaran"
import {
	batalkanSertifikat,
	pulihkanSertifikat,
	terbitkanSertifikat,
} from "@/lib/layanan/sertifikat"
import { redirect } from "next/navigation"

export type StatusAksi =
	| { sukses?: string; pesan?: string; detail?: Record<string, string> }
	| undefined

function keStatus(kesalahan: unknown, konteks: string): StatusAksi {
	if (kesalahan instanceof KesalahanDomain) {
		return { pesan: kesalahan.message, detail: kesalahan.detail }
	}
	console.error(`[${konteks}]`, kesalahan)
	return { pesan: "Terjadi kesalahan pada server. Silakan coba lagi." }
}

export async function aksiKeluar(): Promise<void> {
	await signOut({ redirectTo: "/" })
}

/* ------------------------------ Peserta ------------------------------ */

export async function aksiScanAbsensi(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		const hasil = await catatKehadiran(sesi, {
			token: String(formData.get("token") ?? ""),
		})
		revalidatePath("/user/absensi")
		revalidatePath("/user/kelas-saya")
		return {
			sukses: `Kehadiran Anda pada kelas ${hasil.judulKelas} berhasil dicatat.`,
		}
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-scan-absensi")
	}
}

export async function aksiLanjutkanPembayaran(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	let tujuan: string
	try {
		const sesi = await sesiPengguna()
		const hasil = await lanjutkanPembayaran(
			sesi,
			String(formData.get("enrollmentId") ?? ""),
		)
		tujuan = hasil.urlPembayaran
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-lanjutkan-pembayaran")
	}
	redirect(tujuan)
}

export async function aksiBatalkanPendaftaran(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		await batalkanPendaftaranSaya(
			sesi,
			String(formData.get("enrollmentId") ?? ""),
		)
		revalidatePath("/user/kelas-saya")
		return { sukses: "Pendaftaran yang belum dibayar telah dibatalkan." }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-batalkan-pendaftaran")
	}
}

/* -------------------------------- Admin ------------------------------- */

function bacaFormKelas(formData: FormData) {
	const jadwalSelesai = String(formData.get("jadwalSelesai") ?? "")
	const gambarUrl = String(formData.get("gambarUrl") ?? "")
	return {
		judul: String(formData.get("judul") ?? ""),
		slug: String(formData.get("slug") ?? ""),
		deskripsi: String(formData.get("deskripsi") ?? ""),
		harga: Number(formData.get("harga") ?? Number.NaN),
		kuota: Number(formData.get("kuota") ?? Number.NaN),
		jadwalMulai: String(formData.get("jadwalMulai") ?? ""),
		jadwalSelesai: jadwalSelesai === "" ? undefined : jadwalSelesai,
		lokasi: String(formData.get("lokasi") ?? ""),
		gambarUrl,
		aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
	}
}

export async function aksiBuatKelas(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		const kelas = await buatKelas(sesi, bacaFormKelas(formData))
		revalidatePath("/admin/kelas")
		revalidatePath("/kelas")
		return { sukses: `Kelas "${kelas.judul}" berhasil dibuat.` }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-buat-kelas")
	}
}

export async function aksiPerbaruiKelas(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		await perbaruiKelas(
			sesi,
			String(formData.get("classId") ?? ""),
			bacaFormKelas(formData),
		)
		revalidatePath("/admin/kelas")
		revalidatePath("/kelas")
		return { sukses: "Perubahan kelas berhasil disimpan." }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-perbarui-kelas")
	}
}

export async function aksiUbahStatusKelas(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		const aktif = String(formData.get("aktif") ?? "") === "true"
		await ubahStatusAktifKelas(
			sesi,
			String(formData.get("classId") ?? ""),
			aktif,
		)
		revalidatePath("/admin/kelas")
		revalidatePath("/kelas")
		return {
			sukses: aktif
				? "Kelas diaktifkan kembali."
				: "Kelas dinonaktifkan (data tidak dihapus).",
		}
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-ubah-status-kelas")
	}
}

export async function aksiBuatSesiAbsensi(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		await buatSesiAbsensi(sesi, {
			classId: String(formData.get("classId") ?? ""),
			masaBerlakuMenit: Number(formData.get("masaBerlakuMenit") ?? 10),
		})
		revalidatePath("/admin/absensi")
		return {
			sukses:
				"Sesi absensi dibuka. QR baru siap ditampilkan kepada peserta.",
		}
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-buat-sesi-absensi")
	}
}

export async function aksiPerbaruiTokenSesi(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		await perbaruiTokenSesi(
			sesi,
			String(formData.get("sessionId") ?? ""),
			Number(formData.get("masaBerlakuMenit") ?? 10),
		)
		revalidatePath("/admin/absensi")
		return { sukses: "Token QR diperbarui." }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-perbarui-token-sesi")
	}
}

export async function aksiTutupSesiAbsensi(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		await tutupSesiAbsensi(sesi, String(formData.get("sessionId") ?? ""))
		revalidatePath("/admin/absensi")
		return { sukses: "Sesi absensi ditutup." }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-tutup-sesi-absensi")
	}
}

export async function aksiTerbitkanSertifikat(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		const sertifikat = await terbitkanSertifikat(
			sesi,
			String(formData.get("attendanceId") ?? ""),
		)
		revalidatePath("/admin/sertifikat")
		return { sukses: `Sertifikat ${sertifikat.nomor} tersedia.` }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-terbitkan-sertifikat")
	}
}

export async function aksiBatalkanSertifikat(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		await batalkanSertifikat(sesi, String(formData.get("certificateId") ?? ""))
		revalidatePath("/admin/sertifikat")
		revalidatePath("/pemilik/audit-sertifikat")
		return { sukses: "Sertifikat ditandai dibatalkan (data tetap tersimpan)." }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-batalkan-sertifikat")
	}
}

export async function aksiPulihkanSertifikat(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		await pulihkanSertifikat(sesi, String(formData.get("certificateId") ?? ""))
		revalidatePath("/admin/sertifikat")
		revalidatePath("/pemilik/audit-sertifikat")
		return { sukses: "Sertifikat diaktifkan kembali." }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-pulihkan-sertifikat")
	}
}

/* ------------------------------- Pemilik ------------------------------ */

export async function aksiBuatAdmin(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		const admin = await buatAdmin(sesi, {
			nama: String(formData.get("nama") ?? ""),
			email: String(formData.get("email") ?? ""),
			kataSandi: String(formData.get("kataSandi") ?? ""),
		})
		revalidatePath("/pemilik/admin")
		return { sukses: `Akun admin ${admin.email} berhasil dibuat.` }
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-buat-admin")
	}
}

export async function aksiUbahStatusAdmin(
	_status: StatusAksi,
	formData: FormData,
): Promise<StatusAksi> {
	try {
		const sesi = await sesiPengguna()
		const aktif = String(formData.get("aktif") ?? "") === "true"
		await ubahStatusAktifAdmin(
			sesi,
			String(formData.get("userId") ?? ""),
			aktif,
		)
		revalidatePath("/pemilik/admin")
		return {
			sukses: aktif
				? "Akun admin diaktifkan."
				: "Akun admin dinonaktifkan (tidak dihapus).",
		}
	} catch (kesalahan) {
		return keStatus(kesalahan, "aksi-ubah-status-admin")
	}
}
