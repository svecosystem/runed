<script lang="ts">
	import { IsMounted } from "runed";

	const isMounted = new IsMounted();
</script>

<div class="rounded-md bg-card p-8">
	<p>Mounted: <b>{isMounted.value ? "true" : "false"}</b></p>
</div>
