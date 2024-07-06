<script lang="ts">
	import { useThrottle } from "runed";

	import DemoContainer from "$lib/components/demo-container.svelte";
	import Input from "$lib/components/ui/input/input.svelte";

	let search = $state("");
	let throttledSearch = $state("");

	const something = useThrottle(() => {
		throttledSearch = search;
	}, 2000);

	$effect(() => {
		// eslint-disable-next-line no-unused-expressions
		search;
		something();
	});

	$effect(() => {
		console.log(`Pending is ${something.pending}`);
	});
</script>

<DemoContainer class="flex flex-col gap-4">
	<Input bind:value={search} placeholder="Search the best utilities for Svelte 5" />
	<p>Search value: {search} {something.pending}</p>
	<p>Throttled search value: {throttledSearch}</p>
	<p>
		{#if throttledSearch}
			You searched for: <b>{throttledSearch}</b>
		{:else}
			Search for something above!
		{/if}
	</p>
</DemoContainer>
