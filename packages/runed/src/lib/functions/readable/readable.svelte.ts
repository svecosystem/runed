type MaybeCallback = (() => void) | undefined;
type StartFn = (update: () => void) => MaybeCallback;


/**
 * A function that returns an object with a reactive `current` property that is equal to the 
 * return value of the first function passed to it. 
 * 
 * Accepts a second `start` function which receives an `update` callback, that should be 
 * called whenever the getter function should be re-evaluated.
 * 
 * Useful to create reactive objects without relying on leaky effects.
 * 
 * @example
 * ```html
 * <script>
 * const now = readable(() => new Date(), (update) => {
 * 	const interval = setInterval(() => update(), 1000);
 * 	return () => clearInterval(interval);
 * });
 * </script>
 * 
 * <p>{now.current.toLocaleTimeString()}</p>
 * ```
 * 
 * @see {@link https://runed.dev/docs/functions/readable}
 *
 */
export function readable<ReturnType>(fn: () => ReturnType, start: StartFn) {
  let version = $state(0);
  let listeners = 0;
  let stop: MaybeCallback

  return {
    get current() {
      if ($effect.active()) {
        $effect(() => {
          if (listeners++ === 0) {
            stop = start(() => version++);
          }

          return () => {
            if (--listeners === 0) {
              stop?.();
            }
          }
        });
      }

      // eslint-disable-next-line no-unused-expressions -- Add this to deps
      version;
      return fn();
    }
  };
}