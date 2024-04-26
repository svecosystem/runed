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

export const navigation: Navigation = {
	// By default, `main` navigation items are rendered in the top navigation bar.
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
	// By default, `sidebar` navigation only supports 2 levels of navigation.
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

		{
			title: "Functions",
			collapsible: true,
			items: [
				{
					title: "Box",
					href: "/docs/functions/box",
					items: [],
				},
				{
					title: "useActiveElement",
					href: "/docs/functions/use-active-element",
					items: [],
				},
				{
					title: "useDebounce",
					href: "/docs/functions/use-debounce",
					items: [],
				},
				{
					title: "useElementSize",
					href: "/docs/functions/use-element-size",
					items: [],
				},
				{
					title: "useEventListener",
					href: "/docs/functions/use-event-listener",
					items: [],
				},
				{
					title: "useMounted",
					href: "/docs/functions/use-mounted",
					items: [],
				},
			],
		},
	],
};
