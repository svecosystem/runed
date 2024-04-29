import { box } from "../index.js";
import type { BoxOrGetter } from "$lib/internal/types.js";



/**
 * Holds the previous value of a box or getter.
 *
 * @see {@link https://runed.dev/docs/functions/use-previous}
 */
export function usePrevious<T>(value: BoxOrGetter<T>) {
  const boxed = box.from(value);
  let curr: T | undefined
  const previous = box<T | undefined>(undefined);

  $effect(() => {
    previous.value = curr
    curr = boxed.value
  })

  return previous
}