<script context="module" lang="ts">
	import type { Snippet } from "svelte";
	import { browser } from "$app/environment";

	let portalled = $state<Snippet[]>([]);
</script>

<script lang="ts">
	const { children, receive }: { children?: Snippet; receive?: boolean } = $props();

	children && portalled.push(children);

	// This is needed because the server state is not cleaned up otherwise
	const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
	sleep(0).then(() => {
		if (browser) return
		portalled = portalled.filter((child) => child !== children);
	})

	$effect(() => {
		return () => {
			portalled = portalled.filter((child) => child !== children);
		};
	});
</script>

{#if receive }
	{#each portalled as child}
		{@render child()}
	{/each}
{/if}
