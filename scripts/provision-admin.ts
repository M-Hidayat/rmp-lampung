import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { hashKataSandi } from "../src/lib/kata-sandi"
import { skemaEmail, skemaKataSandi, skemaNama } from "../src/lib/validasi"

const env = z.object({
	INITIAL_ADMIN_EMAIL: skemaEmail,
	INITIAL_ADMIN_PASSWORD: skemaKataSandi,
	INITIAL_ADMIN_NAME: skemaNama,
}).parse(process.env)

const prisma = new PrismaClient()

async function main() {
	const passwordHash = await hashKataSandi(env.INITIAL_ADMIN_PASSWORD)
	const hasil = await prisma.$transaction(async (tx) => {
		const admin = await tx.user.upsert({
			where: { email: env.INITIAL_ADMIN_EMAIL },
			update: { nama: env.INITIAL_ADMIN_NAME, passwordHash, peran: "ADMIN", aktif: true },
			create: { nama: env.INITIAL_ADMIN_NAME, email: env.INITIAL_ADMIN_EMAIL, passwordHash, peran: "ADMIN", aktif: true },
			select: { id: true, email: true, peran: true },
		})

		const pemilik = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM "User" WHERE peran::text = 'PEMILIK'`
		if (pemilik.length) {
			await tx.$executeRaw`UPDATE "AttendanceSession" SET "dibuatOlehId" = ${admin.id} WHERE "dibuatOlehId" IN (SELECT id FROM "User" WHERE peran::text = 'PEMILIK')`
			await tx.$executeRaw`DELETE FROM "User" WHERE peran::text = 'PEMILIK'`
		}
		return { admin, jumlahPemilikDihapus: pemilik.length }
	})

	console.info(`Admin aktif: ${hasil.admin.email} (${hasil.admin.peran})`)
	console.info(`Akun PEMILIK lama dihapus: ${hasil.jumlahPemilikDihapus}`)
}

main()
	.catch((error) => {
		console.error("Provisioning admin gagal:", error instanceof Error ? error.message : "Kesalahan tidak dikenal")
		process.exitCode = 1
	})
	.finally(() => prisma.$disconnect())
