<script lang="ts">
	import { IsInViewport } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode);
</script>

<DemoContainer>
	<p bind:this={targetNode}>Target node</p>
	<p class="text-muted-foreground text-sm italic">Scroll down to observe the behavior</p>
</DemoContainer>

<div
	class="bg-background fixed bottom-8 right-8 z-20 flex items-center rounded-lg border p-4 text-sm"
>
	<p>
		Target node is <span
			class="font-medium text-red-500 data-[in-viewport]:text-green-500"
			data-in-viewport={inViewport.current ? "" : undefined}
		>
			{inViewport.current ? " in " : " out of "}
		</span>
		viewport
	</p>
</div>
