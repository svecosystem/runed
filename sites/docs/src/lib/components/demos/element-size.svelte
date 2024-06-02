<script lang="ts">
	import { ElementSize } from "runed";

	let el = $state() as HTMLElement;
	const size = new ElementSize(() => el);
	const text = $derived(`Width: ${size.width}\nHeight: ${size.height}`);
</script>

<div class="rounded-md bg-card p-8">
	<textarea
		bind:this={el}
		class="h-[200px] min-h-[100px] w-[300px] min-w-[200px] resize rounded-md bg-muted p-4"
		value={text}
		readonly
	></textarea>
</div>
