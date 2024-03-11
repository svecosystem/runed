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
			href: "https://github.com/svecosystem/paneforge/releases",
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
			title: "Components",
			collapsible: true,
			items: [
				{
					title: "PaneGroup",
					href: "/docs/components/pane-group",
					items: [],
				},
				{
					title: "Pane",
					href: "/docs/components/pane",
					items: [],
				},
				{
					title: "PaneResizer",
					href: "/docs/components/pane-resizer",
					items: [],
				},
			],
		},
		{
			title: "Examples",
			collapsible: true,
			items: [
				{
					title: "Horizontal Group",
					href: "/docs/examples/horizontal-groups",
					items: [],
				},
				{
					title: "Vertical Group",
					href: "/docs/examples/vertical-groups",
					items: [],
				},
				{
					title: "Nested Groups",
					href: "/docs/examples/nested-groups",
					items: [],
				},
				{
					title: "Overflowing Panes",
					href: "/docs/examples/overflowing-panes",
					items: [],
				},
				{
					title: "Collapsible Panes",
					href: "/docs/examples/collapsible-panes",
					items: [],
				},
				{
					title: "Conditional Panes",
					href: "/docs/examples/conditional-panes",
					items: [],
				},
				{
					title: "Persistent Layouts",
					href: "/docs/examples/persistent-layouts",
					items: [],
				},
			],
		},
	],
};
