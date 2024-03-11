<script lang="ts">
	import { setCtx } from "./ctx.js";
	import { type PaneGroupStorage } from "$lib/internal/utils/index.js";
	import type { PaneGroupOnLayout } from "./pane-group.js";
	import { defaultStorage } from "$lib/internal/paneforge.js";
	import type { PaneGroupProps } from "./types.js";

	type $$Props = PaneGroupProps;

	export let autoSaveId: string | null = null;
	export let direction: $$Props["direction"];
	export let id: $$Props["id"] = null;
	export let keyboardResizeBy: number | null = null;
	export let onLayoutChange: PaneGroupOnLayout | null = null;
	export let storage: PaneGroupStorage = defaultStorage as PaneGroupStorage;
	export let el: $$Props["el"] = undefined;
	export let paneGroup: $$Props["paneGroup"] = undefined;

	let styleFromProps: $$Props["style"] = undefined;
	export { styleFromProps as style };

	const {
		states: { paneGroupStyle, paneGroupSelectors, groupId },
		methods: { setLayout, getLayout },
		updateOption,
	} = setCtx({
		autoSaveId,
		direction,
		id,
		keyboardResizeBy,
		onLayout: onLayoutChange,
		storage,
	});

	$: updateOption("autoSaveId", autoSaveId);
	$: updateOption("direction", direction);
	$: updateOption("id", id);
	$: updateOption("keyboardResizeBy", keyboardResizeBy);
	$: updateOption("onLayout", onLayoutChange);
	$: updateOption("storage", storage);

	paneGroup = {
		getLayout,
		setLayout,
		getId: () => $groupId,
	};

	$: style = $paneGroupStyle + (styleFromProps ?? "");
</script>

<div bind:this={el} id={$groupId} {...$paneGroupSelectors} {style} {...$$restProps}>
	<slot />
</div>
