import {  box } from "../box/box.svelte.js";
import { watch } from "../watch/watch.svelte.js";
import type { MaybeBoxOrGetter,BoxOrGetter } from "$lib/internal/types.js";

type UseStateHistoryOptions = {
	capacity?: MaybeBoxOrGetter<number>;
};

type LogEvent<T> = {
	snapshot: T;
	timestamp: number;
};

/**
 * Tracks the change history of a box, providing undo and redo capabilities.
 *
 * @see {@link https://runed.dev/docs/functions/use-state-history}
 */
export function useStateHistory<T>(_value: BoxOrGetter<T>, options?: UseStateHistoryOptions) {
	const b = box.from(_value)
	const capacity = box.from(options?.capacity);

	const log = box<LogEvent<T>[]>([]);
	const redoStack = box<LogEvent<T>[]>([]);

	const canUndo = box.with(() => log.value.length > 1);
	const canRedo = box.with(() => redoStack.value.length > 0);

	let ignoreUpdate = false;

	function addEvent(event: LogEvent<T>) {
		log.value.push(event);
		if (capacity.value && log.value.length > capacity.value) {
			log.value = log.value.slice(-capacity.value);
		}
	}

	watch(
		() => b.value,
		(v) => {
			if (ignoreUpdate) {
				ignoreUpdate = false;
				return;
			}

			addEvent({ snapshot: v, timestamp: new Date().getTime() });
			redoStack.value = [];
		}
	);

	watch(
		() => capacity.value,
		(c) => {
			if (!c) return;
			log.value = log.value.slice(-c);
		}
	);

	function undo() {
		const [prev, curr] = log.value.slice(-2);
		if (!curr || !prev) return;
		ignoreUpdate = true;
		redoStack.value.push(curr);
		log.value.pop();
		b.value = prev.snapshot;
	}

	function redo() {
		const nextEvent = redoStack.value.pop();
		if (!nextEvent) return;
		ignoreUpdate = true;
		addEvent(nextEvent);
		b.value = nextEvent.snapshot;
	}

	return box.flatten({
		log,
		undo,
		canUndo,
		redo,
		canRedo,
	});
}
