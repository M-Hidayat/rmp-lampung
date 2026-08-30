import * as bcrypt from "bcryptjs"

/** Hash kata sandi dengan bcrypt (cost 12). */
export async function hashKataSandi(kataSandi: string): Promise<string> {
	return bcrypt.hash(kataSandi, 12)
}

/** Membandingkan kata sandi teks polos dengan hash bcrypt. */
export async function bandingkanKataSandi(
	kataSandi: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(kataSandi, hash)
}
