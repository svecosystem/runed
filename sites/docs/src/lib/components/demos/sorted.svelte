<script lang="ts">
	import { Sorted } from "runed";
	import Button from "../ui/button/button.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let myArr = $state([5, 3, 2, 1]);

	const sortedNumbers = new Sorted(
		() => myArr,
		(a, b) => a - b
	);

	function createRandomNumbersArray() {
		myArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
	}

	let myObjArr = $state([
		{ amount: 48, accountNumber: "aq03be" },
		{ amount: 22, accountNumber: "u44u58" },
		{ amount: 95, accountNumber: "ktt27" },
	]);

	const sortedObj = new Sorted(
		() => myObjArr,
		(a, b) => a.amount - b.amount
	);

	function createRandomObjArray() {
		myObjArr = Array.from({ length: 3 }, () => ({
			amount: Math.floor(Math.random() * 100),
			accountNumber: Math.random().toString(36).substring(7),
		}));
	}
</script>

<DemoContainer>
	<pre>Original: {JSON.stringify($state.snapshot(myArr))}</pre>
	<pre>Sorted: {JSON.stringify($state.snapshot(sortedNumbers.current))}</pre>

	<Button onclick={createRandomNumbersArray} variant="brand" size="sm">Randomize Array</Button>

	<br />

	<pre>Original: {JSON.stringify($state.snapshot(myObjArr), null, 2)}</pre>
	<pre>Sorted: {JSON.stringify($state.snapshot(sortedObj.current), null, 2)}</pre>

	<Button onclick={createRandomObjArray} variant="brand" size="sm">Randomize Array</Button>
</DemoContainer>
