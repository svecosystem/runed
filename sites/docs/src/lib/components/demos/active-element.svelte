<script lang="ts">
	import { activeElement } from "runed";
	import { DemoContainer } from "@svecodocs/kit";
</script>

<DemoContainer>
	<p>
		Currently active element:
		<span class="text-brand font-bold">
			{activeElement.current?.localName ?? "No active element found"}
		</span>
	</p>
</DemoContainer>
