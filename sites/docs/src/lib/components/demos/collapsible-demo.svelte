<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
	import { DotsSixVertical } from "$icons/index.js";
	import { Button } from "$lib/components/ui/button";
	import type { PaneAPI } from "paneforge";

	let paneOne: PaneAPI;
	let collapsed = false;
</script>

<div class="flex items-center gap-2">
	{#if collapsed}
		<Button
			variant="outline"
			on:click={() => {
				paneOne.expand();
			}}
		>
			Expand Pane One
		</Button>
	{:else}
		<Button
			variant="outline"
			on:click={() => {
				paneOne.collapse();
			}}
		>
			Collapse Pane One
		</Button>
	{/if}
</div>
<PaneGroup direction="horizontal" class="w-full">
	<Pane
		defaultSize={50}
		collapsedSize={5}
		collapsible={true}
		minSize={15}
		bind:pane={paneOne}
		onCollapse={() => (collapsed = true)}
		onExpand={() => (collapsed = false)}
	>
		<div class="flex h-[400px] items-center justify-center rounded-lg bg-muted p-6">
			<span class="font-semibold">One</span>
		</div>
	</Pane>
	<PaneResizer class="relative flex w-2 items-center justify-center bg-background">
		<div class="z-10 flex h-7 w-5 items-center justify-center rounded-sm border bg-brand">
			<DotsSixVertical class="size-4 text-black" weight="bold" />
		</div>
	</PaneResizer>
	<Pane defaultSize={50}>
		<PaneGroup direction="vertical">
			<Pane defaultSize={50}>
				<div class="flex h-full items-center justify-center rounded-lg bg-muted p-6">
					<span class="font-semibold">Two</span>
				</div>
			</Pane>
			<PaneResizer class="relative flex h-2 items-center justify-center bg-background">
				<div class="z-10 flex h-5 w-7 items-center justify-center rounded-sm border bg-brand">
					<DotsSixVertical class="size-4 text-black" weight="bold" />
				</div>
			</PaneResizer>
			<Pane defaultSize={50}>
				<div class="flex h-full items-center justify-center rounded-lg bg-muted p-6">
					<span class="font-semibold">Three</span>
				</div>
			</Pane>
		</PaneGroup>
	</Pane>
</PaneGroup>
