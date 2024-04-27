---
title: useActiveElement
description: A function that returns the currently active element.
category: Elements
---

<script>
import { UseActiveElementDemo } from '$lib/components/demos';
</script>

## Demo

<UseActiveElementDemo />

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
