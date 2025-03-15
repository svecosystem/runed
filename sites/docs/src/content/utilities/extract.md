---
title: extract
description: Resolve the value of a getter or static variable
category: Reactivity
---

As you'll see throughout Runed and other libraries, a common way of passing reactive state through
boundaries is using getters.

```ts
// For example...
import { Previous } from "runed";

let count = $state(0);
const previous = new Previous(() => count);
```

Sometimes though, these functions accept a value that can also be static, or even `undefined`.

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

It can be a bit troublesome to deal with these values inside utility functions.

```ts
setTimeout(
    /* ... */,
    typeof wait === "function" ? (wait() ?? 250) : (wait ?? 250)
);
```

This is where `extract` comes in.

## Usage

When receiving a `Getter` or `MaybeGetter`, `extract` is best used in the following way:

```ts
import { extract } from "runed";
/**
 * @param intervalProp the wait in ms between confetti. Defaults to 100
 */
function throwConfetti(intervalProp?: MaybeGetter<number | undefined>) {
	const interval = $derived(extract(prop, 100));
	// ...
}
```

Here's how it works.

- If `intervalProp` is a `number`, `interval` will be equal to `intervalProp`
- If `intervalProp` is `undefined`, `interval` will be equal to `100`
- If `intervalProp` is a function that returns a `number`, `interval` will be equal to the returned
  value of `intervalProp`
- If `intervalProp` is a function that returns `undefined`, `interval` will be equal to `100`

The default value is optional, however. In this case, if you omitted it, `interval` would be typed
as `number | undefined`. Otherwise, its typed as `number`.
