import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
	server: {
		fs: {
			strict: false,
		},
	},
	assetsInclude: ["**/*.md", "**/*.mdx"],
});
