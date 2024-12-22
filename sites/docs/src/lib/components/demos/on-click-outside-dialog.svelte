<script lang="ts">
	import { Button, DemoContainer } from "@svecodocs/kit";
	import { onClickOutside } from "runed";

	let dialog = $state<HTMLDialogElement>()!;

	const clickOutside = onClickOutside(
		() => dialog,
		() => {
			dialog.close();
			clickOutside.stop();
		},
		{ immediate: false }
	);

	function openDialog() {
		dialog.showModal();
		clickOutside.start();
	}

	function closeDialog() {
		dialog.close();
		clickOutside.stop();
	}
</script>

<DemoContainer>
	<Button size="sm" onclick={openDialog}>Open Dialog</Button>
	<dialog
		bind:this={dialog}
		class="bg-background fixed left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 transform rounded-xl border-none p-0 shadow-lg backdrop:bg-black/50"
	>
		<div class="min-w-[360px] max-w-[400px] rounded-xl p-8">
			<p class="mb-4">This is a dialog.</p>
			<p class="mb-4">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque sunt aut sit exercitationem
				deleniti doloremque quo quasi, expedita omnis dicta eaque, eveniet nesciunt nobis sint
				atque? Praesentium facilis officiis perferendis.
			</p>

			<Button size="sm" variant="outline" onclick={closeDialog}>Close Dialog</Button>
		</div>
	</dialog>
</DemoContainer>
