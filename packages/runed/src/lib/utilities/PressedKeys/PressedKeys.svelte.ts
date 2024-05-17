import { addEventListener } from "$lib/internal/utils/event.js";

export class PressedKeys {
	#pressedKeys = $state<Array<string>>([]);

	constructor() {
		$effect(() => {
			const callbacks: VoidFunction[] = [];

			callbacks.push(
				addEventListener(window, "keydown", (e) => {
					if (this.#pressedKeys.includes(e.key)) return;
					this.#pressedKeys.push(e.key);
				})
			);

			callbacks.push(
				addEventListener(window, "keyup", (e) => {
					this.#pressedKeys = this.#pressedKeys.filter((k) => k !== e.key);
				})
			);

			return () => callbacks.forEach((c) => c());
		});
	}

	pressed(...keys: string[]) {
		return keys.every((k) => this.#pressedKeys.includes(k));
	}
}
