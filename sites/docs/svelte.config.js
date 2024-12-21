import { mdsx } from "mdsx";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import mdsxConfig from "./mdsx.config.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsx(mdsxConfig), vitePreprocess()],
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter({
			routes: {
				// To avoid too many static assets being generated, we'll manually
				// define the globs for them to save oru 100 include/exclude limit
				exclude: [
					"<build>",
					// pre-rendered content
					"/docs/*",
					"/docs.html",
					"/api/*",
					// static
					"/android-chrome-192x192.png",
					"/android-chrome-512x512.png",
					"/apple-touch-icon.png",
					"/favicon-16x16.png",
					"/favicon-32x32.png",
					"/favicon.ico",
					"/logo-dark.svg",
					"/logo-light.svg",
					"/mouse_sprite.png",
					"/og.png",
					"/site.webmanifest",
				],
			},
		}),
		prerender: {
			handleMissingId: (details) => {
				if (details.id === "#") return;
				console.warn(details.message);
			},
		},
		alias: {
			"$content/*": ".velite/*",
		},
	},
};

export default config;
