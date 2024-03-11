<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "withrunes";
	import { DotsSixVertical } from "$icons/index.js";
	import { Button } from "$lib/components/ui/button";

	let showPaneOne = true;
	let showPaneThree = true;
</script>

<div class="flex items-center gap-2">
	<Button
		variant="outline"
		on:click={() => {
			showPaneOne = !showPaneOne;
		}}
	>
		{showPaneOne ? "Hide" : "Show"} Pane One
	</Button>
	<Button
		variant="outline"
		on:click={() => {
			showPaneThree = !showPaneThree;
		}}
	>
		{showPaneThree ? "Hide" : "Show"} Pane Three
	</Button>
</div>

<PaneGroup direction="horizontal" class="w-full">
	{#if showPaneOne}
		<Pane defaultSize={1 / 3} order={1}>
			<div class="bg-muted flex h-[400px] items-center justify-center rounded-lg p-6">
				<span class="font-semibold">One</span>
			</div>
		</Pane>
		<PaneResizer class="bg-background relative flex w-2 items-center justify-center">
			<div class="bg-brand z-10 flex h-7 w-5 items-center justify-center rounded-sm border">
				<DotsSixVertical class="size-4 text-black" weight="bold" />
			</div>
		</PaneResizer>
	{/if}
	<Pane defaultSize={1 / 3} order={2}>
		<div class="bg-muted flex h-[400px] items-center justify-center rounded-lg p-6">
			<span class="font-semibold">Two</span>
		</div>
	</Pane>
	{#if showPaneThree}
		<PaneResizer class="bg-background relative flex w-2 items-center justify-center">
			<div class="bg-brand z-10 flex h-7 w-5 items-center justify-center rounded-sm border">
				<DotsSixVertical class="size-4 text-black" weight="bold" />
			</div>
		</PaneResizer>
		<Pane defaultSize={1 / 3} order={3}>
			<div class="bg-muted flex h-[400px] items-center justify-center rounded-lg p-6">
				<span class="font-semibold">Three</span>
			</div>
		</Pane>
	{/if}
</PaneGroup>
