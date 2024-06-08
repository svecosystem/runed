<script lang="ts">
	import { Portal } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let count = $state(0);
</script>

<DemoContainer>
	<p>Portal Send</p>
	<Portal>
		<button class="w-8 bg-red-500" onclick={() => count++}>{count}</button>
	</Portal>

	<p>Portal Receive</p>
	<Portal receive></Portal>
</DemoContainer>
