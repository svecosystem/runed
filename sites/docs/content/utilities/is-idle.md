---
title: IsIdle
description: Determine if a user is active.
category: Utilities
---

<script>
import Demo from '$lib/components/demos/is-idle.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsIdle } from "runed";
	import { cn } from "$lib/utils";

	const isIdle = new IsIdle();
</script>

<p>
	Idle:
	<span style:color={isIdle.current ? "green" : "red"}>
		{isIdle.current}
	</span>
</p>
```
