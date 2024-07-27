<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { SpinnerGap } from "$icons/index.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<Card.Root>
	<Card.Content
		class={cn("flex flex-row items-center justify-center pt-6", className)}
		{...$$restProps}
	>
		<div class="flex h-full w-full items-center justify-center">
			<SpinnerGap class="animate-spin-slow text-muted h-1/6 w-1/6" />
		</div>
	</Card.Content>
</Card.Root>
