<script lang="ts">
	import { Throttled } from "runed";
	import { Label, Input, DemoContainer } from "@svecodocs/kit";

	let search = $state("");
	let durationMs = $state(1000);
	const throttledSearch = new Throttled(
		() => search,
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
		<Input bind:value={search} placeholder="Search the best utilities for Svelte 5" />
	</div>

	<p>
		{#if throttledSearch.current}
			You searched for: <b>{throttledSearch.current}</b>
		{:else}
			Search for something above!
		{/if}
	</p>
</DemoContainer>
