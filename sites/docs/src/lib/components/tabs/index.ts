import { createContext } from "$lib/utils/contextify";
import type { Writable } from "svelte/store";

export const [getTabsCtx, setTabsCtx] = createContext<{ items: Writable<string[]> }>();

export { default as Tabs } from "./tabs.svelte";
export { default as TabItem } from "./tabs-item.svelte";
