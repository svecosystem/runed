import process from "node:process";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { svelteTesting } from "@testing-library/svelte/vite";
import type { Plugin } from "vite";

const vitestBrowserConditionPlugin: Plugin = {
	name: "vite-plugin-vitest-browser-condition",
	configResolved({ resolve }: { resolve: { conditions: string[] } }) {
		if (process.env.VITEST) {
			resolve.conditions.unshift("browser");
		}
	},
};

export default defineConfig({
	plugins: [vitestBrowserConditionPlugin, sveltekit(), svelteTesting()],
	test: {
		include: ["src/**/*.{test,test.svelte,spec}.{js,ts}"],
		environment: "jsdom",
		includeSource: ["src/**/*.{js,ts,svelte}"],
		setupFiles: ["./setupTest.ts"],
		globals: true,
		coverage: {
			exclude: ["./setupTest.ts"],
		},
	},
});
