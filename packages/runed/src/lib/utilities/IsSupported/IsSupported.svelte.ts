/**
 * A class that takes a predicate to determine if a browser API is supported.
 *
 * Useful for checking if a browser API is supported before attempting to use it.
 *
 * @see {@link https://runed.dev/docs/utilities/supported}
 */
export class IsSupported {
	#current: boolean = $state(false);

	constructor(predicate: () => boolean) {
		$effect(() => {
			this.#current = predicate();
		});
	}

	get current(): boolean {
		return this.#current;
	}
}
