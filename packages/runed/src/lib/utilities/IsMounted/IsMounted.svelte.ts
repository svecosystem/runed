/**
 * Returns an object with the mounted state of the component
 * that invokes this function.
 *
 * @see {@link https://runed.dev/docs/utilities/use-mounted}
 */
export class IsMounted {
	#current: boolean = $state(false);

	constructor() {
		$effect(() => {
			this.#current = true;

			return () => {
				this.#current = false;
			};
		});
	}

	get current(): boolean {
		return this.#current;
	}
}
