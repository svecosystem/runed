/**
 * A class that takes a predicate determine if a browser API is supported.
 *
 * Useful for checking if a browser API is supported before attempting to use it.
 *
 * @see {@link https://runed.dev/docs/functions/use-supported}
 */
export class IsSupported {
	#value = $state(false);

	constructor(predicate: () => boolean) {
		$effect(() => {
			this.#value = predicate();
		});
	}

	get value() {
		return this.#value;
	}
}