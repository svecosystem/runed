import { useActiveElement } from "../useActiveElement/useActiveElement.svelte.js";

/**
 * An object holding a reactive value that is equal to `document.activeElement`.
 * It automatically listens for changes, keeping the reference up to date.
 *
 * @see {@link https://runed.dev/docs/utilities/active-element}
 */
export const activeElement = useActiveElement();
