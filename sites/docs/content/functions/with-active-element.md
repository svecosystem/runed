---
title: WithActiveElement
description: A function that returns the currently active element.
---

<script>
import { WithActiveElementDemo } from '$lib/components/demos';
</script>

## Demo

<WithActiveElementDemo />

## Usage

```svelte
<script lang="ts">
	import { withActiveElement } from "runed";

	const activeElement = withActiveElement();
</script>

<div class="rounded-md bg-card p-8">
	<p>
		Currently active element:
		<span class="font-bold">
			{activeElement.value !== null
				? activeElement.value.localName
				: "No active element found"}
		</span>
	</p>
</div>
```
