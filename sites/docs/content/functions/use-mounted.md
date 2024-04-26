---
title: useMounted
description: A function that returns the mounted state of the component it's called in.
---

<script>
import { UseMountedDemo } from '$lib/components/demos';
</script>

## Demo

<UseMountedDemo />

## Usage

```svelte
<script lang="ts">
	import { useMounted } from "runed";

	const isMounted = useMounted();
</script>
```

Which is a shorthand for one of the following:

```svelte
<script lang="ts">
	import { box } from "runed";
	import { onMount } from "svelte";

	const isMounted = box(false);

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

	const isMounted = box(false);

	$effect(() => {
		untrack(() => (isMounted.value = true));
	});
</script>
```
