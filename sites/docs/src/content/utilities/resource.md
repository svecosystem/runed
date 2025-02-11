---
title: resource
description: Watch for changes and runs async data fetching
category: Reactivity
---

<script>
import Demo from '$lib/components/demos/resource.svelte';
import { Callout } from '@svecodocs/kit'
</script>

In SvelteKit, using load functions is the primary approach for data fetching. While you can handle
reactive data fetching by using `URLSearchParams` for query parameters, there are cases where you
might need more flexibility at the component level.

This is where `resource` comes in - it's a utility that seamlessly combines reactive state
management with async data fetching.

Built on top of `watch`, it runs after rendering by default, but also provides a pre-render option
via `resource.pre()`.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { resource } from "runed";

	let id = $state(1);

	const searchResource = resource(
		() => id,
		async (id, prevId, { data, refetching, onCleanup, signal }) => {
			// data: the previous value returned from the fetcher

			// refetching: whether the fetcher is currently refetching
			// or it can be the value you passed to refetch()

			// onCleanup: A cleanup function that will be called when the source is invalidated
			// and the fetcher is about to re-run

			// signal: AbortSignal for cancelling fetch requests
			const response = await fetch(`api/posts?id=${id}`, { signal });
			return response.json();
		},
		{
			debounce: 300
			// lazy: Skip initial fetch when true
			// once: Only fetch once when true
			// initialValue: Provides an initial value for the resource
			// debounce: Debounce rapid changes
			// throttle: Throttle rapid changes
		}
	);

	// The current value of the resource
	searchResource.current;
	// Whether the resource is currently loading
	searchResource.loading;
	// Error if the fetch failed
	searchResource.error;
	// Update the resource value directly, useful for optimistic updates
	searchResource.mutate();
	// Re-run the fetcher with current watching values
	searchResource.refetch();
</script>

<input type="number" bind:value={id} />

{#if searchResults.loading}
	<div>Loading...</div>
{:else if searchResults.error}
	<div>Error: {searchResults.error.message}</div>
{:else}
	<ul>
		{#each searchResults.current ?? [] as result}
			<li>{result.title}</li>
		{/each}
	</ul>
{/if}
```

## Features

- **Automatic Request Cancellation**: When dependencies change, in-flight requests are automatically
  canceled
- **Loading & Error States**: Built-in states for loading and error handling
- **Debouncing & Throttling**: Optional debounce and throttle options for rate limiting
- **Type Safety**: Full TypeScript support with inferred types
- **Multiple Dependencies**: Support for tracking multiple reactive dependencies
- **Custom Cleanup**: Register cleanup functions that run before refetching
- **Pre-render Support**: `resource.pre()` for pre-render execution

## Advanced Usage

### Multiple Dependencies

```svelte
<script lang="ts">
	const results = resource([() => query, () => page], async ([query, page]) => {
		const res = await fetch(`/api/search?q=${query}&page=${page}`);
		return res.json();
	});
</script>
```

### Custom Cleanup

```svelte
<script lang="ts">
	const stream = resource(
		() => streamId,
		async (id, _, { signal, onCleanup }) => {
			const eventSource = new EventSource(`/api/stream/${id}`);
			onCleanup(() => eventSource.close());

			const res = await fetch(`/api/stream/${id}/init`, { signal });
			return res.json();
		}
	);
</script>
```

### Pre-render Execution

```svelte
<script lang="ts">
	const data = resource.pre(
		() => query,
		async (query) => {
			const res = await fetch(`/api/search?q=${query}`);
			return res.json();
		}
	);
</script>
```

## Configuration Options

### `lazy`

When true, skips the initial fetch. The resource will only fetch when dependencies change or
`refetch()` is called.

### `once`

When true, only fetches once. Subsequent dependency changes won't trigger new fetches.

### `initialValue`

Provides an initial value for the resource before the first fetch completes. Useful if you already
have the data and don't want to wait for the fetch to complete.

### `debounce`

Time in milliseconds to debounce rapid changes. Useful for search inputs.

The debounce implementation will cancel pending requests and only execute the last one after the
specified delay.

### `throttle`

Time in milliseconds to throttle rapid changes. Useful for real-time updates.

The throttle implementation will ensure that requests are spaced at least by the specified delay,
returning the pending promise if called too soon.

<Callout>
Note that you should use either debounce or throttle, not both - if both are specified, debounce takes precedence.
</Callout>

## Type Definitions

```ts
type ResourceOptions<Data> = {
	/** Skip initial fetch when true */
	lazy?: boolean;
	/** Only fetch once when true */
	once?: boolean;
	/** Initial value for the resource */
	initialValue?: Data;
	/** Debounce time in milliseconds */
	debounce?: number;
	/** Throttle time in milliseconds */
	throttle?: number;
};

type ResourceState<Data> = {
	/** Current value of the resource */
	current: Data | undefined;
	/** Whether the resource is currently loading */
	loading: boolean;
	/** Error if the fetch failed */
	error: Error | undefined;
};

type ResourceReturn<Data, RefetchInfo = unknown> = ResourceState<Data> & {
	/** Update the resource value directly */
	mutate: (value: Data) => void;
	/** Re-run the fetcher with current values */
	refetch: (info?: RefetchInfo) => Promise<Data | undefined>;
};

type ResourceFetcherRefetchInfo<Data, RefetchInfo = unknown> = {
	/** Previous data return from fetcher */
	data: Data | undefined;
	/** Whether the fetcher is currently refetching or it can be the value you passed to refetch. */
	refetching: RefetchInfo | boolean;
	/** A cleanup function that will be called when the source is invalidated and the fetcher is about to re-run */
	onCleanup: (fn: () => void) => void;
	/** AbortSignal for cancelling fetch requests */
	signal: AbortSignal;
};

type ResourceFetcher<Source, Data, RefetchInfo = unknown> = (
	/** Current value of the source */
	value: Source extends Array<unknown>
		? {
				[K in keyof Source]: Source[K];
			}
		: Source,
	/** Previous value of the source */
	previousValue: Source extends Array<unknown>
		? {
				[K in keyof Source]: Source[K];
			}
		: Source | undefined,
	info: ResourceFetcherRefetchInfo<Data, RefetchInfo>
) => Promise<Data>;

function resource<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
	> = ResourceFetcher<Source, any, RefetchInfo>
>(
	source: Getter<Source>,
	fetcher: Fetcher,
	options?: ResourceOptions<Awaited<ReturnType<Fetcher>>>
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo>;
```
