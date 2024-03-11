<script lang="ts">
	import type { PaneData } from "$lib/internal/types.js";
	import { generateId } from "$lib/internal/utils/index.js";
	import { onMount } from "svelte";
	import { getCtx } from "./ctx.js";
	import type { PaneProps, PaneAttributes } from "./types.js";

	type $$Props = PaneProps;

	export let collapsedSize: $$Props["collapsedSize"] = undefined;
	export let collapsible: $$Props["collapsible"] = undefined;
	export let defaultSize: $$Props["defaultSize"] = undefined;
	export let maxSize: $$Props["maxSize"] = undefined;
	export let minSize: $$Props["minSize"] = undefined;
	export let onCollapse: $$Props["onCollapse"] = undefined;
	export let onExpand: $$Props["onExpand"] = undefined;
	export let onResize: $$Props["onResize"] = undefined;
	export let order: $$Props["order"] = undefined;
	export let el: $$Props["el"] = undefined;
	export let pane: $$Props["pane"] = undefined;

	let idFromProps: $$Props["id"] = undefined;
	export { idFromProps as id };

	let styleFromProps: $$Props["style"] = undefined;
	export { styleFromProps as style };

	const {
		methods: {
			getPaneStyle,
			registerPane,
			unregisterPane,
			collapsePane,
			expandPane,
			getSize,
			isCollapsed,
			isExpanded,
			resizePane,
		},
		states: { groupId },
	} = getCtx("Pane");

	const paneId = generateId(idFromProps);

	let paneData: PaneData;

	$: paneData = {
		callbacks: {
			onCollapse,
			onExpand,
			onResize,
		},
		constraints: {
			collapsedSize,
			collapsible,
			defaultSize,
			maxSize,
			minSize,
		},
		id: paneId,
		idIsFromProps: idFromProps !== undefined,
		order,
	};

	pane = {
		collapse: () => {
			collapsePane(paneData);
		},
		expand: () => expandPane(paneData),
		getSize: () => getSize(paneData),
		isCollapsed: () => isCollapsed(paneData),
		isExpanded: () => isExpanded(paneData),
		resize: (size: number) => resizePane(paneData, size),
		getId: () => paneId,
	};

	onMount(() => {
		registerPane(paneData);

		return () => {
			unregisterPane(paneData);
		};
	});

	$: style = $getPaneStyle(paneData, defaultSize) + (styleFromProps ?? "");

	$: attrs = {
		"data-pane": "",
		"data-pane-id": paneId,
		"data-pane-group-id": $groupId,
	} satisfies PaneAttributes;
</script>

<div bind:this={el} {style} {...attrs} {...$$restProps}>
	<slot />
</div>
