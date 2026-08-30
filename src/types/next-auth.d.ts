import type { DefaultSession } from "next-auth"
import type { Peran } from "@/lib/rbac"

declare module "next-auth" {
	interface Session {
		user: {
			id: string
			peran: Peran
		} & DefaultSession["user"]
	}

	interface User {
		peran?: Peran
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		peran?: Peran
	}
}
