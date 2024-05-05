import { untrack } from "svelte";

/**
 * Returns a box with the mounted state of the component
 * that invokes this function.
 *
 * @see {@link https://runed.dev/docs/functions/use-mounted}
 */
export class IsMounted {
	#isMounted = $state(false)

	constructor() {
		$effect(() => {
			untrack(() => (this.#isMounted = true))

			return () => {
				this.#isMounted = false;
			};
		})
	}

	get value() {
		return this.#isMounted
	}
}