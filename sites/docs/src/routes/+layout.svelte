<script lang="ts">
	import "../app.css";
	import { siteConfig } from "#lib/config/site.js";
	import { useSiteConfig } from "@svecodocs/kit";
	import { dev } from "$app/env";

	let { children } = $props();

	useSiteConfig(() => siteConfig);
</script>

<svelte:head>
	{#if !dev}
		<script defer data-domain="runed.dev" src="https://server.hj.run/js/script.js"></script>
	{/if}
</svelte:head>

{@render children?.()}
