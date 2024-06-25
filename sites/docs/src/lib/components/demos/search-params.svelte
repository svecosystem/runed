<script lang="ts">
	import { SearchParams, Store } from "runed";
	import { Button } from "../ui/button";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import { page as page_store } from "$app/stores";
	import { goto } from "$app/navigation";

	let params = SearchParams.all();
	const page = new Store(page_store);

	function setPage() {
		const currentUrl = page.current.url.href.split("?")[0];
		goto(`${currentUrl}?a=1&b=${Math.random()}&c=${Math.random()}`);
	}

	function setParams() {
		console.log(params)
		params.a = 2;
		params.b = Math.random();
		params.c = Math.random();
	}
</script>

<DemoContainer>
	<pre>{page.current.url.href}</pre>
	<pre>{JSON.stringify(params, null, 2)}</pre>
	<Button onclick={setPage}>set with page store</Button>
	<Button onclick={setParams}>set with SearchParams</Button>
</DemoContainer>
