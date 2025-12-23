import { type ConfigurableDocument, defaultDocument } from "../../internal/configurable-globals.js";
import type { MaybeElementGetter } from "../../internal/types.js";
import { extract } from "../extract/extract.svelte.js";
import { useEventListener } from "../use-event-listener/index.js";

export interface UseFullscreenOptions extends ConfigurableDocument {
	/**
	 * Automatically exit fullscreen when component is unmounted
	 *
	 * @default false
	 */
	autoExit?: boolean;
}

export interface UseFullscreenReturn {
	readonly isSupported: boolean;
	readonly isFullscreen: boolean;
	enter: () => Promise<void>;
	exit: () => Promise<void>;
	toggle: () => Promise<void>;
}

const eventHandlers = [
	"fullscreenchange",
	"webkitfullscreenchange",
	"webkitendfullscreen",
	"mozfullscreenchange",
	"MSFullscreenChange",
] as any as "fullscreenchange"[];

/**
 * Reactive Fullscreen API.
 *
 * @see https://runed.dev/docs/utilities/use-fullscreen
 * @param targetGetter
 * @param options
 */
export function useFullscreen<T extends Element = HTMLElement>(
	targetGetter?: MaybeElementGetter<T>,
	options: UseFullscreenOptions = {}
): UseFullscreenReturn {
	const { document = defaultDocument, autoExit = false } = options;

	let target = $derived(extract(targetGetter) ?? document?.documentElement) as T | null | undefined;
	let isFullscreen = $state(false);

	const requestMethod = $derived.by<"requestFullscreen" | undefined>(() => {
		return [
			"requestFullscreen",
			"webkitRequestFullscreen",
			"webkitEnterFullscreen",
			"webkitEnterFullScreen",
			"webkitRequestFullScreen",
			"mozRequestFullScreen",
			"msRequestFullscreen",
		].find((m) => (document && m in document) || (target && m in target)) as
			| "requestFullscreen"
			| undefined;
	});

	const exitMethod = $derived.by<"exitFullscreen" | undefined>(() => {
		return [
			"exitFullscreen",
			"webkitExitFullscreen",
			"webkitExitFullScreen",
			"webkitCancelFullScreen",
			"mozCancelFullScreen",
			"msExitFullscreen",
		].find((m) => (document && m in document) || (target && m in target)) as
			| "exitFullscreen"
			| undefined;
	});

	const fullscreenEnabled = $derived.by<"fullscreenEnabled" | undefined>(() => {
		return [
			"fullScreen",
			"webkitIsFullScreen",
			"webkitDisplayingFullscreen",
			"mozFullScreen",
			"msFullscreenElement",
		].find((m) => (document && m in document) || (target && m in target)) as
			| "fullscreenEnabled"
			| undefined;
	});

	const fullscreenElementMethod = [
		"fullscreenElement",
		"webkitFullscreenElement",
		"mozFullScreenElement",
		"msFullscreenElement",
	].find((m) => document && m in document) as "fullscreenElement" | undefined;

	const isSupported = $derived(
		!!(target && document && requestMethod && exitMethod && fullscreenEnabled)
	);

	const isCurrentElementFullScreen = (): boolean => {
		if (fullscreenElementMethod) return document?.[fullscreenElementMethod] === target;
		return false;
	};

	const isElementFullScreen = (): boolean => {
		if (fullscreenEnabled) {
			if (document && document[fullscreenEnabled] != null) {
				return document[fullscreenEnabled];
			} else {
				// @ts-expect-error - Fallback for WebKit and iOS Safari browsers
				if (target?.[fullscreenEnabled] != null) {
					// @ts-expect-error - Fallback for WebKit and iOS Safari browsers
					return Boolean(target[fullscreenEnabled]);
				}
			}
		}
		return false;
	};

	async function exit() {
		if (!isSupported || !isFullscreen) return;
		if (exitMethod) {
			if (document?.[exitMethod] != null) {
				await document[exitMethod]();
			} else {
				// @ts-expect-error - Fallback for Safari iOS
				if (target?.[exitMethod] != null)
					// @ts-expect-error - Fallback for Safari iOS
					await target[exitMethod]();
			}
		}

		isFullscreen = false;
	}

	async function enter() {
		if (!isSupported || isFullscreen) return;

		if (isElementFullScreen()) await exit();

		if (requestMethod && target?.[requestMethod] != null) {
			await target[requestMethod]();
			isFullscreen = true;
		}
	}

	async function toggle() {
		await (isFullscreen ? exit() : enter());
	}

	const handlerCallback = () => {
		const isElementFullScreenValue = isElementFullScreen();
		if (!isElementFullScreenValue || (isElementFullScreenValue && isCurrentElementFullScreen()))
			isFullscreen = isElementFullScreenValue;
	};

	const listenerOptions = { capture: false, passive: true };
	useEventListener(document, eventHandlers, handlerCallback, listenerOptions);
	useEventListener(() => target, eventHandlers, handlerCallback, listenerOptions);

	$effect(() => {
		handlerCallback();

		return () => {
			if (autoExit) {
				exit();
			}
		};
	});

	return {
		get isSupported() {
			return isSupported;
		},
		get isFullscreen() {
			return isFullscreen;
		},
		enter,
		exit,
		toggle,
	};
}
