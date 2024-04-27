---
title: Box
description: Box your state and take it anywhere
category: State
---

<script>
import { UseActiveElementDemo } from '$lib/components/demos';
</script>

## Description

Runes for state are primitives. They provide a concise syntax for local reactivity. However, when we
send these state primitives across boundaries (e.g. in function arguments), the state loses it's
reactivity and becomes a static value.

Boxes provide several utilities to make passing reactive state across boundaries easier.

## Usage

### `box`

Initializes a writable boxed state.

```svelte
<script lang="ts">
	import { box } from "runed";

	const count = box(0);
</script>

<button onclick={() => count.value++}>
	clicks: {count.value}
</button>
```

### `box.with`

Creates reactive state using getter and setter functions. If a setter function is provided, the box
is writable. If not, the box is readonly.

Useful for passing synced reactive values across boundaries.

```svelte
<script lang="ts">
	import { type WritableBox, box } from "runed";

	function useCounter(count: WritableBox<number>) {
		return {
			increment() {
				count.value++;
			},
			// We pass a box that doubles the count value
			double: box.with(() => count.value * 2)
		};
	}

	let count = $state(0);
	// We pass count to box.with so it stays in sync
	const { double, increment } = useCounter(
		box.with(
			() => count.value,
			(v) => (count = v)
		)
	);
</script>

<button onclick={increment}>
	clicks: {count}
	double: {double.value}
</button>
```

### `box.from`

Creates a box from an existing box, a getter function, or a static value.

Useful for receiving arguments that may or may not be reactive.

```svelte
<script lang="ts">
	import { box } from "runed";

	function useCounter(_count: WritableBox<number> | number) {
		const count = box.from(_count);

		return {
			count,
			increment() {
				count.value++;
			},
			// We pass a box that doubles the count value
			double: box.with(() => count.value * 2)
		};
	}

	const counter1 = useCounter(1);
	console.log(counter1.count.value); // 1
	console.log(counter1.double.value); // 2

	const counter2 = useCounter(box(2));
	console.log(counter2.count.value); // 2
	console.log(counter2.double.value); // 4

	function useDouble(_count: number | (() => number) | ReadableBox<number>) {
		const count = box.from(_count);

		return box.with(() => count.value * 2);
	}

	const double1 = useDouble(1);
	console.log(double1.value); // 2

	const double2 = useDouble(box(2));
	console.log(double2.value); // 4

	const double3 = useDouble(() => counter1.count.value);
	console.log(double3.value); // 2
</script>
```

### `box.flatten`

Transforms any boxes within an object to reactive properties, removing the need to access each
property with `.value`.

```ts
const count = box(1);
const flat = box.flatten({
	count,
	double: box.with(() => count.value * 2),
	increment() {
		count.value++;
	}
});

console.log(flat.count); // 1
console.log(flat.double); // 2
flat.increment();
console.log(flat.count); // 2
```

### `box.readonly`

Creates a readonly box from a writable box that remains in sync with the original box.

```ts
const count = box(1);
const readonlyCount = box.readonly(count);
console.log(readonlyCount.value); // 1
count.value++;
console.log(readonlyCount.value); // 2

readonlyCount.value = 3; // Error: Cannot assign to read only property 'value' of object
```

### `box.isBox`

Checks if a value is a `Box`.

```ts
const count = box(1);
console.log(box.isBox(count)); // true
console.log(box.isBox(1)); // false
```

### `box.isWritableBox`

Checks if a value is a `WritableBox`.

```ts
const count = box(1);
const double = box.with(() => count.value * 2);
console.log(box.isWritableBox(count)); // true
console.log(box.isWritableBox(double)); // false
```
