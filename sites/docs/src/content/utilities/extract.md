---
title: extract
description: Resolve the value of a getter or static variable
category: Reactivity
---

In libraries like Runed, it's common to pass state reactively using getters (functions that return a
value), a common pattern to pass reactivity across boundaries.

```ts
// For example...
import { Previous } from "runed";

let count = $state(0);
const previous = new Previous(() => count);
```

However, some APIs accept either a reactive getter or a static value (including `undefined`):

```ts
let search = $state("");
let debounceTime = $state<number | undefined>(500);

// with a reactive value
const d1 = new Debounced(
	() => search,
	() => debounceTime
);

// with a static value
const d2 = new Debounced(() => search, 500);

// no defined value
const d3 = new Debounced(() => search);
```

When writing utility functions, dealing with both types can lead to verbose and repetitive logic:

```ts
setTimeout(
    /* ... */,
    typeof wait === "function" ? (wait() ?? 250) : (wait ?? 250)
);
```

This is where `extract` comes in.

## Usage

The `extract` utility resolves either a getter or static value to a plain value. This helps you
write cleaner, safer utilities.

```ts
import { extract } from "runed";

/**
 * Triggers confetti at a given interval.
 * @param intervalProp Time between confetti bursts, in ms. Defaults to 100.
 */
function throwConfetti(intervalProp?: MaybeGetter<number | undefined>) {
	const interval = $derived(extract(intervalProp, 100));
	// ...
}
```

## Behavior

Given a `MaybeGetter<T>`, `extract(input, fallback)` resolves as follows:

| Case                                        | Result                      |
| ------------------------------------------- | --------------------------- |
| `input` is a value                          | Returns the value           |
| `input` is `undefined`                      | Returns the fallback        |
| `input` is a function returning a value     | Returns the function result |
| `input` is a function returning `undefined` | Returns the fallback        |

The fallback is _optional_. If you omit it, `extract()` returns `T | undefined`.

## Types

```ts
function extract<T>(input: MaybeGetter<T | undefined>, fallback: T): T;
function extract<T>(input: MaybeGetter<T | undefined>): T | undefined;
```
