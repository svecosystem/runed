<script lang="ts">
	import { resource } from "runed";
	import { DemoContainer, Button, Input } from "@svecodocs/kit";

	let id = $state(1);

	const searchResource = resource(
		() => id,
		async (id) => {
			const response = await fetch(`https://jsonplaceholder.typicode.com/posts?id=${id}`);
			return response.json();
		},
		{ debounce: 1000 }
	);
</script>

<DemoContainer class="flex flex-col gap-4">
	<div class="flex items-center gap-2 text-nowrap">
		Post id: <Input type="number" bind:value={id} placeholder="Type to search..." class="w-full" />
	</div>

	<div class="bg-card text-card-foreground rounded-md border p-4">
		<div class="flex w-full flex-col gap-2 overflow-hidden">
			<div class="text-muted-foreground text-sm">
				Status: {searchResource.loading ? "Loading..." : "Ready"}
			</div>
			{#if searchResource.error}
				<div class="text-destructive text-sm">
					Error: {searchResource.error.message}
				</div>
			{/if}
			<div class="flex w-[400px] flex-col gap-1 overflow-scroll">
				{#each searchResource.current ?? [] as result, i (`result-${i}`)}
					<pre>{JSON.stringify(result, null, 2)}</pre>
				{/each}
			</div>
		</div>
	</div>

	<Button onclick={() => searchResource.refetch()} disabled={searchResource.loading}>
		Refetch Results
	</Button>
</DemoContainer>
