"use client"

import { useId, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group"

/**
 * Bidang kata sandi dengan tombol lihat/sembunyikan.
 *
 * Dipakai oleh formulir masuk, daftar, dan atur ulang kata sandi agar perilaku
 * dan labelnya seragam di seluruh aplikasi.
 *
 * Keamanan & aksesibilitas:
 * - Tombol bertipe `button` sehingga tidak pernah men-submit formulir.
 * - `aria-label` berubah mengikuti keadaan, dan `aria-pressed` menyampaikan
 *   status aktif/non-aktif ke pembaca layar.
 * - Kata sandi tetap `autoComplete` sesuai konteks (`current-password` vs
 *   `new-password`) supaya pengelola kata sandi browser berperilaku benar.
 */
export function BidangKataSandi({
	id,
	name,
	autoComplete,
	placeholder,
	required = true,
	ariaInvalid,
	ariaDescribedBy,
}: {
	id?: string
	name: string
	autoComplete: "current-password" | "new-password"
	placeholder?: string
	required?: boolean
	ariaInvalid?: boolean
	ariaDescribedBy?: string
}) {
	const [terlihat, setTerlihat] = useState(false)
	const idDibuat = useId()
	const idAkhir = id ?? idDibuat
	const idTombolLihat = `${idAkhir}-tombol-lihat`

	return (
		<InputGroup>
			<InputGroupInput
				id={idAkhir}
				name={name}
				type={terlihat ? "text" : "password"}
				required={required}
				autoComplete={autoComplete}
				placeholder={placeholder}
				aria-invalid={ariaInvalid ? true : undefined}
				aria-describedby={ariaDescribedBy}
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupButton
					aria-label={terlihat ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
					aria-pressed={terlihat}
					aria-controls={idAkhir}
					id={idTombolLihat}
					onClick={() => setTerlihat((sebelumnya) => !sebelumnya)}
				>
					{terlihat ? (
						<EyeOff aria-hidden="true" className="size-4" />
					) : (
						<Eye aria-hidden="true" className="size-4" />
					)}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	)
}