import { extract } from "../extract/index.js";
import { watch } from "../watch/watch.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";

type RafCallbackParams = {
	/** The number of milliseconds since the last frame. */
	delta: number;
	/**
	 * Time elapsed since the creation of the web page.
	 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin Time origin}.
	 */
	timestamp: DOMHighResTimeStamp;
};

export type AnimationFramesOptions = {
	/**
	 * Start calling requestAnimationFrame immediately.
	 *
	 * @default true
	 */
	immediate?: boolean;

	/**
	 * Limit the number of frames per second.
	 * Set to `0` to disable
	 *
	 * @default 0
	 */
	fpsLimit?: MaybeGetter<number>;
};

/**
 * Wrapper over {@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame requestAnimationFrame},
 * with controls for pausing and resuming the animation, reactive tracking and optional limiting of fps, and utilities.
 */
export class AnimationFrames {
	#fps = $state(0);
	#previousTimestamp: number | null = null;
	#frame: number | null = null;
	running = $state(false);

	constructor(callback: (params: RafCallbackParams) => void, options: AnimationFramesOptions = {}) {
		const fpsLimit = $derived(extract(options.fpsLimit) ?? 0);
		this.running = options.immediate ?? true;

		const loop = (timestamp: DOMHighResTimeStamp) => {
			if (!this.running) return;

			if (this.#previousTimestamp === null) {
				this.#previousTimestamp = timestamp;
			}

			const delta = timestamp - this.#previousTimestamp;
			const fps = 1000 / delta;
			if (fpsLimit && fps > fpsLimit) {
				this.#frame = requestAnimationFrame(loop);
				return;
			}

			this.#fps = fps;
			this.#previousTimestamp = timestamp;
			callback({ delta, timestamp });
			this.#frame = requestAnimationFrame(loop);
		};

		const start = () => {
			this.#previousTimestamp = 0;
			this.#frame = requestAnimationFrame(loop);
		};

		const stop = () => {
			this.#frame && cancelAnimationFrame(this.#frame);
			this.#frame = null;
		};

		watch(
			() => this.running,
			(running) => {
				if (running) start();
				return stop;
			}
		);
	}

	get fps() {
		return !this.running ? 0 : this.#fps;
	}
}
