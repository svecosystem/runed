---
title: useSupported
description: Determine if a feature is supported by the environment before using it.
---

## Usage

```svelte
<script lang="ts">
	import { useSupported } from "runed";

	const isSupported = useSupported(() => navigator && "geolocation" in navigator);

	if (isSupported.value) {
		// Do something with the geolocation API
	}
</script>
```
