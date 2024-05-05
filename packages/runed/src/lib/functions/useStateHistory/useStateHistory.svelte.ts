import { watch } from "../watch/watch.svelte.js";
import type { MaybeGetter, Setter } from "$lib/internal/types.js";
import { get } from "$lib/internal/utils/get.js";


type LogEvent<T> = {
	snapshot: T;
	timestamp: number;
};


type StateHistoryOptions = {
	capacity?: MaybeGetter<number>;
};

/**
 * Tracks the change history of a value, providing undo and redo capabilities.
 *
 * @see {@link https://runed.dev/docs/functions/use-state-history}
 */
export class StateHistory<T> {
	redoStack = $state<LogEvent<T>[]>([])
	#ignoreUpdate = false
	#set: Setter<T>
	log = $state<LogEvent<T>[]>([])
	canUndo = $derived(this.log.length > 1)
	canRedo = $derived(this.redoStack.length > 0)

	constructor(value: MaybeGetter<T>, set: Setter<T>, options?: StateHistoryOptions) {
		this.redoStack = []
		this.#set = set
		// eslint-disable-next-line ts/no-this-alias
		const instance = this

		function addEvent(event: LogEvent<T>) {
			instance.log.push(event)
			const capacity$ = get(options?.capacity)
			if (capacity$ && instance.log.length > capacity$) {
				instance.log = instance.log.slice(-capacity$)
			}
		}

		watch(
			() => get(value),
			(v) => {
				if (instance.#ignoreUpdate) {
					instance.#ignoreUpdate = false
					return
				}

				addEvent({ snapshot: v, timestamp: new Date().getTime() })
				instance.redoStack = []
			}
		)

		watch(
			() => get(options?.capacity),
			(c) => {
				if (!c) return
				instance.log = instance.log.slice(-c)
			}
		)
	}

	undo = () => {
		const [prev, curr] = this.log.slice(-2)
		if (!curr || !prev) return
		this.#ignoreUpdate = true
		this.redoStack.push(curr)
		this.log.pop()
		this.#set(prev.snapshot)
	}

	redo = () => {
		const nextEvent = this.redoStack.pop()
		if (!nextEvent) return
		this.#ignoreUpdate = true
		this.log.push(nextEvent)
		this.#set(nextEvent.snapshot)
	}
}