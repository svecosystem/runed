<script lang="ts">
	import { useMousePosition } from "runed";
	import { Button, DemoContainer } from "@svecodocs/kit";

	let el = $state<HTMLDivElement>();
	const mouse = useMousePosition(() => el);
</script>

<DemoContainer>
	<div bind:this={el} class="border-foreground relative mb-4 rounded-lg border p-4">
		<span
			class="bg-foreground text-background absolute right-0 top-0 select-none rounded-bl-md rounded-tr-md px-2.5 py-1 font-mono text-xs"
		>
			element
		</span>
		<p class="mb-3 font-mono text-sm">
			Viewport: <span class="text-muted-foreground"
				>{Math.round(mouse.x)}, {Math.round(mouse.y)}</span
			>
		</p>
		<p class="mb-3 font-mono text-sm">
			Element: <span class="text-muted-foreground"
				>{Math.round(mouse.elementX)}, {Math.round(mouse.elementY)}</span
			>
		</p>
		<p class="mb-3 font-mono text-sm">
			Inside: <span class={mouse.isInside ? "text-green-500" : "text-destructive"}
				>{mouse.isInside}</span
			>
		</p>
		<p class="mb-3 font-mono text-sm">
			Status: <span class={mouse.enabled ? "text-green-500" : "text-destructive"}
				>{mouse.enabled ? "Enabled" : "Disabled"}</span
			>
		</p>
		<div class="flex items-center gap-3">
			<Button disabled={mouse.enabled} size="sm" onclick={mouse.start}>Start</Button>
			<Button disabled={!mouse.enabled} size="sm" onclick={mouse.stop}>Stop</Button>
		</div>
	</div>
</DemoContainer>
