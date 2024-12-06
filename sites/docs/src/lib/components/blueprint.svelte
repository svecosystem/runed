<script lang="ts" module>
	// prettier-ignore
	export { a, blockquote, code, h1, h2, h3, h4, h5, h6, hr, img, li, ol, p, pre, table, td, th, tr, ul } from '@svecodocs/kit'
</script>

<script lang="ts">
	let { children } = $props();
</script>

{@render children?.()}
