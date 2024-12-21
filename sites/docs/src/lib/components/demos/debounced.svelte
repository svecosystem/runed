<script lang="ts">
	import { Debounced } from "runed";
	import { DemoContainer, Input } from "@svecodocs/kit";

	let search = $state("");
	const debounced = new Debounced(() => search, 500);
</script>

<DemoContainer class="flex flex-col gap-4">
	<Input bind:value={search} placeholder="Search the best utilities for Svelte 5" />
	<p>
		{#if debounced.current}
			You searched for: <b>{debounced.current}</b>
		{:else}
			Search for something above!
		{/if}
	</p>
</DemoContainer>
