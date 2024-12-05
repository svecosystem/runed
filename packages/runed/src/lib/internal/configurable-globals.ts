// configurable-globals.ts
import { BROWSER } from "esm-env";

export type ConfigurableWindow = {
	window?: Window;
};

export type ConfigurableDocument = {
	document?: Document;
};

export type ConfigurableNavigator = {
	navigator?: Navigator;
};

export type ConfigurableLocation = {
	location?: Location;
};

export const defaultWindow = /* #__PURE__ */ BROWSER ? window : undefined;
export const defaultDocument = /* #__PURE__ */ BROWSER ? window.document : undefined;
export const defaultNavigator = /* #__PURE__ */ BROWSER ? window.navigator : undefined;
export const defaultLocation = /* #__PURE__ */ BROWSER ? window.location : undefined;
