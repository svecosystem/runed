<script lang="ts">
	import { IsHovered } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	const hovered = new IsHovered();
</script>

<DemoContainer>
	<div class="flex flex-col items-center justify-center p-8">
		<div
			class="bg-muted relative flex cursor-help items-center gap-2 rounded-lg px-4 py-2 transition-all"
			{@attach hovered.attach}
		>
			<span class="text-sm font-medium">The secret password is:</span>
			<span
				class="bg-foreground/10 rounded px-2 py-0.5 font-mono text-sm transition-all duration-150"
				class:blur-sm={!hovered.current}
				class:select-none={!hovered.current}
				class:opacity-50={!hovered.current}
			>
				hunter2
			</span>
		</div>

		<p class="text-muted-foreground mt-4 text-xs">Hover over the box to reveal the secret.</p>
	</div>
</DemoContainer>
