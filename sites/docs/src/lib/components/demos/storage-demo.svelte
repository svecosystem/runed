<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
	import { DotsSixVertical } from "$icons/index.js";
</script>

<PaneGroup direction="horizontal" class="w-full rounded-lg" autoSaveId="someGroupId">
	<Pane defaultSize={50} class="rounded-lg bg-muted">
		<div class="flex h-[400px] items-center justify-center p-6">
			<span class="font-semibold">Left</span>
		</div>
	</Pane>
	<PaneResizer class="relative flex w-2 items-center justify-center bg-background">
		<div class="z-10 flex h-7 w-5 items-center justify-center rounded-sm border bg-brand">
			<DotsSixVertical class="size-4 text-black" weight="bold" />
		</div>
	</PaneResizer>
	<Pane defaultSize={50} class="rounded-lg bg-muted">
		<div class="flex h-full items-center justify-center p-6">
			<span class="font-semibold">Right</span>
		</div>
	</Pane>
</PaneGroup>
