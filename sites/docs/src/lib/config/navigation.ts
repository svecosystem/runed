import { allUtilityDocs } from "../../../.contentlayer/generated";

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
};

export type SidebarNavItem = NavItem & {
	items: SidebarNavItem[];
	collapsible?: boolean;
};

export type NavItemWithChildren = NavItem & {
	items: NavItemWithChildren[];
};

export type Navigation = {
	main: NavItem[];
	sidebar: SidebarNavItem[];
};

const CATEGORIES = [
	"New",
	"Reactivity",
	"State",
	"Elements",
	"Browser",
	"Component",
	"Utilities",
] as const;
type Category = (typeof CATEGORIES)[number];

function isCategory(category: string): category is Category {
	return CATEGORIES.includes(category as Category);
}

function generateUtilitiesNav() {
	const categories = new Set(
		allUtilityDocs
			.map((doc) => doc.category)
			.filter((category): category is Category => isCategory(category))
	);

	const navItems: SidebarNavItem[] = [];

	// Create a map to store the items for each category
	const categoryItemsMap: Record<string, SidebarNavItem["items"]> = {};

	// Populate the map with items for each category
	for (const doc of allUtilityDocs) {
		if (!categoryItemsMap[doc.category]) {
			categoryItemsMap[doc.category] = [];
		}
		categoryItemsMap[doc.category]?.push({
			title: doc.title,
			href: `/docs/utilities/${doc.slug}`,
			items: [],
		});
	}

	// Sort the categories based on the provided sort order
	const sortedCategories = CATEGORIES.filter((category) => categories.has(category));

	// Create the navItems array based on the sorted categories
	for (const category of sortedCategories) {
		const items = categoryItemsMap[category] ?? [];
		// Sort the items based on the title
		items.sort((a, b) => a.title.localeCompare(b.title));
		// Add the category to the navItems array
		navItems.push({
			title: category,
			items,
			collapsible: false,
		});
	}

	return navItems;
}

export const navigation: Navigation = {
	main: [
		{
			title: "Documentation",
			href: "/docs",
		},
		{
			title: "Svecosystem",
			href: "https://github.com/svecosystem",
			external: true,
		},
		{
			title: "Releases",
			href: "https://github.com/svecosystem/runed/releases",
			external: true,
		},
	],
	sidebar: [
		{
			title: "Overview",
			collapsible: true,
			items: [
				{
					title: "Introduction",
					href: "/docs",
					items: [],
				},
				{
					title: "Getting Started",
					href: "/docs/getting-started",
					items: [],
				},
			],
		},
		...generateUtilitiesNav(),
	],
};
