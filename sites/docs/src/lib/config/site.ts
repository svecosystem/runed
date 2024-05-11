export const siteConfig = {
	name: "Runed",
	url: "https://runed.dev",
	description: "Magical utilities for Svelte 5.",
	links: {
		x: "https://x.com/huntabyte",
		github: "https://github.com/svecosystem/runed",
		releases: "https://github.com/svecosystem/runed/releases",
	},
	author: "Huntabyte & Thomas G. Lopes",
	keywords:
		"Svelte runes utilities,svelte runes,svelte utilities,runed,svelte helpers,svelte utils,svelte functions",
	ogImage: {
		url: "https://runed.dev/og.png",
		width: "1200",
		height: "630",
	},
	license: {
		name: "MIT",
		url: "https://github.com/svecosystem/runed/blob/main/LICENSE",
	},
};

export type SiteConfig = typeof siteConfig;
