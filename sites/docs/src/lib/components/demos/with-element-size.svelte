<script lang="ts">
	import { withElementSize } from "withrunes";

	let el: HTMLElement | undefined = $state(undefined);
	const size = withElementSize(() => el);
	const text = $derived(`Width: ${size.width}\nHeight: ${size.height}`);
</script>

<div class="rounded-md bg-card p-8">
	<textarea
		bind:this={el}
		class="h-[200px] min-h-[100px] w-[300px] min-w-[200px] resize rounded-md bg-neutral-800 p-4"
		value={text}
	/>
</div>
