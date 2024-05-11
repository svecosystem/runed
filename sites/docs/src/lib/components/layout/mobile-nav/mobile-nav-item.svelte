<script lang="ts">
	import MobileNavLink from "./mobile-nav-link.svelte";
	import { page } from "$app/stores";
	import type { SidebarNavItem } from "$lib/config";
	import { isTitleActive, slugFromPathname } from "$lib/utils/docs";

	export let navItem: SidebarNavItem;
	// eslint-disable-next-line svelte/valid-compile
	$: currentPath = slugFromPathname($page.url.pathname);
</script>

{#if navItem.items.length}
	<h5 class="mb-6 font-medium">{navItem.title}</h5>
	<ul>
		{#each navItem.items as item}
			{@const isActive = isTitleActive(currentPath, item.title)}
			<li class="group">
				<MobileNavLink
					class="-ml-px block py-4 pl-4 group-first:pt-0 group-last:pb-0 {isActive
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
		class="group mb-4 flex  items-center font-semibold lg:text-sm lg:leading-6"
	>
		{navItem.title}
	</MobileNavLink>
{/if}
