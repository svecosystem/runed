import { createPaneForge, type CreatePaneForgeProps } from "$lib/internal/paneforge.js";
import { getContext, hasContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater } from "$lib/internal/utils/index.js";

const PF_GROUP_CTX = Symbol("PF_GROUP_CTX");

export function setCtx(props: CreatePaneForgeProps) {
	const paneForge = createPaneForge(removeUndefined(props));
	const updateOption = getOptionUpdater(paneForge.options);

	const ctxValue = { ...paneForge, updateOption };

	setContext(PF_GROUP_CTX, ctxValue);
	return ctxValue;
}

export function getCtx(componentName: string) {
	if (!hasContext(PF_GROUP_CTX)) {
		throw new Error(`${componentName} components must be rendered with a <PaneGroup> container`);
	}
	return getContext<ReturnType<typeof setCtx>>(PF_GROUP_CTX);
}
