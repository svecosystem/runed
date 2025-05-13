<script lang="ts">
	import { useMutationObserver } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	let el = $state<HTMLElement | null>(null);
	const messages = $state<string[]>([]);
	let className = $state("");
	let style = $state("");

	useMutationObserver(
		() => el,
		(mutations) => {
			const mutation = mutations[0];

			if (!mutation) return;

			messages.push(mutation.attributeName!);
		},
		{ attributes: true }
	);

	setTimeout(() => {
		className = "text-brand";
	}, 1000);

	setTimeout(() => {
		style = "font-style: italic;";
	}, 1500);
</script>

<DemoContainer>
	<div bind:this={el} class={className} {style}>
		{#each messages as text, i (`${text}-${i}`)}
			<div>
				Mutation Attribute: {text}
			</div>
		{:else}
			<div>No mutations yet</div>
		{/each}
	</div>
</DemoContainer>
