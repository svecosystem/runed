<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "withrunes";
	import { DotsSixVertical } from "$icons/index.js";
</script>

<div class="h-[400px]">
	<PaneGroup direction="vertical" class="w-full rounded-lg">
		<Pane defaultSize={50} class="bg-muted rounded-lg">
			<div class="flex h-[200px] items-center justify-center p-6">
				<span class="font-semibold">Top</span>
			</div>
		</Pane>
		<PaneResizer class="bg-background relative flex h-2 items-center justify-center">
			<div class="bg-brand z-10 flex h-5 w-7 items-center justify-center rounded-sm border">
				<DotsSixVertical class="size-4 text-black" weight="bold" />
			</div>
		</PaneResizer>
		<Pane defaultSize={50} class="bg-muted rounded-lg">
			<div class="flex h-full items-center justify-center p-6">
				<span class="font-semibold">Bottom</span>
			</div>
		</Pane>
	</PaneGroup>
</div>
