<script lang="ts">
	import { page } from "$app/stores";
	import type { SidebarNavItem } from "$lib/config";
	import { isTitleActive, slugFromPathname } from "$lib/utils/docs";
	import MobileNavLink from "./mobile-nav-link.svelte";

	export let navItem: SidebarNavItem;
	$: currentPath = slugFromPathname($page.url.pathname);
</script>

{#if navItem.items.length}
	<h5 class="mb-6 font-medium">{navItem.title}</h5>
	<ul class="space-y-6">
		{#each navItem.items as item}
			{@const isActive = isTitleActive(currentPath, item.title)}
			<li>
				<MobileNavLink
					class="-ml-px pl-4 {isActive
						? 'border-brand text-brand'
						: 'border-border text-muted-foreground'}
					"
					href={item.href}
				>
					{item.title}
				</MobileNavLink>
			</li>
		{/each}
	</ul>
{:else}
	<MobileNavLink
		href={navItem.href}
		class="group mb-4 flex items-center font-semibold lg:text-sm lg:leading-6"
	>
		{navItem.title}
	</MobileNavLink>
{/if}
