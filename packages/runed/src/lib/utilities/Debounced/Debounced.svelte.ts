import { useDebounce } from "../useDebounce/useDebounce.svelte.js";
import { watch } from "../watch/watch.svelte.js";
import type { Getter, MaybeGetter } from "$lib/internal/types.js";
import { noop } from "$lib/internal/utils/function.js";

/**
 * Description placeholder
 *
 * @export
 * @class Debounced
 */
export class Debounced<T> {
	#current: T = $state()!;
	#debounceFn: ReturnType<typeof useDebounce>;

	constructor(getter: Getter<T>, wait: MaybeGetter<number> = 250) {
		this.#current = getter(); // immediately set the initial value

		this.#debounceFn = useDebounce(() => {
			this.#current = getter();
		}, wait);

		watch(getter, () => {
			this.#debounceFn().catch(noop);
		});
	}

	get current(): T {
		return this.#current;
	}

	cancel() {
		this.#debounceFn.cancel();
	}

	updateImmediately() {
		return this.#debounceFn.runScheduledNow();
	}

	setImmediately(v: T) {
		this.cancel();
		this.#current = v;
	}
}
