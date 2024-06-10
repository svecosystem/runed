const DEFAULT_EVENTS = [
	"keypress",
	"mousemove",
	"touchmove",
	"click",
	"scroll",
] satisfies (keyof WindowEventMap)[];

const DEFAULT_OPTIONS = {
	events: DEFAULT_EVENTS,
	initialState: false,
};

/**
 * Tracks whether the user is being inactive.
 * @see {@link https://runed.dev/docs/utilities/is-idle}
 */
export class IsIdle {
	#idle = $state<boolean>();
	#timer = $state<number>();
	#timeout = $state<number>();
	#events: (keyof WindowEventMap)[];

	constructor(timeout = 500, options: Partial<typeof DEFAULT_OPTIONS> = DEFAULT_OPTIONS) {
		this.#events = options?.events || ["keypress", "mousemove", "touchmove", "click", "scroll"];
		this.#idle = options?.initialState ?? false;
		this.#timeout = timeout;

		$effect(() => {
			this.#events.forEach((event) => document.addEventListener(event, this.reset));

			// remove event listeners onUnmount
			return () => {
				this.#events.forEach((event) => document.removeEventListener(event, this.reset));
			};
		});
	}

  // allow consumer to manually reset state
	reset() {
		this.#idle = false;

		if (this.#timer) {
			window.clearTimeout(this.#timer);
		}

		this.#timer = window.setTimeout(() => {
			this.#idle = true;
		}, this.#timeout);
	}

	get current() {
		return this.#idle;
	}
}
