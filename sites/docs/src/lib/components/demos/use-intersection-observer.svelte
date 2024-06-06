<script lang="ts">
	import { useIntersectionObserver } from "runed";

	let root = $state<HTMLElement | undefined>(undefined);
	let target = $state<HTMLElement | undefined>(undefined);

	let isVisible = $state(false);

	const observer = useIntersectionObserver(
		() => target,
		([entry]) => {
			if (entry) {
				isVisible = entry.isIntersecting;
			} else {
				isVisible = false;
			}
		},
		{
			root: () => root,
		}
	);
</script>

<div class="flex flex-col gap-4 rounded-xl bg-card p-8 text-center">
	<label for="enabled">
		<input
			type="checkbox"
			name="enabled"
			id="enabled"
			checked={observer.isActive}
			oninput={(e) => {
				e.currentTarget.checked ? observer.resume() : observer.pause();
			}}
		/>
		<span>Enable</span>
	</label>
	<div
		bind:this={root}
		class="m-2 h-[200px] overflow-y-scroll border-2 border-dashed border-border"
	>
		<p class="text-lg italic">Scroll down</p>
		<div bind:this={target} class="m-6 mt-96 max-h-[150px] border-2 border-brand p-2.5">
			<p>I'm the target! 🎯</p>
		</div>
	</div>
	<div class="text-center">
		Element
		<span class="font-medium text-brand">
			{#if isVisible}
				inside
			{:else}
				outside
			{/if}
		</span>
		the viewport
	</div>
</div>
