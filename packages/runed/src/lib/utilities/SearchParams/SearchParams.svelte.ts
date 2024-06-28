import { Store } from "../Store/Store.svelte.js";
import { watch } from "../watch/watch.svelte.js";
import { page } from "$app/stores";
import { entries } from "$lib/internal/utils/object.js";
import { goto } from "$app/navigation";

export type SearchParamsSingleOptions<T> = {
	encode?: (value: T) => string;
	decode?: (value: string | null) => T;
	defaultValue?: T;
};

export type SearchParamsAllOptions<T> = {
	[key: string]: SearchParamsSingleOptions<T>;
};

export class SearchParams {
	#params: Record<string, string | null> = $state({});
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
		// TODO: use dynamic setters and getters instead to increase efficiency?
		return this.#params;
	}

	static all() {
		const instance = new SearchParams();
		return instance.params;
	}

	static single<T>(key: string, options: SearchParamsSingleOptions<T> = {}) {
		// TODO: make encode and decode type safe
		const instance = new SearchParams();
		const decode = options.decode ?? ((v) => v);
		// eslint-disable-next-line ts/no-explicit-any
		const encode: (v: any) => string = options.encode ?? ((v: unknown) => `${v}`);
		instance.params[key] = encode(options.defaultValue ?? null)

		return {
			get current() {
				return decode(instance.params[key] ?? null) as T
			},
			set current(value: T) {
				instance.params[key] = options.encode?.(value) ?? `${value}`;
			},
		};
	}
}
