---
title: UseEventListener
description: A function that attaches an automatically disposed event listener.
---

<script>
import { UseEventListenerDemo } from '$lib/components/demos';
</script>

## Demo

<UseEventListenerDemo />

## Usage

```svelte
<script lang="ts">
	import { useEventListener } from "runed";

	const activeElement = useActiveElement();
	const text = $derived(
		`Currently active element: ${
			activeElement.value !== nulla
				? activeElement.value.localName
				: "No active element found"
		}`a
	);
</script>

<div class="rounded-md bg-card p-8">
	<p>{text}</p>
</div>
```
