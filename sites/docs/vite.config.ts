import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		fs: {
			strict: false,
		},
	},
	assetsInclude: ["**/*.md"],
});
