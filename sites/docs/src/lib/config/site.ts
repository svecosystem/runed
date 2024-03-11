export const siteConfig = {
	name: "WithRunes",
	url: "https://withrunes.com",
	description: "Resizable pane components for Svelte and SvelteKit.",
	links: {
		x: "https://x.com/huntabyte",
		github: "https://github.com/svecosystem/withrunes",
		releases: "https://github.com/svecosystem/withrunes/releases",
	},
	author: "Huntabyte",
	keywords:
		"Svelte resizable panels,svelte panels,svelte panes,withrunes,svelte pane,svelte pane forge,svelte resizable",
	ogImage: {
		url: "https://withrunes.com/og.png",
		width: "1200",
		height: "630",
	},
	license: {
		name: "MIT",
		url: "https://github.com/svecosystem/withrunes/blob/main/LICENSE",
	},
};

export type SiteConfig = typeof siteConfig;
