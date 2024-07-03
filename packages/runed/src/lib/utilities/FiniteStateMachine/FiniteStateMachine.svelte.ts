export type FSMLifecycleFn<StatesT extends string, EventsT extends string> = (
	meta: LifecycleFnMeta<StatesT, EventsT>
) => void;

export type LifecycleFnMeta<StatesT extends string, EventsT extends string> = {
	from: StatesT | null;
	to: StatesT;
	event: EventsT | null;
	args: unknown;
};

export function isLifecycleFnMeta<StatesT extends string, EventsT extends string>(
	meta: unknown
): meta is LifecycleFnMeta<StatesT, EventsT> {
	return (
		!!meta &&
		typeof meta === "object" &&
		"to" in meta &&
		"from" in meta &&
		"event" in meta &&
		"args" in meta
	);
}

export type FSMLifecycle = "_enter" | "_exit";

// Actions are either a StateT (string)
// or a function that optionally returns a StateT
export type ActionFn<StatesT> = (...args: unknown[]) => StatesT | void;
export type Action<StatesT> = StatesT | ActionFn<StatesT>;

// State handlers are objects that map events to actions
// or lifecycle functions to handlers
export type StateHandler<StatesT extends string, EventsT extends string> = {
	[e in EventsT]?: Action<StatesT>;
} & {
	[k in FSMLifecycle]?: FSMLifecycleFn<StatesT, EventsT>;
};

export type Transition<StatesT extends string, EventsT extends string> = {
	[s in StatesT]: StateHandler<StatesT, EventsT>;
} & {
	// '*' is a special fallback handler state.
	// If no handler is found on the current state and the '*' state exists,
	// the handler from the '*' state will be used.
	// We can't put the '*' in the same object, has to be an intersection or
	// the typescript compiler will complain about mapped types not being
	// able to declare properties or methods
	"*"?: StateHandler<StatesT, EventsT>;
};

/**
 * Defines a strongly-typed finite state machine.
 *
 * @see {@link https://runed.dev/docs/utilities/finite-state-machine}
 */
export class FiniteStateMachine<StatesT extends string, EventsT extends string> {
	#current = $state() as StatesT;
	readonly states: Transition<StatesT, EventsT>;
	#timeout: Partial<Record<EventsT, NodeJS.Timeout>> = {};

	constructor(initial: StatesT, states: Transition<StatesT, EventsT>) {
		this.#current = initial;
		this.states = states;
		// synthetically trigger _enter for the initial state.
		this.#dispatch("_enter", { from: null, to: initial, event: null, args: [] });
	}

	#transition(newState: StatesT, event: EventsT, args: unknown[]) {
		const metadata = { from: this.#current, to: newState, event, args };
		this.#dispatch("_exit", metadata);
		this.#current = newState;
		this.#dispatch("_enter", metadata);
	}

	#dispatch(event: EventsT | FSMLifecycle, ...args: unknown[]): StatesT | void {
		const action = this.states[this.#current]?.[event] ?? this.states["*"]?.[event];
		if (action instanceof Function) {
			if (event === "_enter" || event === "_exit") {
				if (isLifecycleFnMeta<StatesT, EventsT>(args[0])) {
					(action as FSMLifecycleFn<StatesT, EventsT>)(args[0]);
				} else {
					console.warn("Invalid metadata passed to lifecycle function of the FSM.");
				}
			} else {
				return (action as ActionFn<StatesT>)(...args);
			}
		} else if (typeof action === "string") {
			return action as StatesT;
		} else if (event !== "_enter" && event !== "_exit") {
			console.warn("No action defined for event", event, "in state", this.#current);
		}
	}

	/** Triggers a new event and returns the new state. */
	send(event: EventsT, ...args: unknown[]) {
		const newState = this.#dispatch(event, ...args);
		if (newState && newState !== this.#current) {
			this.#transition(newState as StatesT, event, args);
		}
		return this.#current;
	}

	/** Debounces the triggering of an event. */
	async debounce(wait: number = 500, event: EventsT, ...args: unknown[]): Promise<StatesT> {
		if (this.#timeout[event]) {
			clearTimeout(this.#timeout[event]);
		}
		return new Promise((resolve) => {
			this.#timeout[event] = setTimeout(() => {
				delete this.#timeout[event];
				resolve(this.send(event, ...args));
			}, wait);
		});
	}

	/** The current state. */
	get current() {
		return this.#current;
	}
}
