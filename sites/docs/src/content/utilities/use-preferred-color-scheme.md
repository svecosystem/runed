---
title: usePreferredColorScheme
description: Detect color scheme preference using the browser's prefers-color-scheme media query.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/use-preferred-color-scheme.svelte';
</script>

`usePreferredColorScheme` provides a reactive string that reflects the user's color scheme
preference based on their browser or OS settings. It uses the
[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
media query and updates automatically when the preference changes.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { usePreferredColorScheme } from "runed";

	const colorScheme = usePreferredColorScheme();
	const colorSchemeWithDarkFallback = usePreferredColorScheme({ fallback: "dark" });
	const colorSchemeWithLightFallback = usePreferredColorScheme({ fallback: "light" });
</script>

<div class:dark={colorScheme.current === "dark"} class:light={colorScheme.current === "light"}>
	{colorScheme.current === "dark"
		? "🌙 Dark mode"
		: colorScheme.current === "light"
			? "☀️ Light mode"
			: "🎨 No preference"}
</div>

<!-- During SSR, these will show the specified fallback values -->
<div class:dark={colorSchemeWithDarkFallback.current === "dark"}>
	{colorSchemeWithDarkFallback.current === "dark" ? "🌙 Dark mode (fallback)" : "☀️ Light mode"}
</div>

<div class:light={colorSchemeWithLightFallback.current === "light"}>
	{colorSchemeWithLightFallback.current === "light" ? "☀️ Light mode (fallback)" : "🌙 Dark mode"}
</div>
```

## Type Definition

```ts
type ColorSchemeType = "dark" | "light" | "no-preference";

type UsePreferredColorSchemeOptions = {
	/**
	 * Fallback value for server-side rendering
	 * @defaultValue "no-preference"
	 */
	fallback?: ColorSchemeType;
};

function usePreferredColorScheme(options?: UsePreferredColorSchemeOptions): {
	readonly current: ColorSchemeType;
};
```

## Notes

- Uses the `prefers-color-scheme: dark` and `prefers-color-scheme: light` media queries.
- Returns "dark", "light", or "no-preference" based on user's system preference.
- During server-side rendering, returns the specified fallback value (defaults to "no-preference").
- Automatically updates when user changes their system color scheme preference.
- Works with both light and dark theme preferences and detects when no preference is set.
