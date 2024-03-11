import { tv, type VariantProps } from "tailwind-variants";

import Root from "./alert.svelte";
import Description from "./alert-description.svelte";
import Title from "./alert-title.svelte";

export const alertVariants = tv({
	base: "relative w-full rounded-tr-lg rounded-br-lg border-l-4 px-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-6 [&>svg+div]:translate-y-[-3px] pb-4 pt-[22px]",

	variants: {
		variant: {
			note: "text-foreground [&>svg]:text-sky-800 bg-sky-200 [&>h5]:text-sky-800 border-sky-600 dark:[&>svg]:text-sky-400 dark:bg-sky-500/20 dark:[&>h5]:text-sky-400 dark:border-sky-600",
			danger:
				"text-foreground [&>svg]:text-red-800 bg-rose-200 [&>h5]:text-red-800 border-rose-600 dark:[&>svg]:text-red-300 dark:bg-rose-500/20 dark:[&>h5]:text-red-300 dark:border-rose-600",
			tip: "text-foreground [&>svg]:text-fuchsia-800 bg-fuchsia-200 [&>h5]:text-fuchsia-800 border-fuchsia-600 dark:[&>svg]:text-fuchsia-400 dark:bg-fuchsia-500/20 dark:[&>h5]:text-fuchsia-400 dark:border-fuchsia-600",
			warning:
				"text-foreground [&>svg]:text-amber-800 bg-amber-200 [&>h5]:text-amber-800 border-amber-600 dark:[&>svg]:text-amber-400 dark:bg-amber-500/20 dark:[&>h5]:text-amber-400 dark:border-amber-600",
		},
	},
	defaultVariants: {
		variant: "note",
	},
});

export type Variant = VariantProps<typeof alertVariants>["variant"];
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export {
	Root,
	Description,
	Title,
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle,
};
