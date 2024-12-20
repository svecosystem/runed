<script lang="ts">
	import "../app.css";
	import { siteConfig } from "$lib/config/site";
	import { useSiteConfig } from "@svecodocs/kit";
	import { dev } from "$app/environment";
	import { Toaster } from "svelte-sonner";

	let { children } = $props();

	useSiteConfig(() => siteConfig);
</script>

<svelte:head>
	{#if !dev}
		<script defer data-domain="runed.dev" src="https://server.hj.run/js/script.js"></script>
	{/if}
</svelte:head>

<Toaster />
{@render children?.()}
