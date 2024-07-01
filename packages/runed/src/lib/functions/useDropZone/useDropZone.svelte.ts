import { type ReadableBox, type WritableBox, box } from "../box/box.svelte.js";
import { useEventListener } from "../useEventListener/useEventListener.svelte.js";
import type { MaybeBoxOrGetter } from "$lib/internal/types.js";
import { isBrowser } from "$lib/internal/utils/browser.js";
import { isNotNullish } from "$lib/internal/utils/is.js";

export type UseDropZoneReturn = {
	files: WritableBox<File[] | null>;
	isOverDropZone: ReadableBox<boolean>;
};

export type UseDropZoneOptions = {
	/**
	 * Allowed file data types. If not provided, all file types are allowed.
	 * Can also be a predicate that receives an array of types attempting to be dropped
	 * to determine if the file types are allowed.
	 */
	dataTypes?: MaybeBoxOrGetter<string[]> | ((types: readonly string[]) => boolean);

	/**
	 * A callback fired when the user drops files on the drop zone.
	 */
	onDrop?: (files: File[] | null, event: DragEvent) => void;

	/**
	 * A callback fired when the user enters the drop zone with files.
	 */
	onEnter?: (files: File[] | null, event: DragEvent) => void;

	/**
	 * A callback fired when the user leaves the drop zone with files.
	 */
	onLeave?: (files: File[] | null, event: DragEvent) => void;

	/**
	 * A callback fired when the user is over the drop zone with files.
	 */
	onOver?: (files: File[] | null, event: DragEvent) => void;
};

export function useDropZone(
	_node: MaybeBoxOrGetter<HTMLElement | null | undefined>,
	_options: UseDropZoneOptions | UseDropZoneOptions["onDrop"] = {}
): UseDropZoneReturn {
	const node = box.from(_node);
	const isOverDropZone = box(false);
	const files = box<File[] | null>(null);

	let counter = 0;
	let isDataTypeIncluded = true;
	if (!isBrowser) return { files, isOverDropZone };

	const options = typeof _options === "function" ? { onDrop: _options } : _options;
	const dataTypes = box.from(options.dataTypes);

	function getFiles(e: DragEvent) {
		const fileList = Array.from(e.dataTransfer?.files ?? []);
		return (files.value = fileList.length === 0 ? null : fileList);
	}

	useEventListener(node, "dragenter", (e) => {
		const types = Array.from(e.dataTransfer?.items || [])
			.map((file) => (file.kind === "file" ? file.type : null))
			.filter(isNotNullish);

		if (dataTypes.value && e.dataTransfer) {
			isDataTypeIncluded =
				typeof dataTypes.value === "function"
					? dataTypes.value(types)
					: dataTypes
						? dataTypes.value.some((type) => types.includes(type))
						: true;
			if (!isDataTypeIncluded) return;
		}
		e.preventDefault();
		counter += 1;
		isOverDropZone.value = true;
		options.onEnter?.(getFiles(e), e);
	});

	useEventListener(node, "dragover", (e) => {
		if (!isDataTypeIncluded) return;
		e.preventDefault();
		options.onOver?.(getFiles(e), e);
	});

	useEventListener(node, "dragleave", (e) => {
		if (!isDataTypeIncluded) return;
		e.preventDefault();
		counter -= 1;
		if (counter === 0) {
			isOverDropZone.value = false;
		}
		options.onLeave?.(getFiles(e), e);
	});

	useEventListener(node, "drop", (e) => {
		e.preventDefault();
		counter = 0;
		isOverDropZone.value = false;
		options.onDrop?.(getFiles(e), e);
	});

	return {
		files,
		isOverDropZone,
	};
}
