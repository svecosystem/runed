<script lang="ts">
	import { siteConfig } from "$lib/config/site";
	import "../app.css";
	import { useSiteConfig } from "@svecodocs/kit";

	let { children } = $props();

	useSiteConfig(() => siteConfig);
</script>

{@render children?.()}
