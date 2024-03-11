<script lang="ts">
	import { CopyCodeButton } from "$lib/components/index.js";
	import { cn, createCopyCodeButton } from "$lib/utils/index.js";

	const { copyCode, copied, setCodeString } = createCopyCodeButton();
</script>

<pre use:setCodeString class="not-prose" {...$$restProps}>
	<slot />	
</pre>
<CopyCodeButton {copyCode} copied={$copied} class={cn("pre-copy-btn absolute right-4 top-4")} />
