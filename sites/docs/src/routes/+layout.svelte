<script lang="ts">
	import "../app.css";
	import { siteConfig } from "$lib/config/site";
	import { useSiteConfig } from "@svecodocs/kit";

	let { children } = $props();

	useSiteConfig(() => siteConfig);
</script>

{@render children?.()}
