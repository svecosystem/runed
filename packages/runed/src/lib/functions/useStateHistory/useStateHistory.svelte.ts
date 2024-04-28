import { untrack } from "svelte";
import { type ReadableBox, type WritableBox, box } from "../box/box.svelte.js";
import { watch } from "../watch/watch.svelte.js";
import type { Getter, MaybeBoxOrGetter } from "$lib/internal/types.js";
import { at, last } from "$lib/internal/utils/array.js";

type UseStateHistoryOptions = {
	capacity?: MaybeBoxOrGetter<number>
}

type LogEvent<T> = {
	snapshot: T
	timestamp: number
}


export function useStateHistory<T>(b: WritableBox<T>, options?: UseStateHistoryOptions) {
	const capacity = box.from(options?.capacity)

	const log = box<LogEvent<T>[]>([])
	const redoStack = box<LogEvent<T>[]>([])

	const canUndo = box.with(() => log.value.length > 1)
	const canRedo = box.with(() => redoStack.value.length > 0)

	let ignoreUpdate = false;
	watch(() => b.value, (v) => {
		if (ignoreUpdate) {
			ignoreUpdate = false
			return
		}

		const timestamp = new Date().getTime()
		log.value = [{ snapshot: v, timestamp }, ...log.value].slice(0, capacity.value)
		redoStack.value = []
	})

	watch(() => capacity.value, (c) => {
		if (!c) return;
		log.value = log.value.slice(-c)
	})


	function undo() {
		const [curr, prev] = log.value
		if (!curr || !prev) return;
		ignoreUpdate = true;
		redoStack.value = [curr, ...redoStack.value]
		log.value = log.value.slice(1)
		b.value = prev.snapshot
	}

	function redo() {
		const nextEvent = redoStack.value[0]
		if (!nextEvent) return;
		ignoreUpdate = true;
		log.value = [nextEvent, ...log.value].slice(0, capacity.value)
		redoStack.value = redoStack.value.slice(1)
		b.value = nextEvent.snapshot
	}


	return box.flatten({
		log,
		undo,
		canUndo,
		redo,
		canRedo
	})

}