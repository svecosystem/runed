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
	//	rules: {
	//	"no-new": "off", // TODO: re-enabled once hunter updates his pkg
	//},
}).override("antfu/typescript/rules", {
	rules: {
		"ts/consistent-type-definitions": "off",
	},
});
