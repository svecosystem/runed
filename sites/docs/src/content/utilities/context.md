---
title: Context
description:
  A wrapper around Svelte's Context API that provides type safety and improved ergonomics for
  sharing data between components.
category: State
---

<script>
	import { Steps, Step, Callout } from '@svecodocs/kit';
</script>

Context allows you to pass data through the component tree without explicitly passing props through
every level. It's useful for sharing data that many components need, like themes, authentication
state, or localization preferences.

The `Context` class provides a type-safe way to define, set, and retrieve context values.

## Usage

<Steps>

<Step>Creating a Context</Step>

First, create a `Context` instance with the type of value it will hold:

```ts title="context.ts"
import { Context } from "runed";

export const myTheme = new Context<"light" | "dark">("theme");
```

Creating a `Context` instance only defines the context - it doesn't actually set any value. The
value passed to the constructor (`"theme"` in this example) is just an identifier used for debugging
and error messages.

Think of this step as creating a "container" that will later hold your context value. The container
is typed (in this case to only accept `"light"` or `"dark"` as values) but remains empty until you
explicitly call `myTheme.set()` during component initialization.

This separation between defining and setting context allows you to:

- Keep context definitions in separate files
- Reuse the same context definition across different parts of your app
- Maintain type safety throughout your application
- Set different values for the same context in different component trees

<Step>Setting Context Values</Step>

Set the context value in a parent component during initialization.

```svelte title="+layout.svelte"
<script lang="ts">
	import { myTheme } from "./context";
	let { data, children } = $props();

	myTheme.set(data.theme);
</script>

{@render children?.()}
```

<Callout>

Context must be set during component initialization, similar to lifecycle functions like `onMount`.
You cannot set context inside event handlers or callbacks.

</Callout>

<Step>Reading Context Values</Step>

Child components can access the context using `get()` or `getOr()`

```svelte title="+page.svelte"
<script lang="ts">
	import { myTheme } from "./context";

	const theme = myTheme.get();
	// or with a fallback value if the context is not set
	const theme = myTheme.getOr("light");
</script>
```

</Steps>

## Type Definition

```ts
class Context<TContext> {
	/**
	 * @param name The name of the context.
	 * This is used for generating the context key and error messages.
	 */
	constructor(name: string) {}

	/**
	 * The key used to get and set the context.
	 *
	 * It is not recommended to use this value directly.
	 * Instead, use the methods provided by this class.
	 */
	get key(): symbol;

	/**
	 * Checks whether this has been set in the context of a parent component.
	 *
	 * Must be called during component initialization.
	 */
	exists(): boolean;

	/**
	 * Retrieves the context that belongs to the closest parent component.
	 *
	 * Must be called during component initialization.
	 *
	 * @throws An error if the context does not exist.
	 */
	get(): TContext;

	/**
	 * Retrieves the context that belongs to the closest parent component,
	 * or the given fallback value if the context does not exist.
	 *
	 * Must be called during component initialization.
	 */
	getOr<TFallback>(fallback: TFallback): TContext | TFallback;

	/**
	 * Associates the given value with the current component and returns it.
	 *
	 * Must be called during component initialization.
	 */
	set(context: TContext): TContext;
}
```
