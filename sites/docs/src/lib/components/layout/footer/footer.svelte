<script lang="ts">
	import FooterIcons from "./footer-icons.svelte";
	import A from "$lib/components/markdown/a.svelte";
	import { siteConfig } from "$lib/config";
</script>

<footer class="border-border mt-4 border-t text-sm leading-6">
	<div class="max-w-8xl text-foreground/80 container flex h-16 items-center justify-between gap-3">
		<div class="flex items-center gap-2 lg:flex-1">
			<A href={siteConfig.license.url}>
				{siteConfig.license.name}
			</A>
			<p>&copy; {new Date().getFullYear()} Svecosystem Team</p>
		</div>
		<FooterIcons />
	</div>
</footer>
