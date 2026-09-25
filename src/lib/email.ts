import { createTransport, type Transporter } from "nodemailer"

/**
 * Pengiriman email transaksional (saat ini: tautan atur ulang kata sandi).
 *
 * Dirancang sebagai lapisan yang bisa dinyalakan: seluruh kredensial dibaca dari
 * environment, dan bila belum diisi modul ini **melaporkan** bahwa pengiriman
 * tidak tersedia alih-alih gagal diam-diam atau berpura-pura berhasil.
 *
 * Kontrak yang dipegang:
 * - Tidak ada kredensial yang ditulis ke kode atau log.
 * - `kirimEmail` mengembalikan status terkirim/tidak, sehingga pemanggil dapat
 *   memberi pesan yang jujur kepada pengguna.
 * - Di mode pengembangan tanpa SMTP, tautan ditulis ke log server saja supaya
 *   alur dapat diuji tanpa membocorkannya ke pengguna akhir.
 */

export type HasilKirimEmail =
	| { terkirim: true }
	| { terkirim: false; alasan: "SMTP_BELUM_DIKONFIGURASI" | "GAGAL_KIRIM" }

type KonfigurasiSmtp = {
	host: string
	port: number
	secure: boolean
	user: string
	pass: string
	dari: string
}

/** Membaca konfigurasi SMTP; `null` bila belum lengkap. */
export function konfigurasiSmtp(
	env: NodeJS.ProcessEnv = process.env,
): KonfigurasiSmtp | null {
	const host = env.SMTP_HOST?.trim()
	const user = env.SMTP_USER?.trim()
	const pass = env.SMTP_PASS
	if (!host || !user || !pass) return null

	const port = Number(env.SMTP_PORT ?? "587")
	return {
		host,
		port: Number.isFinite(port) ? port : 587,
		// Port 465 memakai TLS implisit; port lain memakai STARTTLS.
		secure: (env.SMTP_SECURE ?? "").toLowerCase() === "true" || port === 465,
		user,
		pass,
		dari: env.SMTP_FROM?.trim() || user,
	}
}

/** Apakah pengiriman email siap dipakai. Dipakai UI untuk memberi pesan yang jujur. */
export function emailSiap(env: NodeJS.ProcessEnv = process.env): boolean {
	return konfigurasiSmtp(env) !== null
}

export type DependensiEmail = {
	transporter?: Transporter
	konfigurasi?: KonfigurasiSmtp | null
	env?: NodeJS.ProcessEnv
}

export async function kirimEmail(
	{ kepada, subjek, teks, html }: { kepada: string; subjek: string; teks: string; html?: string },
	dependensi: DependensiEmail = {},
): Promise<HasilKirimEmail> {
	const konf =
		dependensi.konfigurasi !== undefined
			? dependensi.konfigurasi
			: konfigurasiSmtp(dependensi.env ?? process.env)
	if (!konf && !dependensi.transporter) {
		return { terkirim: false, alasan: "SMTP_BELUM_DIKONFIGURASI" }
	}

	try {
		const transporter =
			dependensi.transporter ??
			createTransport({
				host: konf!.host,
				port: konf!.port,
				secure: konf!.secure,
				auth: { user: konf!.user, pass: konf!.pass },
			})

		await transporter.sendMail({
			from: konf?.dari,
			to: kepada,
			subject: subjek,
			text: teks,
			html,
		})
		return { terkirim: true }
	} catch {
		// Detail kegagalan tidak pernah memuat isi pesan atau kredensial.
		return { terkirim: false, alasan: "GAGAL_KIRIM" }
	}
}

/** Isi email tautan atur ulang kata sandi. */
export function pesanAturUlangSandi({
	nama,
	tautan,
	masaBerlakuMenit,
}: {
	nama: string
	tautan: string
	masaBerlakuMenit: number
}): { subjek: string; teks: string; html: string } {
	const subjek = "Atur ulang kata sandi Rumah Mama Pintar"
	const teks = [
		`Halo ${nama},`,
		"",
		"Kami menerima permintaan untuk mengatur ulang kata sandi akun Rumah Mama Pintar Anda.",
		`Buka tautan berikut untuk membuat kata sandi baru (berlaku ${masaBerlakuMenit} menit):`,
		tautan,
		"",
		"Bila Anda tidak meminta hal ini, abaikan email ini. Kata sandi Anda tidak berubah.",
		"",
		"Salam,",
		"Rumah Mama Pintar",
	].join("\n")

	const html = `
		<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#0f172a">
			<p>Halo ${nama},</p>
			<p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Rumah Mama Pintar Anda.</p>
			<p>
				<a href="${tautan}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">
					Buat kata sandi baru
				</a>
			</p>
			<p>Tautan ini berlaku ${masaBerlakuMenit} menit dan hanya dapat dipakai sekali.</p>
			<p style="color:#475569">Bila Anda tidak meminta hal ini, abaikan email ini. Kata sandi Anda tidak berubah.</p>
			<p style="color:#475569">Salam,<br />Rumah Mama Pintar</p>
		</div>
	`.trim()

	return { subjek, teks, html }
}
