/**
 * Register a cleanup function that will be called when the current effect context is disposed,
 * which could be when a component is destroyed or when a root effect is disposed.
 *
 * @see {@link https://runed.dev/docs/utilities/on-cleanup}
 *
 * @param cb - The cleanup function to register.
 */
export function onCleanup(cb: () => void): void {
	$effect(() => {
		return () => {
			cb();
		};
	});
}
