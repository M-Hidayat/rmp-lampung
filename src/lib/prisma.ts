import { PrismaClient } from "@prisma/client"

const globalPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

/** Klien Prisma tunggal (mencegah koneksi ganda saat hot reload). */
export const prisma =
	globalPrisma.prisma ??
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["warn", "error"]
				: ["error"],
	})

if (process.env.NODE_ENV !== "production") {
	globalPrisma.prisma = prisma
}

/**
 * Tipe minimum akses basis data yang dipakai layanan domain.
 * Memakai tipe ini memudahkan dependency injection pada pengujian.
 */
export type KlienDb = PrismaClient
export type TransaksiDb = Parameters<
	Parameters<PrismaClient["$transaction"]>[0]
>[0]
