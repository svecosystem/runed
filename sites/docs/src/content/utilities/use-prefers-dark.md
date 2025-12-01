---
title: usePrefersDark
description: Detect dark mode preference using the browser's prefers-color-scheme media query.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/use-prefers-dark.svelte';
</script>

`usePrefersDark` provides a reactive boolean that reflects whether the user prefers dark mode based
on their browser or OS settings. It uses the
[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
media query and updates automatically when the preference changes.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { usePrefersDark } from "runed";

	const darkMode = usePrefersDark();
</script>

<div class:dark={darkMode.current}>
	{darkMode.current ? "🌙 Dark mode" : "☀️ Light mode"}
</div>
```

You can also use the class directly:

```svelte
<script lang="ts">
	import { UsePrefersDark } from "runed";

	const darkMode = new UsePrefersDark({ fallback: false });
</script>

<p>Dark mode preferred: {darkMode.current ? "Yes" : "No"}</p>
```

## Type Definition

```ts
type UsePrefersDarkOptions = {
	/**
	 * Fallback value for server-side rendering
	 * @defaultValue false
	 */
	fallback?: boolean;
};

class UsePrefersDark {
	constructor(options?: UsePrefersDarkOptions);
	readonly current: boolean; // true when dark mode is preferred
}

function usePrefersDark(options?: UsePrefersDarkOptions): UsePrefersDark;
```

## Notes

- Uses the `prefers-color-scheme: dark` media query.
- During server-side rendering, returns the fallback value (defaults to `false`).
- Automatically updates when user changes their system dark mode preference.
- Works with both light and dark theme preferences.
