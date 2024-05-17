---
title: watch
description: Watch for changes and run a callback
category: Reactivity
---

## Description

Runes provide a handy way of running a callback when reactive values change:
[`$effect`](https://svelte-5-preview.vercel.app/docs/runes#$effect). It automatically detects when
inner values change, and re-runs the callback.

`$effect` is great, but sometimes you want to manually specify which values should trigger the
callback. Svelte provides an `untrack` function, allowing you to specify that a dependency
_shouldn't_ be tracked, but it doesn't provide a way to say that _only certain values_ should be
tracked.

`watch` does exactly that. It accepts a getter function, which returns the dependencies of the effect callback.

## Usage

### `watch`

Runs a callback whenever one of the sources change.

<!-- prettier-ignore -->
```ts
import { watch } from "runed";

let count = $state(0);
watch(() => count, () => {
		console.log(count);
	}
);
```

It also accepts an array of sources.

```ts
let age = $state(24);
let name = $state("Thomas");
watch([() => age, () => name], () => {
	console.log(`${name} is ${age} years old`);
});
```

The callback receives two arguments: The current value of the sources, and the previous value.

<!-- prettier-ignore -->
```ts
let count = $state(0);
watch(() => count, (curr, prev) => {
		console.log(`count is ${curr}, was ${prev}`);
	}
);
```

`watch` also accepts an `options` object.

```ts
watch(sources, callback, {
	lazy: true, // First run will only happen after sources change
	once: true // Will only run once
});
```

### `watch.pre`

`watch.pre` is similar to `watch`, but it uses
[`$effect.pre`](https://svelte-5-preview.vercel.app/docs/runes#$effect-pre) under the hood.
