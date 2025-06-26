import { MediaQuery } from "svelte/reactivity";

export type Breakpoints<K extends string> = Record<K, string>;

/** Based on the default Tailwind CSS breakpoints https://tailwindcss.com/docs/responsive-design.
 * A breakpoint is `true` when the width of the screen is greater than or equal to the breakpoint. */
export const TAILWIND_BREAKPOINTS: Breakpoints<"sm" | "md" | "lg" | "xl" | "2xl"> = {
	sm: "40rem",
	md: "48rem",
	lg: "64rem",
	xl: "80rem",
	"2xl": "96rem",
} as const;

/** Dynamically creates media queries for the provided breakpoints allowing you to access them as `media.<name>`.
 *
 * @param breakpoints
 * @returns
 */
export function useBreakpoints<K extends string = keyof typeof TAILWIND_BREAKPOINTS>(
	breakpoints: Breakpoints<K> = TAILWIND_BREAKPOINTS as Breakpoints<K>
): Record<K, boolean> {
	const queries = {};

	for (const [name, size] of Object.entries(breakpoints)) {
		const query = new MediaQuery(`min-width: ${size}`);

		Object.defineProperty(queries, name, {
			get: () => query.current,
		});
	}

	return queries as Record<K, boolean>;
}
