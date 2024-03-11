export const siteConfig = {
	name: "PaneForge",
	url: "https://paneforge.com",
	description: "Resizable pane components for Svelte and SvelteKit.",
	links: {
		x: "https://x.com/huntabyte",
		github: "https://github.com/svecosystem/paneforge",
		releases: "https://github.com/svecosystem/paneforge/releases",
	},
	author: "Huntabyte",
	keywords:
		"Svelte resizable panels,svelte panels,svelte panes,paneforge,svelte pane,svelte pane forge,svelte resizable",
	ogImage: {
		url: "https://paneforge.com/og.png",
		width: "1200",
		height: "630",
	},
	license: {
		name: "MIT",
		url: "https://github.com/svecosystem/paneforge/blob/main/LICENSE",
	},
};

export type SiteConfig = typeof siteConfig;
