<script lang="ts">
	import { useResizeObserver } from "runed";
	import { Textarea, DemoContainer } from "@svecodocs/kit";

	let ref = $state<HTMLElement>(null!);
	let text = $state("");

	useResizeObserver(
		() => ref,
		(entries) => {
			const entry = entries[0];
			if (!entry) return;

			const { width, height } = entry.contentRect;
			text = `width: ${width}\nheight: ${height}`;
		}
	);
</script>

<DemoContainer>
	<Textarea
		readonly
		value={text}
		bind:ref
		class="h-[200px] min-h-[100px] w-[300px]  resize text-base"
	/>
</DemoContainer>
