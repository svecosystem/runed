<script lang="ts">
	import { ElementSize } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import { Textarea } from "$lib/components/ui/textarea";

	let el = $state() as HTMLTextAreaElement;
	const size = new ElementSize(() => el);
	const text = $derived(`Width: ${size.width}\nHeight: ${size.height}`);
</script>

<DemoContainer>
	<Textarea
		bind:el
		class="h-[200px] min-h-[100px] w-[300px] min-w-[200px] resize text-base"
		value={text}
		readonly
	/>
</DemoContainer>
