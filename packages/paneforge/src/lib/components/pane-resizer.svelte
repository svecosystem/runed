<script lang="ts">
	import {
		getResizeHandleElementIndex,
		getResizeHandleElementsForGroup,
	} from "$lib/internal/paneforge.js";
	import type { ResizeHandler } from "$lib/internal/types.js";
	import { getCursorStyle, generateId, styleToString } from "$lib/internal/utils/index.js";
	import { onMount } from "svelte";
	import { getCtx } from "./ctx.js";
	import { resizeHandleAction } from "./pane-resizer.js";
	import type { PaneResizerProps, PaneResizerAttributes } from "./types.js";

	type $$Props = PaneResizerProps;

	export let disabled: $$Props["disabled"] = false;
	export let onDraggingChange: $$Props["onDraggingChange"] = undefined;
	export let tabIndex: $$Props["tabIndex"] = 0;
	export let el: $$Props["el"] = null;

	export let idFromProps: $$Props["id"] = undefined;
	export { idFromProps as id };
	export let styleFromProps: $$Props["style"] = undefined;
	export { styleFromProps as style };

	const {
		methods: { registerResizeHandle, startDragging, stopDragging },
		states: { direction, dragState, groupId },
	} = getCtx("PaneResizer");

	const resizeHandleId = generateId(idFromProps);
	$: isDragging = $dragState?.dragHandleId === resizeHandleId;

	let isFocused = false;

	let resizeHandler: ResizeHandler | null = null;

	function stopDraggingAndBlur() {
		const element = el;
		if (!element) return;

		element.blur();
		stopDragging();

		onDraggingChange?.(false);
	}

	onMount(() => {
		if (disabled) {
			resizeHandler = null;
		} else {
			resizeHandler = registerResizeHandle(resizeHandleId);
		}
	});

	$: if (disabled) {
		resizeHandler = null;
	} else {
		resizeHandler = registerResizeHandle(resizeHandleId);
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLElement }) {
		if (disabled || !resizeHandler || event.defaultPrevented) return;

		const resizeKeys = ["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "End", "Home"];

		if (resizeKeys.includes(event.key)) {
			event.preventDefault();
			resizeHandler(event);
			return;
		}

		if (event.key !== "F6") return;

		event.preventDefault();

		const handles = getResizeHandleElementsForGroup($groupId);
		const index = getResizeHandleElementIndex($groupId, resizeHandleId);

		if (index === null) return;

		const nextIndex = event.shiftKey
			? index > 0
				? index - 1
				: handles.length - 1
			: index + 1 < handles.length
				? index + 1
				: 0;

		const nextHandle = handles[nextIndex] as HTMLElement;
		nextHandle.focus();
	}

	$: style =
		styleToString({
			cursor: getCursorStyle($direction),
			touchAction: "none",
			userSelect: "none",
		}) + styleFromProps ?? "";

	$: attrs = {
		"data-direction": $direction,
		"data-pane-group-id": $groupId,
		"data-active": isDragging ? "pointer" : isFocused ? "keyboard" : undefined,
		"data-enabled": !disabled,
		"data-pane-resizer-id": resizeHandleId,
		"data-pane-resizer": "",
	} satisfies PaneResizerAttributes;
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- eslint-disable-next-line svelte/valid-compile -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	bind:this={el}
	role="separator"
	{style}
	use:resizeHandleAction={{
		disabled,
		resizeHandler,
		stopDragging,
		isDragging,
		onDragging: onDraggingChange,
	}}
	on:keydown={handleKeydown}
	on:blur={() => (isFocused = false)}
	on:focus={() => (isFocused = true)}
	on:mousedown={(e) => {
		startDragging(resizeHandleId, e);
		onDraggingChange?.(true);
	}}
	on:mouseup={stopDraggingAndBlur}
	on:touchcancel={stopDraggingAndBlur}
	on:touchend={stopDraggingAndBlur}
	on:touchstart={(e) => {
		startDragging(resizeHandleId, e);
		onDraggingChange?.(true);
	}}
	tabindex={tabIndex}
	{...attrs}
	{...$$restProps}
>
	<slot />
</div>
