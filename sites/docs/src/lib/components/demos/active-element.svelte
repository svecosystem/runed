<script lang="ts">
	import { activeElement } from "runed";
</script>

<div class="rounded-md bg-card p-8">
	<p>
		Currently active element:
		<span class="font-bold">
			{activeElement.current?.localName ?? "No active element found"}
		</span>
	</p>
</div>
