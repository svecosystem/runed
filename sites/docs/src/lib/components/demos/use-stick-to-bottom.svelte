<script lang="ts">
	import { useStickToBottom } from "runed";
	import { Button, DemoContainer } from "@svecodocs/kit";

	let contentToTrack: HTMLElement | null = $state(null);
	let messages = $state(["Initial message 1", "Initial message 2", "Initial message 3"]);

	const { status, scrollToBottom } = useStickToBottom(() => contentToTrack);

	// Function to add a new message
	function addMessage() {
		messages = [...messages, `Message ${messages.length + 1}`];
	}

	// Add a new message every 3 seconds
	$effect(() => {
		const interval = setInterval(addMessage, 3000);
		return () => clearInterval(interval);
	});
</script>

<DemoContainer class="relative">
	<DemoContainer class="h-[200px] overflow-auto">
		<ul bind:this={contentToTrack}>
			{#each messages as message}
				<li class="bg-muted mb-2 rounded px-4 py-2">
					{message}
				</li>
			{/each}
		</ul>
	</DemoContainer>
	{#if !status.isAtBottom}
		<Button class="absolute bottom-24 right-12" onclick={() => scrollToBottom()}>
			Scroll to bottom
		</Button>
	{/if}

	<div class="flex justify-between">
		<span class="text-foreground/50 text-sm">
			Status: {status.isAtBottom ? "At bottom" : "Scrolled up"}
		</span>
		<Button variant="brand" onclick={addMessage}>Add message</Button>
	</div>
</DemoContainer>
