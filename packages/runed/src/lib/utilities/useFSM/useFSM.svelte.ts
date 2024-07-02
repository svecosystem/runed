export type FSMLifecycleFn<StatesT extends string, EventsT extends string> = (
	meta: LifecycleFnMeta<StatesT, EventsT>
) => void;

export type LifecycleFnMeta<StatesT extends string, EventsT extends string> = {
	from: StatesT | null;
	to: StatesT;
	event: EventsT | null;
	args: any;
};

export function isLifecycleFnMeta(meta: unknown): meta is LifecycleFnMeta<any, any> {
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
export type Action<StatesT> = StatesT | ((...args: any[]) => StatesT | void);

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

export function useFSM<StatesT extends string, EventsT extends string>(
	initial: StatesT,
	states: Transition<StatesT, EventsT>
) {
	let current = $state<StatesT>(initial);

	const transition = (newState: StatesT, event: EventsT, args: any[]) => {
		const metadata = { from: current, to: newState, event, args };
		dispatch("_exit", metadata);
		current = newState;
		dispatch("_enter", metadata);
	};

	const dispatch = (event: EventsT | FSMLifecycle, ...args: any[]): StatesT | void => {
		const action = states[current]?.[event] ?? states["*"]?.[event];
		if (action instanceof Function) {
			if (event === "_enter" || event === "_exit") {
				if (isLifecycleFnMeta(args[0])) {
					(action as FSMLifecycleFn<StatesT, EventsT>)(args[0]);
					return;
				} else {
					console.warn("Invalid metadata passed to lifecycle function of the FSM.");
				}
			} else {
				return (action as (...args: any[]) => void | StatesT)(...args);
			}
		} else if (typeof action === "string") {
			return action as StatesT;
		} else {
			if (event !== "_enter" && event !== "_exit") {
				console.warn("No action defined for event", event, "in state", current);
			}
		}
	};

	const timeout: Partial<Record<EventsT, NodeJS.Timeout>> = {};

	const f = {
		get current() {
			return current;
		},

		send(event: EventsT, ...args: any[]) {
			const newState = dispatch(event, ...args);
			if (newState && newState !== current) {
				transition(newState as StatesT, event, args);
			}
			return current;
		},

		async debounce(wait: number = 500, event: EventsT, ...args: any[]): Promise<StatesT> {
			if (timeout[event]) {
				clearTimeout(timeout[event]);
			}
			// await new Promise((resolve) => (timeout[event] = setTimeout(resolve, wait)));
			return new Promise((resolve) => {
				timeout[event] = setTimeout(() => {
					delete timeout[event];
					resolve(this.send(event, ...args));
				}, wait);
			});
		},
	};

	// synthetically trigger _enter for the initial state.
	dispatch("_enter", { from: null, to: initial, event: null, args: [] });

	return f;
}
