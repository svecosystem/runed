import type { Snippet } from "svelte";
import type { Context } from "../Context/index.js";

export type ContextProviderProps<TContext> = {
	context: Context<TContext>;
	value: TContext;
	children: Snippet;
};
