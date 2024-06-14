<script lang="ts">
	import { IsIdle } from "runed";
	import { cn } from "$lib/utils";

	const isIdle = new IsIdle();
</script>

<div class="rounded-md bg-card p-8">
	<p>
		Idle: <b class={cn(isIdle.current ? "text-green-600" : "text-red-500")}>{isIdle.current}</b>
	</p>
</div>
