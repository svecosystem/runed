import { watch } from "../watch/watch.svelte.js";
import type { Getter, MaybeGetter, Setter } from "$lib/internal/types.js";
import { extract } from "$lib/internal/utils/extract.js";

export type LogEvent<T> = {
	snapshot: T;
	timestamp: number;
};

export type StateHistoryOptions = {
	capacity?: MaybeGetter<number>;
};

/**
 * Tracks the change history of a value, providing undo and redo capabilities.
 *
 * @see {@link https://runed.dev/docs/utilities/use-state-history}
 */
export class StateHistory<T> {
	readonly #set: Setter<T>;
	#redoStack: LogEvent<T>[] = $state([]);
	#ignoreUpdate: boolean = false;
	log: LogEvent<T>[] = $state([]);

	readonly canUndo: boolean = $derived(this.log.length > 1);
	readonly canRedo: boolean = $derived(this.#redoStack.length > 0);

	constructor(getter: Getter<T>, set: Setter<T>, options: StateHistoryOptions = {}) {
		this.#set = set;

		watch(getter, (v) => {
			if (this.#ignoreUpdate) {
				this.#ignoreUpdate = false;
				return;
			}

			this.#addEvent({ snapshot: v, timestamp: new Date().getTime() }, options);
			this.#redoStack = [];
		});

		watch(
			() => extract(options?.capacity),
			(c) => {
				if (!c) return;
				this.log = this.log.slice(-c);
			}
		);
	}

	#addEvent(event: LogEvent<T>, options: StateHistoryOptions): void {
		this.log.push(event);
		const capacity$ = extract(options.capacity);
		if (capacity$ && this.log.length > capacity$) {
			this.log = this.log.slice(-capacity$);
		}
	}

	readonly undo = () => {
		const [prev, curr] = this.log.slice(-2);
		if (!curr || !prev) return;
		this.#ignoreUpdate = true;
		this.#redoStack.push(curr);
		this.log.pop();
		this.#set(prev.snapshot);
	};

	readonly redo = () => {
		const nextEvent = this.#redoStack.pop();
		if (!nextEvent) return;
		this.#ignoreUpdate = true;
		this.log.push(nextEvent);
		this.#set(nextEvent.snapshot);
	};
}
