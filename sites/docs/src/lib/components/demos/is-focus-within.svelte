<script lang="ts">
	import { IsFocusWithin } from "runed";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let formElement = $state<HTMLFormElement | undefined>();
	const formFocused = new IsFocusWithin(() => formElement);
</script>

<DemoContainer>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			formElement?.reset();
		}}
		bind:this={formElement}
		class="mx-auto flex max-w-[340px] flex-col gap-4 p-4"
	>
		<div class="flex flex-col gap-2">
			<Label>First name</Label>
			<Input />
		</div>
		<div class="flex flex-col gap-2">
			<Label>Last name</Label>
			<Input />
		</div>
		<div class="flex flex-col gap-2">
			<Label>Email</Label>
			<Input />
		</div>
		<Button type="submit" variant="brand">Submit</Button>
	</form>
	<p class="mx-auto mt-6 text-center">
		Focus is within form:
		<b class={formFocused.current ? "text-success" : "text-destructive"}>
			{formFocused.current}
		</b>
	</p>
</DemoContainer>
