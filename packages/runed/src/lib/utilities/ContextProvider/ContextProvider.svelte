<script lang="ts" generics="TContext">
	import type { ContextProviderProps } from "./types.js";

	const { context, value, children }: ContextProviderProps<TContext> = $props();

	context.set(value);
</script>

{@render children()}
