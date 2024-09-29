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

The `useEventListener` function is particularly useful for attaching event listeners to elements you
don't directly control. For instance, if you need to listen for events on the document body or
window and can't use `<svelte:body />`, or if you receive an element reference from a parent
component.

### Example: Tracking Clicks on the Document

```ts
// ClickLogger.ts
import { useEventListener } from "runed";

export class ClickLogger {
	#clicks = $state(0);

	constructor() {
		useEventListener(
			() => document.body,
			"click",
			() => this.#clicks++
		);
	}

	get clicks() {
		return this.#clicks;
	}
}
```

This `ClickLogger` class tracks the number of clicks on the document body using the
`useEventListener` function. Each time a click occurs, the internal counter increments.

### Svelte Component Usage

```svelte
<script lang="ts">
	import { ClickLogger } from "./ClickLogger.ts";

	const logger = new ClickLogger();
</script>

<p>
	You've clicked the document {logger.clicks}
	{logger.clicks === 1 ? "time" : "times"}
</p>
```

In the component above, we create an instance of the `ClickLogger` class to monitor clicks on the
document. The displayed text updates dynamically based on the recorded click count.

### Key Points

- **Automatic Cleanup:** The event listener is removed automatically when the component is destroyed
  or when the element reference changes.
- **Lazy Initialization:** The target element can be defined using a function, enabling flexible and
  dynamic behavior.
- **Convenient for Global Listeners:** Ideal for scenarios where attaching event listeners directly
  to the DOM elements is cumbersome or impractical.
