---
title: activeElement
description: An object holding the currently active element.
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
	{activeElement.current?.localName ?? "No active element found"}
</p>
```
