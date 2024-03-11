<script lang="ts">
	export let tocIgnore = false;
</script>

<h3
	class="font-heading mt-8 scroll-m-20 font-semibold tracking-tight"
	data-toc-ignore={tocIgnore ? "" : undefined}
>
	<slot />
</h3>
