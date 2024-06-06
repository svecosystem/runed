<script lang="ts">
	import { Debounced } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let search = $state("");
	const debounced = new Debounced(() => search, 500);
</script>

<DemoContainer class="flex flex-col gap-4">
	<input
		class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		bind:value={search}
		placeholder="Search the best utilities for Svelte 5"
	/>
	<p>
		{#if debounced.current}
			You searched for: <b class="text-brand">{debounced.current}</b>
		{:else}
			Search for something above!
		{/if}
	</p>
</DemoContainer>
