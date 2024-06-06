<script lang="ts">
	import { useResizeObserver } from "runed";
	import Textarea from "../ui/textarea/textarea.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let el = $state<HTMLElement | undefined>();
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

<DemoContainer>
	<Textarea
		readonly
		value={text}
		bind:el
		class="h-[200px] min-h-[100px] w-[300px] min-w-[200px] resize text-base"
	/>
</DemoContainer>
