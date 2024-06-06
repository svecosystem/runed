<script lang="ts">
	import MobileNav from "../mobile-nav/mobile-nav.svelte";
	import ThemeDropdown from "./theme-dropdown.svelte";
	import { GitHubIcon } from "$lib/icons/index.js";
	import { Button } from "$lib/components/ui/button";
	import { siteConfig } from "$lib/config";
</script>

<div class="flex items-center justify-end lg:flex-1">
	<ThemeDropdown />
	<Button
		href={siteConfig.links.github}
		target="_blank"
		aria-label="view this project on github"
		size="icon"
		variant="ghost"
	>
		<GitHubIcon class="size-5" />
	</Button>
	<MobileNav />
</div>
