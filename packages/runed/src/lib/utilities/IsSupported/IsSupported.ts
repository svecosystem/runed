/**
 * A class that takes a predicate determine if a browser API is supported.
 *
 * Useful for checking if a browser API is supported before attempting to use it.
 *
 * @see {@link https://runed.dev/docs/utilities/use-supported}
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
