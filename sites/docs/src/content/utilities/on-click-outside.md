---
title: onClickOutside
description: Handle clicks outside of a specified element.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/on-click-outside.svelte';
import DemoDialog from '$lib/components/demos/on-click-outside-dialog.svelte';
</script>

`onClickOutside` detects clicks that occur outside a specified element's boundaries and executes a
callback function. It's commonly used for dismissible dropdowns, modals, and other interactive
components.

## Demo

<Demo />

## Basic Usage

```svelte
<script lang="ts">
	import { onClickOutside } from "runed";

	let container = $state<HTMLElement>()!;

	onClickOutside(
		() => container,
		() => console.log("clicked outside")
	);
</script>

<div bind:this={el}>
	<!-- Container content -->
</div>
<button>I'm outside the container</button>
```

## Advanced Usage

### Controlled Listener

The function returns control methods to programmatically manage the listener, `start` and `stop` and
a reactive read-only property `enabled` to check the current status of the listeners.

```svelte
<script lang="ts">
	import { onClickOutside } from "runed";

	let dialog = $state<HTMLDialogElement>()!;

	const clickOutside = onClickOutside(
		() => dialog,
		() => {
			dialog.close();
			clickOutside.stop();
		},
		{ immediate: false }
	);

	function openDialog() {
		dialog.showModal();
		clickOutside.start();
	}

	function closeDialog() {
		dialog.close();
		clickOutside.stop();
	}
</script>

<button onclick={openDialog}>Open Dialog</button>
<dialog bind:this={dialog}>
	<div>
		<button onclick={closeDialog}>Close Dialog</button>
	</div>
</dialog>
```

Here's an example of using `onClickOutside` with a `<dialog>`:

<DemoDialog />

## Options

### Immediate

By default, `onClickOutside` will start listening for clicks outside the element immediately. You
can opt to disabled this behavior by passing `{ immediate: false }` to the options argument.

```ts {4}
const clickOutside = onClickOutside(
	() => container,
	() => console.log("clicked outside"),
	{ immediate: false }
);

// later when you want to start the listener
clickOutside.start();
```

## Type Definitions

```ts
export type OnClickOutsideOptions = ConfigurableDocument & {
	/**
	 * Whether the click outside handler is enabled by default or not.
	 * If set to false, the handler will not be active until enabled by
	 * calling the returned `start` function
	 *
	 * @default true
	 */
	immediate?: boolean;
};

/**
 * A utility that calls a given callback when a click event occurs outside of
 * a specified container element.
 *
 * @template T - The type of the container element, defaults to HTMLElement.
 * @param {MaybeElementGetter<T>} container - The container element or a getter function that returns the container element.
 * @param {() => void} callback - The callback function to call when a click event occurs outside of the container.
 * @param {OnClickOutsideOptions} [opts={}] - Optional configuration object.
 * @param {ConfigurableDocument} [opts.document=defaultDocument] - The document object to use, defaults to the global document.
 * @param {boolean} [opts.immediate=true] - Whether the click outside handler is enabled by default or not.
 * @see {@link https://runed.dev/docs/utilities/on-click-outside}
 */
export declare function onClickOutside<T extends Element = HTMLElement>(
	container: MaybeElementGetter<T>,
	callback: (event: PointerEvent) => void,
	opts?: OnClickOutsideOptions
): {
	stop: () => boolean;
	start: () => boolean;
	/**
	 * Whether the click outside handler is currently enabled or not.
	 */
	readonly enabled: boolean;
};
```
