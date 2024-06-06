<script lang="ts">
	import { ElementRect } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import { Textarea } from "$lib/components/ui/textarea";

	let el = $state() as HTMLTextAreaElement;
	const rect = new ElementRect(() => el);
	const text = $derived(
		Object.entries(rect.current)
			.map(([key, value]) => `${key}: ${value}`)
			.join("\n")
	);
</script>

<DemoContainer>
	<Textarea
		bind:el
		class="h-[330px] min-h-[300px] w-[300px] min-w-[200px] resize text-base"
		value={text}
		readonly
	/>
</DemoContainer>
