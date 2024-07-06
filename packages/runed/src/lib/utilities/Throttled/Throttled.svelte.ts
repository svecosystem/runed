import { useThrottle } from "../useThrottle/useThrottle.svelte.js";
import { watch } from "../watch/watch.svelte.js";
import type { Getter, MaybeGetter } from "$lib/internal/types.js";
import { noop } from "$lib/internal/utils/function.js";

export class Throttled<T> {
	#current: T = $state()!;
	#throttleFn: ReturnType<typeof useThrottle>;

	constructor(getter: Getter<T>, wait: MaybeGetter<number> = 250) {
		this.#current = getter(); // Immediately set the initial value

		this.#throttleFn = useThrottle(() => {
			this.#current = getter();
		}, wait);

		watch(getter, () => {
			this.#throttleFn()?.catch(noop);
		});
	}

	get current(): T {
		return this.#current;
	}

	cancel() {
		this.#throttleFn.cancel();
	}

	setImmediately(v: T) {
		this.cancel();
		this.#current = v;
	}
}
