import { extract } from "../extract/index.js";
import { useDebounce } from "../useDebounce/index.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { useEventListener } from "$lib/utilities/useEventListener/useEventListener.svelte.js";

type WindowEvent = keyof WindowEventMap;

export type IsIdleOptions = {
	/**
	 * The events that should set the idle state to `true`
	 *
	 * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
	 */
	events?: MaybeGetter<(keyof WindowEventMap)[]>;
	/**
	 * The timeout in milliseconds before the idle state is set to `true`. Defaults to 60 seconds.
	 *
	 * @default 60000
	 */
	timeout?: MaybeGetter<number>;
	/**
	 * Detect document visibility changes
	 *
	 * @default true
	 */
	detectVisibilityChanges?: MaybeGetter<boolean>;
	/**
	 * The initial state of the idle property
	 *
	 * @default false
	 */
	initialState?: boolean;
};

const DEFAULT_EVENTS = [
	"keypress",
	"mousemove",
	"touchmove",
	"click",
	"scroll",
] satisfies WindowEvent[];

const DEFAULT_OPTIONS = {
	events: DEFAULT_EVENTS,
	initialState: false,
	timeout: 60000,
} satisfies IsIdleOptions;

/**
 * Tracks whether the user is being inactive.
 * @see {@link https://runed.dev/docs/utilities/is-idle}
 */
export class IsIdle {
	#current: boolean = $state(false);
	#lastActive = $state(Date.now());

	constructor(_options?: IsIdleOptions) {
		const options = {
			...DEFAULT_OPTIONS,
			..._options,
		};

		const timeout = $derived(extract(options.timeout));
		const events = $derived(extract(options.events));
		const detectVisibilityChanges = $derived(extract(options.detectVisibilityChanges));
		this.#current = options.initialState;

		const debouncedReset = useDebounce(
			() => {
				this.#current = true;
			},
			() => timeout
		);

		debouncedReset();

		const handleActivity = () => {
			this.#current = false;
			this.#lastActive = Date.now();
			debouncedReset();
		};

		useEventListener(
			() => window,
			events,
			() => {
				handleActivity();
			},
			{ passive: true }
		);

		$effect(() => {
			if (!detectVisibilityChanges) return;
			useEventListener(document, ["visibilitychange"], () => {
				if (document.hidden) return;
				handleActivity();
			});
		});
	}

	get lastActive(): number {
		return this.#lastActive;
	}

	get current(): boolean {
		return this.#current;
	}
}
