<script lang="ts">
	import { onKeyStroke } from "runed";
	import { Button, DemoContainer } from "@svecodocs/kit";

	let keyLog = $state<string[]>([]);

	onKeyStroke(["a", "b"], (e) => {
		keyLog.push(e.key);
	});
</script>

<DemoContainer class="flex flex-col gap-4">
	<p>Listening for "a" and "b"</p>
	<pre>{JSON.stringify(keyLog, null, 2)}</pre>
	<Button onclick={() => (keyLog = [])} class="self-start">Clear log</Button>
</DemoContainer>
