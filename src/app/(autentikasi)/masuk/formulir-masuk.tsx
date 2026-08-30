"use client"

import { useActionState, useRef } from "react"

import { aksiMasuk, type StatusFormulir } from "../aksi"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormulirMasuk({ lanjut }: { lanjut?: string }) {
	const [status, aksi, sedangProses] = useActionState<StatusFormulir, FormData>(
		aksiMasuk,
		undefined,
	)

	const emailInputRef = useRef<HTMLInputElement | null>(null)
	const sandiInputRef = useRef<HTMLInputElement | null>(null)

	const isiAkunDemo = (e: string, s: string) => {
		if (emailInputRef.current) emailInputRef.current.value = e
		if (sandiInputRef.current) sandiInputRef.current.value = s
	}

	return (
		<div className="space-y-4">
			<form action={aksi} className="space-y-4" noValidate>
				<input type="hidden" name="lanjut" value={lanjut ?? ""} />
				{status?.pesan ? (
					<Alert variant="gagal" judul="Gagal masuk">
						<p>{status.pesan}</p>
					</Alert>
				) : null}
				<div className="space-y-1.5">
					<Label htmlFor="email" className="text-xs font-medium text-zinc-700">
						Email
					</Label>
					<Input
						ref={emailInputRef}
						id="email"
						name="email"
						type="email"
						required
						placeholder="nama@email.com"
						autoComplete="email"
						className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="kataSandi" className="text-xs font-medium text-zinc-700">
						Kata sandi
					</Label>
					<Input
						ref={sandiInputRef}
						id="kataSandi"
						name="kataSandi"
						type="password"
						required
						placeholder="••••••••"
						autoComplete="current-password"
						className="rounded-xl border-[#E5E0D8] focus:border-[#D49A28]"
					/>
				</div>
				<Button
					type="submit"
					variant="gold"
					className="w-full font-semibold rounded-xl shadow-xs"
					disabled={sedangProses}
				>
					{sedangProses ? "Memproses…" : "Masuk"}
				</Button>
			</form>

			{/* Quick Demo Fill Shortcut */}
			<div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-xs space-y-1.5">
				<p className="font-semibold text-zinc-700">Akun demo pengujian:</p>
				<div className="grid grid-cols-3 gap-1.5">
					<button
						type="button"
						onClick={() => isiAkunDemo("peserta@contoh.rmp-lampung.test", "PesertaContoh123!")}
						className="rounded-lg border border-[#E8DFC8] bg-white px-2 py-1 text-[11px] font-medium text-[#854D0E] hover:bg-[#FDF8ED] transition-colors cursor-pointer text-center"
					>
						Peserta
					</button>
					<button
						type="button"
						onClick={() => isiAkunDemo("admin@contoh.rmp-lampung.test", "AdminContoh123!")}
						className="rounded-lg border border-[#E8DFC8] bg-white px-2 py-1 text-[11px] font-medium text-[#854D0E] hover:bg-[#FDF8ED] transition-colors cursor-pointer text-center"
					>
						Admin
					</button>
					<button
						type="button"
						onClick={() => isiAkunDemo("pemilik@contoh.rmp-lampung.test", "PemilikContoh123!")}
						className="rounded-lg border border-[#E8DFC8] bg-white px-2 py-1 text-[11px] font-medium text-[#854D0E] hover:bg-[#FDF8ED] transition-colors cursor-pointer text-center"
					>
						Pemilik
					</button>
				</div>
			</div>
		</div>
	)
}
