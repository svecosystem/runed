<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
	import { DotsSixVertical } from "$icons/index.js";
</script>

<div class="h-[400px]">
	<PaneGroup direction="vertical" class="w-full rounded-lg">
		<Pane defaultSize={50} class="rounded-lg bg-muted">
			<div class="flex h-[200px] items-center justify-center p-6">
				<span class="font-semibold">Top</span>
			</div>
		</Pane>
		<PaneResizer class="relative flex h-2 items-center justify-center bg-background">
			<div class="z-10 flex h-5 w-7 items-center justify-center rounded-sm border bg-brand">
				<DotsSixVertical class="size-4 text-black" weight="bold" />
			</div>
		</PaneResizer>
		<Pane defaultSize={50} class="rounded-lg bg-muted">
			<div class="flex h-full items-center justify-center p-6">
				<span class="font-semibold">Bottom</span>
			</div>
		</Pane>
	</PaneGroup>
</div>
