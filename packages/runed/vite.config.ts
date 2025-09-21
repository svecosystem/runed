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
		includeSource: ["src/**/*.{js,ts,svelte}"],
		globals: true,
		coverage: {
			exclude: ["./setupTest.ts"],
		},
		workspace: [
			{
				extends: true,
				test: {
					setupFiles: ["./setupTest.ts"],
					include: ["src/**/*.{test,test.svelte}.{js,ts}"],
					exclude: ["src/**/*.browser.{test,test.svelte}.{js,ts}"],
					name: "unit",
					environment: "jsdom",
				},
			},
			{
				extends: true,
				test: {
					include: ["src/**/*.browser.{test,test.svelte,spec}.{js,ts}"],
					name: "browser",
					browser: {
						instances: [
							{
								browser: "chromium",
							},
						],
						enabled: true,
						provider: "playwright",
						headless: true,
					},
				},
			},
		],
	},
});
