---
title: useActiveElement
description: A function that returns the currently active element.
category: Elements
---

<script>
import Demo from '$lib/components/demos/use-active-element.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useActiveElement } from "runed";

	const activeElement = useActiveElement();
</script>

<p>
	Currently active element:
	{activeElement.value?.localName ?? "No active element found"}
</p>
```
