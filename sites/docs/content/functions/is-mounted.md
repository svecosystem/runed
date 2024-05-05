---
title: IsMounted
description: A class that returns the mounted state of the component it's called in.
category: Component
---

<script>
import Demo from '$lib/components/demos/is-mounted.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsMounted } from "runed";

	const isMounted = new IsMounted();
</script>
```

Which is a shorthand for one of the following:

```svelte
<script lang="ts">
	import { onMount } from "svelte";

	const isMounted = $state({value: false});

	onMount(() => {
		isMounted.value = true;
	});
</script>
```

or

```svelte
<script lang="ts">
	import { box } from "runed";
	import { untrack } from "svelte";

	const isMounted = $state({value: false});

	$effect(() => {
		untrack(() => (isMounted.value = true));
	});
</script>
```
