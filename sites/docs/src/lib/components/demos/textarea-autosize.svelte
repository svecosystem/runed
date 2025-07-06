<script lang="ts">
	import { TextareaAutosize } from "runed";
	import { DemoContainer, Textarea } from "@svecodocs/kit";

	let element = $state<HTMLTextAreaElement>(null!);
	let input = $state("");
	new TextareaAutosize({
		element: () => element,
		input: () => input,
	});
</script>

<DemoContainer>
	<label class="block" for="textarea-auto"> Behold, the growing textarea! </label>
	<Textarea
		class="mt-2 min-h-2 resize-none"
		id="textarea-auto"
		bind:value={input}
		bind:ref={element}
		placeholder="Type a lot, and you'll see me grow"
	/>
</DemoContainer>
