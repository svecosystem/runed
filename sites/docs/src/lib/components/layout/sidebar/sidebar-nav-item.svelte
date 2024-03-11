<script lang="ts">
	import { page } from "$app/stores";
	import type { SidebarNavItem } from "$lib/config/index.js";
	import { isTitleActive, slugFromPathname } from "$lib/utils/docs.js";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import { cn } from "$lib/utils";
	import { CaretRight } from "$lib/icons/index.js";

	export let navItem: SidebarNavItem;

	$: currentPath = slugFromPathname($page.url.pathname).toLowerCase();

	let open = true;
	$: notCollapsible = navItem.collapsible === false;
</script>

{#if navItem.items.length}
	<Collapsible.Root bind:open>
		{@const titleClasses =
			"mb-6 inline-flex w-full items-center justify-between font-medium lg:mb-3 lg:text-sm"}
		{#if notCollapsible}
			<h5 class={titleClasses}>
				{navItem.title}
			</h5>
		{:else}
			<Collapsible.Trigger class={titleClasses}>
				{navItem.title}
				<CaretRight class={cn("size-4 transition-transform ", open && "rotate-90")} />
			</Collapsible.Trigger>
		{/if}
		<ul class="space-y-6 border-l border-border lg:space-y-2">
			<Collapsible.Content class="space-y-6 lg:space-y-2">
				{#each navItem.items as item}
					{@const isActive = item.href
						? isTitleActive(currentPath, slugFromPathname(item.href))
						: false}
					<li>
						<a
							href={item.href}
							class={cn(
								"-ml-px block border-l border-border pl-4",
								isActive
									? "border-brand text-brand"
									: "border-border text-muted-foreground hover:border-primary hover:text-primary"
							)}>{item.title}</a
						>
					</li>
				{/each}
			</Collapsible.Content>
		</ul>
	</Collapsible.Root>
{:else}
	<a href={navItem.href} class="group mb-4 flex items-center font-semibold lg:text-sm lg:leading-6">
		{navItem.title}
	</a>
{/if}
