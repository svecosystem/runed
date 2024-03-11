<script lang="ts">
	import { Drawer } from "vaul-svelte";
	import { Separator } from "$lib/components/ui/separator";
	import { List } from "$lib/icons/index.js";
	import { navigation, siteConfig } from "$lib/config";
	import MobileNavItem from "./mobile-nav-item.svelte";
	import MobileNavLink from "./mobile-nav-link.svelte";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils";
</script>

<Drawer.Root>
	<Drawer.Trigger
		class={cn(buttonVariants({ variant: "subtle", size: "icon" }), "md:hidden")}
		aria-label="open menu"
	>
		<List class="size-6" />
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 z-[60] bg-black/40" />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 z-[70] mt-24 flex max-h-[96%] flex-col rounded-t-[10px] bg-background"
		>
			<div class="max-h-[96%] flex-1 overflow-y-auto rounded-t-[10px] bg-card p-4">
				<div class="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-primary/20" />
				<div class="mx-auto max-w-md">
					<Drawer.Title class="sr-only mb-4 font-medium">Navigation</Drawer.Title>
					<nav>
						<ul class="mb-8 flex w-full flex-col justify-center gap-8">
							{#each navigation.main as { href, title, external }}
								<li class="relative">
									<MobileNavLink {external} {href}>
										{title}
									</MobileNavLink>
								</li>
							{/each}
						</ul>
						<Separator />
						<ul class="flex w-full flex-col justify-center gap-4">
							{#each navigation.sidebar as navItem}
								<li class="mt-8">
									<MobileNavItem {navItem} />
								</li>
							{/each}
						</ul>
					</nav>
				</div>
			</div>
			<div class="mt-auto border-t border-border bg-primary/5 p-4">
				<div class="mx-auto flex max-w-md justify-end gap-6">
					<MobileNavLink
						class="text-xs text-muted-foreground"
						href={siteConfig.links.github}
						external
					>
						GitHub
					</MobileNavLink>
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
