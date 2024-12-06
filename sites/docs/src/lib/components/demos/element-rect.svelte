<script lang="ts">
	import { ElementRect } from "runed";
	import { DemoContainer, Textarea } from "@svecodocs/kit";

	let ref = $state<HTMLTextAreaElement>(null!);
	const rect = new ElementRect(() => ref);
	const text = $derived(
		Object.entries(rect.current)
			.map(([key, value]) => `${key}: ${value}`)
			.join("\n")
	);
</script>

<DemoContainer>
	<Textarea
		bind:ref
		class="h-[330px] min-h-[300px] w-[300px] resize text-base"
		value={text}
		readonly
	/>
</DemoContainer>
