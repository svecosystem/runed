import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const CUSTOM_IGNORES = ["**/.github/**", "CHANGELOG.md", "**/.contentlayer"];

export default config({
	svelte: true,
	ignores: [...DEFAULT_IGNORES, ...CUSTOM_IGNORES],
});
