<script lang="ts">
	import { activeElement } from "runed";
	import { browser } from "$app/environment";
</script>

<div class="rounded-md bg-card p-8">
	<p>
		Currently active element:
		<span class="font-bold">
			{#if browser}
				{activeElement.current?.localName ?? "No active element found"}
			{/if}
		</span>
	</p>
</div>
