import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mdsx } from "mdsx";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsxConfig } from "./mdsx.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		mdsx(mdsxConfig),
		vitePreprocess({
			style: {
				css: {
					postcss: join(__dirname, "postcss.config.cjs"),
				},
			},
		}),
	],
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter(),
		alias: {
			$icons: "src/lib/icons",
		},
	},
};

export default config;
