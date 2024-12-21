// configurable-globals.ts
import { BROWSER } from "esm-env";

export type ConfigurableWindow = {
	/** Provide a custom `window` object to use in place of the global `window` object. */
	window?: typeof globalThis & Window;
};

export type ConfigurableDocument = {
	/** Provide a custom `document` object to use in place of the global `document` object. */
	document?: Document;
};

export type ConfigurableDocumentOrShadowRoot = {
	/*
	 * Specify a custom `document` instance or a shadow root, e.g. working with iframes or in testing environments.
	 */
	document?: DocumentOrShadowRoot;
};

export type ConfigurableNavigator = {
	/** Provide a custom `navigator` object to use in place of the global `navigator` object. */
	navigator?: Navigator;
};

export type ConfigurableLocation = {
	/** Provide a custom `location` object to use in place of the global `location` object. */
	location?: Location;
};

export const defaultWindow = /* #__PURE__ */ BROWSER ? window : undefined;
export const defaultDocument = /* #__PURE__ */ BROWSER ? window.document : undefined;
export const defaultNavigator = /* #__PURE__ */ BROWSER ? window.navigator : undefined;
export const defaultLocation = /* #__PURE__ */ BROWSER ? window.location : undefined;
