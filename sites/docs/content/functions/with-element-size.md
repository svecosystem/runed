---
title: WithElementSize
description: A higher-order function that debounces the execution of a function.
---

<script>
import { WithElementSizeDemo } from '$lib/components/demos';
</script>

## Demo

<WithElementSizeDemo />

## Usage

```svelte
<script lang="ts">
	import { withElementSize } from "withrunes";

	let count = $state(0);
	let logged = $state("");
	let isFirstTime = $state(true);

	const logCount = withElementSize(() => {
		if (isFirstTime) {
			isFirstTime = false;
			logged = `You pressed the button ${count} times!`;
		} else {
			logged = `You pressed the button ${count} times since last time!`;
		}
		count = 0;
	}, 1000);

	function ding() {
		count++;
		logCount();
	}
</script>

<div>
	<button onclick={ding}>DING DING DING</button>
	<p>{logged || "Press the button!"}</p>
</div>
```
