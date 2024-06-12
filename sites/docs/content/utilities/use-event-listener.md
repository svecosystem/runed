---
title: useEventListener
description: A function that attaches an automatically disposed event listener.
category: Browser
---

<script>
import Demo from '$lib/components/demos/use-event-listener.svelte';
</script>

## Demo

<Demo />

## Usage

This is better utilized in elements that you don't have direct control over. Otherwise, use normal
event listeners.

For example, if you want to listen to a click event on the body, and can't use `<svelte:body />`, or
you have an element reference that was passed down.

```ts
// ClickLogger.ts
import { useEventListener } from "runed";

export class ClickLogger() {
	#clicks = $state(0)

	constructor() {
		useEventListener(document.body, "click", () => this.#clicks++);
	}

	get clicks() {
		return this.#clicks
	}
}
```

```svelte
<script lang="ts">
	import { ClickLogger } from "./ClickLogger.ts";

	const logger = new ClickLogger();
</script>

<p>You've clicked the document {logger.clicks} {logger.clicks === 1 ? "time" : "times"}</p>
```
