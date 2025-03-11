<script lang="ts">
	import { useStickToBottom } from "runed";
	import { Button, DemoContainer } from "@svecodocs/kit";

	let contentToTrack: HTMLElement | null = $state(null);
	let messages = $state(["Initial message 1", "Initial message 2", "Initial message 3"]);
	let animationType: ScrollBehavior = $state<"auto" | "instant" | "smooth">("smooth");

	// Configure with spring physics for smoother animations
	const stickToBottom = useStickToBottom(
		() => contentToTrack,
		() => ({
			// Default spring animation properties
			damping: 0.7,
			stiffness: 0.05,
			mass: 1.25,
			// Use instant animation for initial scroll
			initial: animationType,
			resize: animationType,
		})
	);

	// Function to add a new message
	function addMessage() {
		messages = [...messages, `Message ${messages.length + 1}`];
	}

	// Scroll with the selected animation type
	function scrollWithAnimation() {
		if (animationType === "smooth") {
			// Use custom spring animation
			stickToBottom.scrollToBottom({
				animation: {
					damping: 0.65,
					stiffness: 0.06,
					mass: 1.2,
				},
			});
		} else {
			// Use standard smooth or instant animations
			stickToBottom.scrollToBottom(animationType);
		}
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
	{#if !stickToBottom.isNearBottom}
		<Button class="absolute bottom-24 right-12" onclick={scrollWithAnimation}>
			Scroll to bottom
		</Button>
	{/if}

	<div class="mt-2 flex justify-between">
		<div class="flex items-center gap-2">
			<select
				bind:value={animationType}
				class="bg-background border-input rounded border p-1 text-sm"
			>
				<option value="instant">Instant</option>
				<option value="smooth">Smooth</option>
			</select>
			<span class="text-foreground/50 text-sm">
				Status: {stickToBottom.isNearBottom ? "At bottom" : "Scrolled up"}
			</span>
		</div>
		<Button variant="brand" onclick={addMessage}>Add message</Button>
	</div>
</DemoContainer>
