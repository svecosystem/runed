import { addEventListener } from "$lib/internal/utils/event.js";

/**
 * Tracks which keys are currently pressed.
 *
 * @see {@link https://runed.dev/docs/utilities/pressed-keys}
 */
export class PressedKeys {
	#pressedKeys = $state<string[]>([]);

	constructor() {
		this.has = this.has.bind(this);
		$effect(() => {
			const callbacks: VoidFunction[] = [];

			callbacks.push(
				addEventListener(window, "keydown", (e) => {
					const key = e.key.toLowerCase();
					if (!this.#pressedKeys.includes(key)) {
						this.#pressedKeys.push(key);
					}
				})
			);

			callbacks.push(
				addEventListener(window, "keyup", (e) => {
					const key = e.key.toLowerCase();
					this.#pressedKeys = this.#pressedKeys.filter((k) => k !== key);
				})
			);

			return () => callbacks.forEach((c) => c());
		});
	}

	has(...keys: string[]): boolean {
		const normalizedKeys = keys.map((key) => key.toLowerCase());
		return normalizedKeys.every((key) => this.#pressedKeys.includes(key));
	}

	get all(): string[] {
		return this.#pressedKeys;
	}
}
