---
title: boolAttr
description:
  A utility that transforms any value into `""` (empty string) or `undefined` for use with HTML
  attributes where presence indicates truth.
category: Utilities
---

The `boolAttr` utility transforms any value into either an empty string (`""`) or `undefined` for
use with HTML attributes where presence indicates truth. This is essential for creating proper
boolean attributes in HTML, where the presence of the attribute (regardless of value) indicates a
truthy state.

## Problem

When using boolean values directly in Svelte attributes, they often render as string values:

```svelte
<!-- This renders as: <div data-active="true"> -->
<div data-active={true}>Content</div>

<!-- This renders as: <div data-active="false"> -->
<div data-active={false}>Content</div>
```

This creates issues with CSS selectors and attribute-based styling, as both cases result in the
attribute being present.

## Solution

`boolAttr` ensures proper boolean attribute behavior:

```svelte
<script lang="ts">
	import { boolAttr } from "runed";

	let isActive = $state(true);
	let isLoading = $state(false);
</script>

<!-- Renders as: <div data-active> -->
<div data-active={boolAttr(isActive)}>Active content</div>

<!-- Renders as: <div> (no data-loading attribute) -->
<div data-loading={boolAttr(isLoading)}>Loading content</div>
```

## Type Definition

```ts
function boolAttr(value: unknown): "" | undefined;
```

### Parameters

- **`value`** (`unknown`) - Any value to be converted to a boolean attribute

### Returns

- **`""`** (empty string) - When `value` is truthy
- **`undefined`** - When `value` is falsy
