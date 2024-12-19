<script lang="ts">
	import { activeElement } from "runed";
	import { DemoContainer } from "@svecodocs/kit";
</script>

<DemoContainer>
	<p>
		Currently active element:
		<code class="font-bold">
			{activeElement.current?.localName ?? "No active element found"}
		</code>
	</p>
</DemoContainer>
