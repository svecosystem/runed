<script lang="ts">
	import { page } from "$app/stores";
	import { navigation } from "$lib/config/index.js";
	import { ArrowUpRight } from "$lib/icons/index.js";
	import { cn } from "$lib/utils/index.js";
</script>

<nav class="hidden items-center justify-center lg:flex">
	<ul class="flex w-full items-center justify-center gap-8">
		{#each navigation.main as { href, title, external }}
			<li class="relative">
				<a
					{href}
					class={cn(
						"text-sm text-muted-foreground hover:text-brand",
						external ? "flex items-center gap-0.5" : "",
						// eslint-disable-next-line svelte/valid-compile
						$page.url.pathname === href ? "text-brand" : ""
					)}
					target={external ? "_blank" : undefined}
				>
					{title}
					{#if external}
						<ArrowUpRight class="-mt-2 ml-0.5 h-3 w-3" />
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>
