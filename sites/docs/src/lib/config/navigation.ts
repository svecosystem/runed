import { defineNavigation } from "@svecodocs/kit";
import { docs } from "$content/index.js";
import Notebook from "phosphor-svelte/lib/Notebook";
import RocketLaunch from "phosphor-svelte/lib/RocketLaunch";
import Tag from "phosphor-svelte/lib/Tag";

type NavItem = {
	title: string;
	href: string;
};

function docToNavItem(doc: (typeof docs)[number]): NavItem {
	return {
		title: doc.title,
		href: `/docs/${doc.slug}`,
	};
}

function buildSections() {
	const sections: Record<(typeof docs)[0]["category"], NavItem[]> = {
		New: [],
		Reactivity: [],
		State: [],
		Elements: [],
		Browser: [],
		Component: [],
		Utilities: [],
		Animation: [],
		Sensors: [],
		Anchor: [],
	};

	for (const doc of docs) {
		sections[doc.category].push(docToNavItem(doc));
	}

	return sections;
}

const { New, Reactivity, State, Elements, Browser, Component, Utilities, Animation, Sensors } =
	buildSections();

export const navigation = defineNavigation({
	anchors: [
		{
			title: "Introduction",
			icon: Notebook,
			href: "/docs",
		},
		{
			title: "Getting Started",
			icon: RocketLaunch,
			href: "/docs/getting-started",
		},
		{
			title: "Releases",
			icon: Tag,
			href: "https://github.com/svecosystem/runed/releases",
		},
	],
	sections: [
		{
			title: "New",
			items: New,
		},
		{
			title: "Reactivity",
			items: Reactivity,
		},
		{
			title: "State",
			items: State,
		},
		{
			title: "Elements",
			items: Elements,
		},
		{
			title: "Browser",
			items: Browser,
		},
		{
			title: "Sensors",
			items: Sensors,
		},
		{
			title: "Animation",
			items: Animation,
		},
		{
			title: "Utilities",
			items: Utilities,
		},
		{
			title: "Component",
			items: Component,
		},
	].filter((item) => item.items.length),
});
