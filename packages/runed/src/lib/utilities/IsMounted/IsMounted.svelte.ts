import { untrack } from "svelte";

/**
 * Returns an object with the mounted state of the component
 * that invokes this function.
 *
 * @see {@link https://runed.dev/docs/utilities/is-mounted}
 */
export class IsMounted {
	#isMounted = $state(false);

	constructor() {
		$effect(() => {
			untrack(() => (this.#isMounted = true));

			return () => {
				this.#isMounted = false;
			};
		});
	}

	get current() {
		return this.#isMounted;
	}
}
