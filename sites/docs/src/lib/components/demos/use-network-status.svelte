<script lang="ts">
	import { useNetworkStatus } from "runed";
	import { toast } from "svelte-sonner";
	import DemoContainer from "$lib/components/demo-container.svelte";

	const networkStatus = useNetworkStatus();

	const timeOffline = $derived(() => {
		if (networkStatus && networkStatus.previous) {
			const now = networkStatus.current.updatedAt;
			const prev = networkStatus.previous.updatedAt;
			if (!now || !prev) {
				return 0;
			}
			const differenceMs = now.getTime() - prev.getTime();
			if (differenceMs < 0) {
				return 0;
			}
			const differenceSeconds = differenceMs / 1000;
			return Math.round(differenceSeconds);
		}
		return 0;
	});

	$effect(() => {
		if (!networkStatus.current) {
			return;
		}

		if (networkStatus.current.online === false) {
			toast.error("No internet connection. Reconnect to continue using the app.");
		}
		if (
			networkStatus.current.effectiveType === "3g" ||
			networkStatus.current.effectiveType === "2g" ||
			networkStatus.current.effectiveType === "slow-2g"
		) {
			toast.warning(
				"You are experiencing a slow connection. Some features may take longer to load."
			);
		}
		if (networkStatus.current.online === true && networkStatus.previous?.online === false) {
			toast.success(
				`You are back online! Catch up with what you missed during your ${timeOffline()} seconds offline.`
			);
		}
	});
</script>

<DemoContainer>
	{#if networkStatus.current}
		<pre>{JSON.stringify(networkStatus.current, null, 2)}</pre>
	{/if}
</DemoContainer>
