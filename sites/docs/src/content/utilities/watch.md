---
title: watch
description: Watch for changes and run a callback
category: Reactivity
---

Runes provide a handy way of running a callback when reactive values change:
[`$effect`](https://svelte-5-preview.vercel.app/docs/runes#$effect). It automatically detects when
inner values change, and re-runs the callback.

`$effect` is great, but sometimes you want to manually specify which values should trigger the
callback. Svelte provides an `untrack` function, allowing you to specify that a dependency
_shouldn't_ be tracked, but it doesn't provide a way to say that _only certain values_ should be
tracked.

`watch` does exactly that. It accepts a getter function, which returns the dependencies of the
effect callback.

## Usage

### watch

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

The callback receives two arguments: The current value of the sources, and the previous value.

<!-- prettier-ignore -->
```ts
let count = $state(0);
watch(() => count, (curr, prev) => {
		console.log(`count is ${curr}, was ${prev}`);
	}
);
```

You can also send in an array of sources:

<!-- prettier-ignore -->
```ts
let age = $state(20);
let name = $state("bob");
watch([() => age, () => name], ([age, name], [prevAge, prevName]) => {
  // ...
}
```

`watch` also accepts an `options` object.

```ts
watch(sources, callback, {
	// First run will only happen after sources change when set to true.
	// By default, its false.
	lazy: true
});
```

### watch.pre

`watch.pre` is similar to `watch`, but it uses
[`$effect.pre`](https://svelte-5-preview.vercel.app/docs/runes#$effect-pre) under the hood.

### watchOnce

In case you want to run the callback only once, you can use `watchOnce` and `watchOnce.pre`. It
functions identically to the `watch` and `watch.pre` otherwise, but it does not accept any options
object.
