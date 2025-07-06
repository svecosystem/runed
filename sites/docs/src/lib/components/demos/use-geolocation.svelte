<script lang="ts">
	import { useGeolocation } from "runed";
	import { DemoContainer, Button } from "@svecodocs/kit";

	const location = useGeolocation();
</script>

<DemoContainer class="flex flex-col gap-1">
	<pre>Coords: {JSON.stringify(location.position.coords, null, 2)}</pre>
	<pre>Located at: {location.position.timestamp}</pre>
	<pre>Error: {JSON.stringify(location.error, null, 2)}</pre>
	<pre>Is Supported: {location.isSupported}</pre>
	<div class="mt-4 flex items-center gap-2">
		<Button size="sm" onclick={location.pause} disabled={location.isPaused}>Pause</Button>
		<Button size="sm" onclick={location.resume} disabled={!location.isPaused}>Resume</Button>
	</div>
</DemoContainer>
