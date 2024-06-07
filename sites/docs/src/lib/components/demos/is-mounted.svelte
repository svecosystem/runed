<script lang="ts">
	import { IsMounted } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";

	const isMounted = new IsMounted();
</script>

<DemoContainer>
	<p>Mounted: <b>{isMounted.current ? "true" : "false"}</b></p>
</DemoContainer>
