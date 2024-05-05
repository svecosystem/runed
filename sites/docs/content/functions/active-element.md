---
title: activeElement
description: A box holding the currently active element.
category: Elements
---

<script>
import Demo from '$lib/components/demos/active-element.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { activeElement } from "runed";
</script>

<p>
	Currently active element:
	{activeElement.value?.localName ?? "No active element found"}
</p>
```
