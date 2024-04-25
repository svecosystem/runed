import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const CUSTOM_IGNORES = [
	"**/.github/**",
	"CHANGELOG.md",
	"**/.contentlayer",
	"**/node_modules/**",
	"**/.svelte-kit/**",
	".svelte-kit/**/*",
	"*.md",
];

export default config({
	svelte: true,
	ignores: [...DEFAULT_IGNORES, ...CUSTOM_IGNORES],
}).override("antfu/typescript/rules", {
	rules: {
		"ts/consistent-type-definitions": "off",
	},
});
