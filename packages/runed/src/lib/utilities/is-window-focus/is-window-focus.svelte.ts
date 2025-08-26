import { useEventListener } from "$lib/utilities/use-event-listener/use-event-listener.svelte.js";

/**
 * Tracks whether the user is focused on the window.
 * @see {@link https://runed.dev/docs/utilities/is-windows-focus}
 */
export class IsWindowFocus {
	#isWindowFocus = () => document.visibilityState === 'visible'
	#current: boolean = $state(this.#isWindowFocus());
	constructor() {
		const document = window?.document;

		useEventListener(
			() => document,
			"visibilitychange",
			() => {
				this.#current = this.#isWindowFocus();
			},
		);
	}

	get current(): boolean {
		return this.#current;
	}
}