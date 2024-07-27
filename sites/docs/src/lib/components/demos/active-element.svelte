<script lang="ts">
	import { activeElement } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";
</script>

<DemoContainer>
	<p>
		Currently active element:
		<span class="text-brand font-bold">
			{activeElement.current?.localName ?? "No active element found"}
		</span>
	</p>
</DemoContainer>
