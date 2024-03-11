import type { PaneGroupStorage } from "$lib/internal/utils/storage.js";
import { type DragState, type Direction } from "../internal/types.js";
import type { Writable } from "svelte/store";

export type PaneGroupOnLayout = (layout: number[]) => void;

export type CommittedValues = {
	autoSaveId: string | null;
	direction: Direction;
	dragState: Writable<DragState | null>;
	id: string;
	keyboardResizeBy: number | null;
	onLayout: PaneGroupOnLayout | null;
	storage: PaneGroupStorage;
};
