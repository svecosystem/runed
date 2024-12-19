import { defineNavigation } from "@svecodocs/kit";
import { docs } from "$content/index.js";
import Notebook from "phosphor-svelte/lib/Notebook";
import RocketLaunch from "phosphor-svelte/lib/RocketLaunch";
import Tag from "phosphor-svelte/lib/Tag";

function docToNavItem(doc: (typeof docs)[number]) {
	return {
		title: doc.title,
		href: `/docs/${doc.slug}`,
	};
}

const newSection = docs.filter((doc) => doc.category === "New").map(docToNavItem);
const reactivitySection = docs.filter((doc) => doc.category === "Reactivity").map(docToNavItem);
const stateSection = docs.filter((doc) => doc.category === "State").map(docToNavItem);
const elementsSection = docs.filter((doc) => doc.category === "Elements").map(docToNavItem);
const browserSection = docs.filter((doc) => doc.category === "Browser").map(docToNavItem);
const componentSection = docs.filter((doc) => doc.category === "Component").map(docToNavItem);
const utilitiesSection = docs.filter((doc) => doc.category === "Utilities").map(docToNavItem);
const animationSection = docs.filter((doc) => doc.category === "Animation").map(docToNavItem);
const sensorsSection = docs.filter((doc) => doc.category === "Sensors").map(docToNavItem);

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
			items: newSection,
		},
		{
			title: "Reactivity",
			items: reactivitySection,
		},
		{
			title: "State",
			items: stateSection,
		},
		{
			title: "Elements",
			items: elementsSection,
		},
		{
			title: "Browser",
			items: browserSection,
		},
		{
			title: "Sensors",
			items: sensorsSection,
		},
		{
			title: "Animation",
			items: animationSection,
		},
		{
			title: "Utilities",
			items: utilitiesSection,
		},
		{
			title: "Component",
			items: componentSection,
		},
	].filter((item) => item.items.length),
});
