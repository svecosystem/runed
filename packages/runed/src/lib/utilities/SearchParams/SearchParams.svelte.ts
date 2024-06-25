import { Store } from "../Store/Store.svelte.js";
import { useEventListener } from "../useEventListener/useEventListener.svelte.js";
import { watch } from "../watch/watch.svelte.js";
import { page } from "$app/stores";
import { entries } from "$lib/internal/utils/object.js";
import { goto } from "$app/navigation";

export class SearchParams {
	#params: Record<string, string> = $state({});
	#page = new Store(page);

	// Prohibit using this constructor
	private constructor() {
		// Two-way sync
		watch(
			() => this.#page.current.url.href,
			() => {
				this.#page.current.url.searchParams.forEach((v, k) => {
					if (this.#params[k] === v) return;
					this.#params[k] = v;
				});
			}
		);

		watch(
			() => JSON.stringify(this.#params),
			() => {
				const currentUrl = this.#page.current.url.href.split("?")[0];
				const queryString = entries(this.#params)
					.map(([k, v]) => `${k}=${v}`)
					.join("&");
				goto(`${currentUrl}?${queryString}`);
			}
		);
	}

	get params() {
		return this.#params;
	}

	static all() {
		const instance = new SearchParams();
		return instance.params;
	}
}
