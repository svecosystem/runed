<script lang="ts">
	import { NetworkStatus, Previous } from "runed";
	import { toast } from "svelte-sonner";
	import DemoContainer from "$lib/components/demo-container.svelte";

	const networkStatus = new NetworkStatus();
	const previousNetworkStatus = new Previous(() => ({
		online: networkStatus.online,
		updatedAt: networkStatus.updatedAt,
	}));

	const timeOffline = $derived.by(() => {
		if (!networkStatus.isSupported) return 0;
		const now = networkStatus.updatedAt;
		const prev = previousNetworkStatus.current?.updatedAt;
		if (!now || !prev) return 0;

		const differenceMs = now.getTime() - prev.getTime();
		if (differenceMs < 0) return 0;
		const differenceSeconds = differenceMs / 1000;
		return Math.round(differenceSeconds);
	});

	const slowSpeeds = ["slow-2g", "2g", "3g"];

	$effect(() => {
		if (!networkStatus.isSupported) return;

		if (networkStatus.online === false) {
			toast.error("No internet connection. Reconnect to continue using the app.");
		}
		if (networkStatus.effectiveType && slowSpeeds.includes(networkStatus.effectiveType)) {
			toast.warning(
				"You are experiencing a slow connection. Some features may take longer to load."
			);
		}
		if (networkStatus.online === true && previousNetworkStatus.current?.online === false) {
			toast.success(
				`You are back online! Catch up with what you missed during your ${timeOffline} seconds offline.`
			);
		}
	});

	const networkStatusCombined = $derived({
		online: networkStatus.online,
		updatedAt: networkStatus.updatedAt,
		effectiveType: networkStatus.effectiveType,
		downlink: networkStatus.downlink,
		downlinkMax: networkStatus.downlinkMax,
		rtt: networkStatus.rtt,
		saveData: networkStatus.saveData,
		type: networkStatus.type,
	});
</script>

<DemoContainer>
	{#if networkStatus.isSupported}
		<pre>{JSON.stringify(networkStatusCombined, null, 2)}</pre>
	{:else}
		<p>Network Status is currently not available.</p>
	{/if}
</DemoContainer>
