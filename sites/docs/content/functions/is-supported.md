---
title: IsSupported
description: Determine if a feature is supported by the environment before using it.
category: Utilities
---

## Usage

```svelte
<script lang="ts">
	import { IsSupported } from "runed";

	const isSupported = new IsSupported(() => navigator && "geolocation" in navigator);

	if (isSupported.value) {
		// Do something with the geolocation API
	}
</script>
```
