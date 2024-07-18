---
title: NetworkStatus
description: Watch for network status changes.
category: Browser
---

<script>
import Demo from "$lib/components/demos/network-status.svelte";
import { Callout } from "$lib/components";
</script>

## Demo

To see it in action, try disabling and then re-enabling your Internet connection. If you're using
Google Chrome, you can also
[artificially throttle the network](https://developer.chrome.com/docs/devtools/settings/throttling)
to test its behavior under different conditions.

<Demo />

## Usage

You can use `NetworkStatus` in alongside [Previous](https://runed.dev/docs/utilities/previous) to
get both current and previous network status.

<Callout type="warning">

This utility must be used within a `browser` context. An `isSupported` property is available to
check if the API is supported on the current environment/device.

</Callout>

```svelte
<script lang="ts">
	import { NetworkStatus } from "runed";
	// checkout svelte-sonner for toasts (https://github.com/wobsoriano/svelte-sonner)
	import { toast } from "svelte-sonner";

	const networkStatus = new NetworkStatus();
	const previousNetworkStatus = new Previous(() => ({
		online: networkStatus.online,
		updatedAt: networkStatus.updatedAt
	}));

	$effect(() => {
		if (!networkStatus.isSupported) return;

		if (networkStatus.online === false) {
			toast.error("No internet connection.");
		}
		if (networkStatus.effectiveType === "2g") {
			toast.warning("You are experiencing a slow connection.");
		}
		if (networkStatus.online === true && previousNetworkStatus.current?.online === false) {
			toast.success("You are back online!");
		}
	});
</script>

{#if networkStatus.isSupported}
	<p>online: {networkStatus.online}</p>
{:else}
	<p>Network Status is currently not available.</p>
{/if}
```

### isSupported

It's important to check if the API is supported on the current environment/device before using it.

```ts
const networkStatus = new NetworkStatus();

if (networkStatus.isSupported) {
	// do something with the network status
}

```

### Previous

It's often useful to get the previous status of the network connection. You can use the
[Previous](https://runed.dev/docs/utilities/previous) utility to track the previous state.

```ts
const networkStatus = new NetworkStatus();
const previousNetworkStatus = new Previous(() => ({
	online: networkStatus.online,
	updatedAt: networkStatus.updatedAt
}));
```

## Reference

The returned status always includes `online` and `updatedAt`. Other properties are returned based on
the
[NetworkInformation](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation#instance_properties)
interface and depend on
[your browser's compatibility](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation#browser_compatibility).

```typescript
interface NetworkStatus {
	online: boolean;
	updatedAt: Date;
	downlink?: number;
	downlinkMax?: number;
	effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
	rtt?: number;
	saveData?: boolean;
	type?: "bluetooth" | "cellular" | "ethernet" | "none" | "wifi" | "wimax" | "other" | "unknown";
}
```
