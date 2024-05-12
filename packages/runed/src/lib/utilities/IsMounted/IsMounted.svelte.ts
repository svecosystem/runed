/**
 * Returns an object with the mounted state of the component
 * that invokes this function.
 *
 * @see {@link https://runed.dev/docs/utilities/use-mounted}
 */
export class IsMounted {
	#isMounted: boolean = $state(false);

	constructor() {
		$effect(() => {
			this.#isMounted = true;

			return () => {
				this.#isMounted = false;
			};
		});
	}

	get current(): boolean {
		return this.#isMounted;
	}
}
