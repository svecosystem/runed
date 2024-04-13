<script lang="ts">
	import { useActiveElement } from "runed";

	const activeElement = useActiveElement();
	const text = $derived(
		`Currently active element: ${
			activeElement.value !== null ? activeElement.value.localName : "No active element found"
		}`
	);
</script>

<div class="rounded-md bg-card p-8">
	<p>{text}</p>
</div>
