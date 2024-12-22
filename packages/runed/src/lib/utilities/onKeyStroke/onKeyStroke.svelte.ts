import { defaultDocument } from "$lib/internal/configurable-globals.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { addEventListener } from "$lib/internal/utils/event.js";
import { noop } from "$lib/internal/utils/function.js";
import { extract } from "../extract/extract.svelte.js";
import { watch } from "../watch/watch.svelte.js";

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type KeyFilter = true | string | string[] | KeyPredicate;
export type KeyStrokeEventName = "keydown" | "keypress" | "keyup";

export type OnKeyStrokeOptions = {
	/**
	 * The event name to listen to for key strokes.
	 *
	 * @default 'keydown'
	 */
	eventName?: KeyStrokeEventName;
	/**
	 * The target element to listen for key strokes on.
	 *
	 * @default document
	 */
	target?: MaybeGetter<EventTarget | null | undefined>;

	/**
	 * Whether the key stroke handler is passive or not.
	 *
	 * @default false
	 */
	passive?: boolean;

	/**
	 * Whether to ignore repeated events when the key is held down.
	 *
	 * @default false
	 */
	ignoreRepeat?: boolean;

	/**
	 * Whether the key stroke handler is enabled by default or not.
	 * If set to false, the handler will not be active until enabled by
	 * calling the returned `start` function.
	 *
	 * @default true
	 */
	immediate?: boolean;
};

export type OnKeyStrokeReturn = {
	/** Start listening for key strokes */
	start: () => void;
	/** Stop listening for keystrokes */
	stop: () => void;
	/** Whether the keystroke listeners are enabled or not. */
	readonly enabled: boolean;
};

/**
 * Listen for key strokes.
 *
 * @see {@link https://runed.dev/docs/utilities/on-key-stroke}
 */
export function onKeyStroke(
	key: KeyFilter,
	handler: (event: KeyboardEvent) => void,
	options?: OnKeyStrokeOptions
): OnKeyStrokeReturn;
export function onKeyStroke(
	handler: (event: KeyboardEvent) => void,
	options?: OnKeyStrokeOptions
): OnKeyStrokeReturn;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onKeyStroke(...args: any[]) {
	const { key, handler, options } = parseKeyStrokeArgs(...args);

	const {
		eventName = "keydown",
		passive = false,
		immediate = true,
		ignoreRepeat = false,
	} = options;

	const target = $derived(extract(options.target) ?? defaultDocument);
	let enabled = $state(immediate);

	const predicate = createKeyPredicate(key);
	const handleKeyStroke = (e: KeyboardEvent) => {
		if (e.repeat && ignoreRepeat) return;

		if (predicate(e)) {
			handler(e);
		}
	};

	let removeListener = noop;

	function start() {
		enabled = true;
		removeListener();
		if (!target) return;
		// @ts-expect-error - We know the event names are valid
		removeListener = addEventListener(target, eventName, handleKeyStroke, passive);
	}

	function stop() {
		enabled = false;
		removeListener();
	}

	watch(
		() => enabled,
		(isEnabled) => {
			if (isEnabled) {
				start();
			} else {
				stop();
			}
		}
	);

	$effect(() => {
		return () => {
			stop();
		};
	});

	return {
		start,
		stop,
		get enabled() {
			return enabled;
		},
	};
}

/**
 * Listen to the `'keydown'` event of the given key(s).
 *
 * @see {@link https://runed.dev/docs/utilities/on-key-stroke}
 */
export function onKeyDown(
	key: KeyFilter,
	handler: (event: KeyboardEvent) => void,
	options: Omit<OnKeyStrokeOptions, "eventName"> = {}
) {
	return onKeyStroke(key, handler, { ...options, eventName: "keydown" });
}

/**
 * Listen to the `'keypress'` event of the given key(s).
 *
 * @see {@link https://runed.dev/docs/utilities/on-key-stroke}
 */
export function onKeyPress(
	key: KeyFilter,
	handler: (event: KeyboardEvent) => void,
	options: Omit<OnKeyStrokeOptions, "eventName"> = {}
) {
	return onKeyStroke(key, handler, { ...options, eventName: "keypress" });
}

/**
 * Listen to the `'keyup'` event of the given key(s).
 * @see {@link https://runed.dev/docs/utilities/on-key-stroke}
 */
export function onKeyUp(
	key: KeyFilter,
	handler: (event: KeyboardEvent) => void,
	options: Omit<OnKeyStrokeOptions, "eventName"> = {}
) {
	return onKeyStroke(key, handler, { ...options, eventName: "keyup" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseKeyStrokeArgs(...args: any[]) {
	let key: KeyFilter;
	let handler: (event: KeyboardEvent) => void;
	let options: OnKeyStrokeOptions = {};

	if (args.length === 3) {
		key = args[0];
		handler = args[1];
		options = args[2];
	} else if (args.length === 2) {
		if (typeof args[1] === "object") {
			key = true;
			handler = args[0];
			options = args[1];
		} else {
			key = args[0];
			handler = args[1];
		}
	} else {
		key = true;
		handler = args[0];
	}

	return { key, handler, options };
}

function createKeyPredicate(keyFilter: KeyFilter): KeyPredicate {
	if (typeof keyFilter === "function") {
		return keyFilter;
	} else if (typeof keyFilter === "string") {
		return (event: KeyboardEvent) => event.key === keyFilter;
	} else if (Array.isArray(keyFilter)) {
		return (event: KeyboardEvent) => keyFilter.includes(event.key);
	}
	return () => true;
}
