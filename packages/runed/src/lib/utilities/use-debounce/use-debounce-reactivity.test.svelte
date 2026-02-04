<script lang="ts">
	import { useDebounce } from "./use-debounce.svelte.js";

	export const debounced = useDebounce(() => {}, 100);
	debounced();
</script>

<div>pending={debounced.pending}</div>
