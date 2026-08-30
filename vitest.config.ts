import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts"],
		setupFiles: ["./vitest.setup.ts"],
		hookTimeout: 30_000,
		testTimeout: 30_000,
	},
})
