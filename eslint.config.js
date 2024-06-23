import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const CUSTOM_IGNORES = [
	"**/.github/**",
	"CHANGELOG.md",
	"**/.contentlayer",
	"**/node_modules/**",
	"**/.svelte-kit/**",
	".svelte-kit/**/*",
];

export default config({
	svelte: true,
	ignores: [...DEFAULT_IGNORES, ...CUSTOM_IGNORES],
	rules: {
	"no-new": "off",
	}
}).override("antfu/typescript/rules", {
	rules: {
		"ts/consistent-type-definitions": "off",
	},
});
