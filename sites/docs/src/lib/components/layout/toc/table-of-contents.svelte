<script lang="ts">
	import { createTableOfContents } from "@melt-ui/svelte";
	import Tree from "./tree.svelte";
	import { page } from "$app/stores";

	export let selector = "#sveco-content";

	const {
		elements: { item },
		states: { headingsTree, activeHeadingIdxs },
		helpers: { isActive },
	} = createTableOfContents({
		selector,
		exclude: ["h1", "h4", "h5", "h6"],
		activeType: "all",
		scrollOffset: 80,
		headingFilterFn: (heading) => {
			return !heading.hasAttribute("data-toc-ignore");
		},
	});
</script>

<!-- eslint-disable-next-line svelte/valid-compile -->
{#if !$page.error && $headingsTree.length}
	<div>
		<div
			class="fixed z-30 hidden h-[calc(100vh-130px)] w-[220px] shrink-0 overflow-y-auto text-sm xl:block"
		>
			<div class="overflow-y-auto rounded-lg pt-8">
				<div class="mb-4 text-sm font-medium leading-6 text-muted-foreground">On this page</div>
				<nav>
					{#key $headingsTree}
						<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} {isActive} />
					{/key}
				</nav>
			</div>
		</div>
	</div>
{/if}
