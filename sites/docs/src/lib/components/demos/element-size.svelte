<script lang="ts">
	import { ElementSize } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let el = $state() as HTMLElement;
	const size = new ElementSize(() => el);
	const text = $derived(`Width: ${size.width}\nHeight: ${size.height}`);
</script>

<DemoContainer>
	<textarea
		bind:this={el}
		class="h-[200px] min-h-[100px] w-[300px] min-w-[200px] resize rounded-md bg-muted p-4"
		value={text}
		readonly
	></textarea>
</DemoContainer>
