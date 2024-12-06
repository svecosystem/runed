<script lang="ts">
	import { Store } from "runed";
	import { writable } from "svelte/store";
	import { Button, DemoContainer } from "@svecodocs/kit";

	const store = writable(0);
	const runeStore = new Store(store);
</script>

<DemoContainer>
	<Button variant="brand" size="sm" onclick={() => runeStore.current++}>runeStore.current++</Button>
	<pre class="my-4 bg-transparent p-0 font-mono">runeStore.current: {`${runeStore.current}`}</pre>

	<Button variant="brand" size="sm" onclick={() => ($store = $store + 1)}>
		$store = $store + 1
	</Button>
	<pre class="m-0 mt-4 bg-transparent p-0 font-mono">$store: {`${$store}`}</pre>
</DemoContainer>
