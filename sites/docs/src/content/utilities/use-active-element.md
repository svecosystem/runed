---
title: useActiveElement
description: Get a reactive reference to the currently focused element in the document.
category: Elements
---

<script>
	import Demo from '$lib/components/demos/use-active-element.svelte';
	import { PropField } from '@svecodocs/kit'
</script>

`useActiveElement` is used to get the currently focused element in the document.

If you don't need to provide a custom `document` / `shadowRoot`, you can use the
[`activeElement`](/docs/utilities/active-element) state instead, as it provides a simpler API.

This utility behaves similarly to `document.activeElement` but with additional features such as:

- Updates synchronously with DOM focus changes
- Returns `null` when no element is focused
- Safe to use with SSR (Server-Side Rendering)
- Lightweight alternative to manual focus tracking

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useActiveElement } from "runed";
	const activeElement = useActiveElement();
</script>

{#if activeElement.current}
	<p>The active element is: {activeElement.current.localName}</p>
{:else}
	<p>No active element found</p>
{/if}
```

## Options

The following options can be passed via the first argument to `useActiveElement`:

<PropField name="document" type="DocumentOrShadowRoot" defaultValue="document">
The document or shadow root to track focus within.
</PropField>

<PropField name="window" type="Window" defaultValue="window">
The window to use for focus tracking.
</PropField>
