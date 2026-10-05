import "@testing-library/svelte/vitest";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import type * as env from "$app/env";
import type * as navigation from "$app/navigation";

vi.mock("$app/env", (): typeof env => ({
	browser: false,
	dev: true,
	building: false,
	version: "any",
}));

vi.mock("$app/navigation", (): typeof navigation => ({
	afterNavigate: () => {},
	beforeNavigate: () => {},
	disableScrollHandling: () => {},
	goto: () => Promise.resolve(),
	invalidate: () => Promise.resolve(),
	invalidateAll: () => Promise.resolve(),
	refreshAll: () => Promise.resolve(),
	preloadData: () => Promise.resolve({ type: "loaded" as const, status: 200, data: {} }),
	preloadCode: () => Promise.resolve(),
	onNavigate: () => {},
	pushState: () => Promise.resolve(),
	replaceState: () => Promise.resolve(),
	snapshot: () => {},
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
globalThis.ResizeObserver = require("resize-observer-polyfill");
Element.prototype.scrollIntoView = () => {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Element.prototype.hasPointerCapture = (() => {}) as any;

// @ts-expect-error - shut it
globalThis.window.CSS.supports = (_property: string, _value: string) => true;

globalThis.document.elementsFromPoint = () => [];
globalThis.document.elementFromPoint = () => null;
