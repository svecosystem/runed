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

To see it in action, try disabling and then re-enabling your Internet connection.
If you're using Google Chrome, you can
also [artificially throttle the network](https://developer.chrome.com/docs/devtools/settings/throttling) to test its
behavior under different conditions.

<Demo />

## Usage

You can use `useNetworkStatus()` to retrieve both current and previous network status.
It must be used within the `browser` context, otherwise it will return `null`.

```svelte
<script lang="ts">
	import { useNetworkStatus } from "runed";
	import { toast } from "svelte-sonner";

	const networkStatus = new NetworkStatus();
	const previousNetworkStatus = new Previous(() => ({
		online: networkStatus.online,
		updatedAt: networkStatus.updatedAt,
	}));

	$effect(() => {
		if (!networkStatus.isSupported) {
			return;
		}
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

### Current

You can get the current status by calling the `current` method.

```ts
const networkStatus = useNetworkStatus();

networkStatus.current;
```

### Previous

You can get the previous status by calling the `previous` method.
It defaults to `undefined` if the network status hasn't been updated since the component mounted.

```ts
const networkStatus = useNetworkStatus();

networkStatus.previous;
```

## Reference

The returned status always includes `online` and `updatedAt`.
Other properties are returned based on
the [NetworkInformation](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation#instance_properties)
interface and depend
on [your browser's compatibility](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation#browser_compatibility).

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



