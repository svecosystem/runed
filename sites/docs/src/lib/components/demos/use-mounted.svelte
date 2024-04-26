<script lang="ts">
	import { useMounted } from "runed";

	const isMounted = useMounted();
</script>

<p>{isMounted.value ? "mounted" : "not mounted"}</p>
