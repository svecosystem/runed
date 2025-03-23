import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";
import { watch } from "$lib/utilities/watch/index.js";
import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";

export type PressedKeysOptions = ConfigurableWindow;
/**
 * Tracks which keys are currently pressed.
 *
 * @see {@link https://runed.dev/docs/utilities/pressed-keys}
 */
export class PressedKeys {
	#pressedKeys = $state<string[]>([]);
	readonly #subscribe?: () => void;

	constructor(options: PressedKeysOptions = {}) {
		const { window = defaultWindow } = options;
		this.has = this.has.bind(this);

		if (!window) return;

		this.#subscribe = createSubscriber((update) => {
			const keydown = on(window, "keydown", (e) => {
				const key = e.key.toLowerCase();
				if (!this.#pressedKeys.includes(key)) {
					this.#pressedKeys.push(key);
				}
				update();
			});

			const keyup = on(window, "keyup", (e) => {
				const key = e.key.toLowerCase();

				// Special handling for modifier keys (meta, control, alt, shift)
				// This addresses issues with OS/browser intercepting certain key combinations
				// where non-modifier keyup events might not fire properly
				if (["meta", "control", "alt", "shift"].includes(key)) {
					// When a modifier key is released, clear all non-modifier keys
					// but keep other modifier keys that might still be pressed
					// This prevents keys from getting "stuck" in the pressed state
					this.#pressedKeys = this.#pressedKeys.filter((k) =>
						["meta", "control", "alt", "shift"].includes(k)
					);
				}

				// Regular key removal
				this.#pressedKeys = this.#pressedKeys.filter((k) => k !== key);
				update();
			});

			// Handle window blur events (switching applications, clicking outside browser)
			// Reset all keys when user shifts focus away from the window
			const blur = on(window, "blur", () => {
				this.#pressedKeys = [];
				update();
			});

			// Handle tab visibility changes (switching browser tabs)
			// This catches cases where the window doesn't lose focus but the tab is hidden
			const visibilityChange = on(document, "visibilitychange", () => {
				if (document.visibilityState === "hidden") {
					this.#pressedKeys = [];
					update();
				}
			});

			return () => {
				keydown();
				keyup();
				blur();
				visibilityChange();
			};
		});
	}

	has(...keys: string[]): boolean {
		this.#subscribe?.();
		const normalizedKeys = keys.map((key) => key.toLowerCase());
		return normalizedKeys.every((key) => this.#pressedKeys.includes(key));
	}

	get all(): string[] {
		this.#subscribe?.();
		return this.#pressedKeys;
	}

	/**
	 * Registers a callback to execute when specified key combination is pressed.
	 *
	 * @param keys - Array or single string of keys to monitor
	 * @param callback - Function to execute when the key combination is matched
	 */
	onKeys(keys: string | string[], callback: () => void) {
		this.#subscribe?.();

		const keysToMonitor = Array.isArray(keys) ? keys : [keys];

		watch(
			() => this.all,
			() => {
				if (this.has(...keysToMonitor)) {
					callback();
				}
			}
		);
	}
}
