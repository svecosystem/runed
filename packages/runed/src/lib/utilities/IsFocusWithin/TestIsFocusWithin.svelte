<script lang="ts">
	import { IsFocusWithin } from "./IsFocusWithin.svelte.js";
	let formElement = $state<HTMLElement>();
	const focusWithinForm = new IsFocusWithin(() => formElement);
</script>

<span data-testid="current">{focusWithinForm.current}</span>
<form bind:this={formElement}>
	<input type="text" data-testid="input" />
	<button data-testid="submit">btn</button>
</form>
<button data-testid="outside">outside</button>
