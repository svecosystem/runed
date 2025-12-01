import { MediaQuery } from "svelte/reactivity";

export type UsePrefersDarkOptions = {
	/**
	 * Fallback value for server-side rendering
	 * 
	 * @defaultValue false
	 */
	fallback?: boolean;
};

/**
 * Reactive dark mode preference detection using the browser's
 * [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query.
 *
 * @see https://runed.dev/docs/utilities/use-prefers-dark
 */
export class UsePrefersDark {
	#mediaQuery: MediaQuery;
	#fallback: boolean;

	constructor(options: UsePrefersDarkOptions = {}) {
		this.#fallback = options.fallback ?? false;
		this.#mediaQuery = new MediaQuery("(prefers-color-scheme: dark)", this.#fallback);
	}

	/**
	 * Whether the user prefers dark mode
	 */
	get current(): boolean {
		return this.#mediaQuery.current;
	}
}

/**
 * Convenience function for creating a dark mode preference detector
 *
 * @param options - Configuration options
 * @returns A reactive dark mode preference detector
 * 
 * @example
 * ```svelte
 * <script>
 *   import { usePrefersDark } from "runed";
 *   
 *   const darkMode = usePrefersDark();
 * </script>
 * 
 * <div class:dark={darkMode.current}>
 *   {darkMode.current ? 'Dark mode' : 'Light mode'}
 * </div>
 * ```
 */
export function usePrefersDark(options: UsePrefersDarkOptions = {}): UsePrefersDark {
	return new UsePrefersDark(options);
}
