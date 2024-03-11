import type {
	PaneResizeHandleOnDragging,
	ResizeEvent,
	ResizeHandler,
} from "$lib/internal/types.js";
import { chain } from "$lib/internal/utils/chain.js";
import { addEventListener } from "$lib/internal/utils/event.js";

type ResizerActionParams = {
	disabled?: boolean;
	resizeHandler: ResizeHandler | null;
	isDragging?: boolean;
	onDragging?: PaneResizeHandleOnDragging;
	stopDragging: () => void;
};

/**
 * A Svelte action that adds resize handle functionality to an element.
 * This action is used to handle the dragging of a resize handle.
 */
export function resizeHandleAction(node: HTMLElement, params: ResizerActionParams) {
	let unsub = () => {};
	function update(params: ResizerActionParams) {
		unsub();
		const { disabled, resizeHandler, isDragging, stopDragging, onDragging = undefined } = params;
		if (disabled || resizeHandler === null || !isDragging) return;

		const onMove = (event: ResizeEvent) => {
			resizeHandler(event);
		};

		const onMouseLeave = (event: ResizeEvent) => {
			resizeHandler(event);
		};

		const stopDraggingAndBlur = () => {
			node.blur();

			stopDragging();

			if (onDragging) {
				onDragging(false);
			}
		};

		unsub = chain(
			addEventListener(document.body, "contextmenu", stopDraggingAndBlur),
			addEventListener(document.body, "mousemove", onMove),
			addEventListener(document.body, "touchmove", onMove, { passive: false }),
			addEventListener(document.body, "mouseleave", onMouseLeave),
			addEventListener(window, "mouseup", stopDraggingAndBlur),
			addEventListener(window, "touchend", stopDraggingAndBlur)
		);
	}
	update(params);

	return {
		update,
		onDestroy() {
			unsub();
		},
	};
}
