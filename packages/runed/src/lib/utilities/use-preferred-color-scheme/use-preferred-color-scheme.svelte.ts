import { MediaQuery } from "svelte/reactivity";

export type ColorSchemeType = "dark" | "light" | "no-preference";

export type UsePreferredColorSchemeOptions = {
	/**
	 * Fallback value for server-side rendering
	 * @defaultValue "no-preference"
	 */
	fallback?: ColorSchemeType;
};

/**
 * Reactive prefers-color-scheme media query.
 *
 * @see https://runed.dev/docs/utilities/use-preferred-color-scheme
 */
export function usePreferredColorScheme(options?: UsePreferredColorSchemeOptions) {
	const { fallback = "no-preference" } = options ?? {};

	// Map ColorSchemeType fallback to boolean values for MediaQuery
	const isLightFallback = fallback === "light";
	const isDarkFallback = fallback === "dark";

	const isLight = new MediaQuery("(prefers-color-scheme: light)", isLightFallback);
	const isDark = new MediaQuery("(prefers-color-scheme: dark)", isDarkFallback);
	const current = $derived.by<ColorSchemeType>(() => {
		if (isDark.current) return "dark";
		if (isLight.current) return "light";
		return "no-preference";
	});
	return {
		get current() {
			return current;
		},
	};
}
