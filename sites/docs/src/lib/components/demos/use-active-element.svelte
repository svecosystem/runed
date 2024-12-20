<script lang="ts">
	import { useActiveElement } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	const activeElement = useActiveElement();
</script>

<DemoContainer>
	<p>
		Currently active element:
		<code class="font-bold">
			{activeElement.current?.localName ?? "No active element found"}
		</code>
	</p>
</DemoContainer>
