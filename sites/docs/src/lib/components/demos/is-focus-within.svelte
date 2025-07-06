<script lang="ts">
	import { IsFocusWithin } from "runed";
	import { Input, Label, Button, DemoContainer } from "@svecodocs/kit";

	let formElement = $state<HTMLFormElement>();
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
		<div class="flex flex-col gap-3">
			<Label for="fname">First name</Label>
			<Input id="fname" />
		</div>
		<div class="flex flex-col gap-3">
			<Label for="lname">Last name</Label>
			<Input id="lname" />
		</div>
		<div class="flex flex-col gap-3">
			<Label for="email">Email</Label>
			<Input id="email" type="email" />
		</div>
		<Button type="submit" variant="brand">Submit</Button>
	</form>
	<p class="mx-auto mt-6 text-center">
		Focus is within form:
		<b class={formFocused.current ? "text-emerald-500" : "text-destructive"}>
			{formFocused.current}
		</b>
	</p>
</DemoContainer>
