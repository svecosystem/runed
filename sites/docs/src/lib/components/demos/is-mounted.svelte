<script lang="ts">
	import { IsMounted } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	const isMounted = new IsMounted();
</script>

<DemoContainer>
	<p>Mounted: <b>{isMounted.current ? "true" : "false"}</b></p>
</DemoContainer>
