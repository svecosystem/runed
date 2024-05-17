import { addEventListener } from "$lib/internal/utils/event.js";

export class PressedKeys {
	#pressedKeys = $state<Array<string>>([]);

	constructor() {
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

	pressed(...keys: string[]) {
		const normalizedKeys = keys.map((key) => key.toLowerCase());
		return normalizedKeys.every((key) => this.#pressedKeys.includes(key));
	}

	get all() {
		return this.#pressedKeys;
	}
}
