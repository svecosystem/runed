<script lang="ts">
	import { useThrottle } from "runed";
	import { Label, Input, DemoContainer } from "@svecodocs/kit";

	let search = $state("");
	let throttledSearch = $state("");
	let durationMs = $state(1000);

	const setThrottledSearch = useThrottle(
		() => (throttledSearch = search),
		() => durationMs
	);
</script>

<DemoContainer class="flex flex-col gap-4">
	<div class="flex flex-col gap-1.5">
		<Label for="duration">Throttle duration (ms)</Label>
		<Input id="duration" type="number" bind:value={durationMs} />
	</div>

	<div class="flex flex-col gap-1.5">
		<Label for="search">Search</Label>
		<Input
			bind:value={
				() => search,
				(v) => {
					search = v;
					setThrottledSearch();
				}
			}
			placeholder="Search the best utilities for Svelte 5"
		/>
	</div>
	<p>
		{#if throttledSearch}
			You searched for: <b>{throttledSearch}</b>
		{:else}
			Search for something above!
		{/if}
	</p>
</DemoContainer>

<!-- Hack to make it fill the container -->
<div class="h-1 w-screen"></div>
