---
title: Getting Started
description: Learn how to install and use Runed in your projects.
---

## Installation

Install Runed using your favorite package manager:

```bash
npm install runed
```

## Usage

Import one of the utilities you need to either a `.svelte` or `.svelte.js|ts` file and start using
it:

```svelte title="component.svelte"
<script lang="ts">
	import { activeElement } from "runed";

	let inputElement = $state<HTMLInputElement | undefined>();
</script>

<input bind:this={inputElement} />

{#if activeElement.current}
	The input element is active!
{/if}
```

or

```ts title="some-module.svelte.ts"
import { activeElement } from "runed";

function logActiveElement() {
	$effect(() => {
		console.log("Active element is ", activeElement.current);
	});
}

logActiveElement();
```
