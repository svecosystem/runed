<script lang="ts">
	import { useResizeObserver } from "runed";

	let el = $state<HTMLElement | null>(null);
	let text = $state("");

	useResizeObserver(
		() => el,
		(entries) => {
			const entry = entries[0];
			if (!entry) return;

			const { width, height } = entry.contentRect;
			text = `width: ${width}\nheight: ${height}`;
		}
	);
</script>

<div class="rounded-md bg-card p-8">
	<textarea
		class="h-[200px] min-h-[100px] w-[300px] min-w-[200px] resize rounded-md bg-muted p-4"
		bind:this={el}
		readonly
		value={text}
	></textarea>
</div>
