---
title: useBreakpoints
description: React to changes in the viewport with custom defined breakpoints.
category: Browser
---

<script>
import Demo from '$lib/components/demos/use-breakpoints.svelte';
</script>

## Demo

<Demo />

## Overview

`useBreakpoints` is a utility that allows you to react to changes in the viewport with custom
defined breakpoints. By default, it uses the Tailwind CSS breakpoints.

## Usage

```svelte
<script lang="ts">
	import { useBreakpoints } from "runed";

	const breakpoints = useBreakpoints();
</script>

{#if breakpoints.sm}
	<p>Small screen</p>
{/if}

{#if breakpoints.md}
	<p>Medium screen</p>
{/if}
```

## Examples

### Defining Custom Breakpoints

```svelte
<script lang="ts">
	import { useBreakpoints } from "runed";

	const breakpoints = useBreakpoints({
		custom: "100rem"
	});
</script>

{#if breakpoints.custom}
	<p>Custom breakpoint</p>
{/if}
```
