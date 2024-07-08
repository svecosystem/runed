import { extract } from "../extract/extract.js";

import type { MaybeGetter } from "$lib/internal/types.js";
import { addEventListener } from "$lib/internal/utils/event.js";

export class IsHovered<T extends HTMLElement | undefined> {
	#node: MaybeGetter<T>;
	#target = $derived.by(() => extract(this.#node));
	#current = $state<boolean>(false);

	constructor(node: MaybeGetter<T>) {
		this.#node = node;

		const handleMouseEnter = () => {
			this.#current = true;
		};
		const handleMouseLeave = () => {
			this.#current = false;
		};

		$effect(() => {
			if (!this.#target) {
				return;
			}

			const callbacks: VoidFunction[] = [];

			callbacks.push(addEventListener(this.#target, "mouseenter", handleMouseEnter));
			callbacks.push(addEventListener(this.#target, "mouseleave", handleMouseLeave));

			return () => {
				return () => callbacks.forEach((c) => c());
			};
		});
	}

	get current(): boolean {
		return this.#current;
	}
}
