<script lang="ts">
	import { useThrottle } from "runed";

	import { Label } from "../ui/label";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import Input from "$lib/components/ui/input/input.svelte";

	let search = $state("");
	let throttledSearch = $state("");
	let durationMs = $state(1000);

	const something = useThrottle(
		() => {
			throttledSearch = search;
		},
		() => durationMs
	);

	$effect(() => {
		// eslint-disable-next-line no-unused-expressions
		search;
		something();
	});
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
		{#if throttledSearch}
			You searched for: <b>{throttledSearch}</b>
		{:else}
			Search for something above!
		{/if}
	</p>
</DemoContainer>
