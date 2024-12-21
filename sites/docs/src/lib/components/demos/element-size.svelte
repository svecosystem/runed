<script lang="ts">
	import { ElementSize } from "runed";
	import { DemoContainer, Textarea } from "@svecodocs/kit";

	let ref = $state<HTMLTextAreaElement>(null!);
	const size = new ElementSize(() => ref);
	const text = $derived(`Width: ${size.width}\nHeight: ${size.height}`);
</script>

<DemoContainer>
	<Textarea
		bind:ref
		class="h-[200px] min-h-[100px] w-[300px] resize text-base"
		value={text}
		readonly
	/>
</DemoContainer>
