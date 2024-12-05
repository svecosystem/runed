import { untrack } from "svelte";
import { extract } from "../extract/index.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";

type RafCallbackParams = {
	/** The number of milliseconds since the last frame. */
	delta: number;
	/**
	 * Time elapsed since the creation of the web page.
	 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin Time origin}.
	 */
	timestamp: DOMHighResTimeStamp;
};

export type AnimationFramesOptions = ConfigurableWindow & {
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
	#callback: (params: RafCallbackParams) => void;
	#fpsLimitOption: AnimationFramesOptions["fpsLimit"] = 0;
	#fpsLimit = $derived(extract(this.#fpsLimitOption) ?? 0);
	#previousTimestamp: number | null = null;
	#frame: number | null = null;

	#fps = $state(0);
	#running = $state(false);
	#window: Window = defaultWindow!;

	constructor(callback: (params: RafCallbackParams) => void, options: AnimationFramesOptions = {}) {
		this.#window = options.window ?? defaultWindow!;
		this.#fpsLimitOption = options.fpsLimit;
		this.#callback = callback;

		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
		this.toggle = this.toggle.bind(this);

		$effect(() => {
			if (options.immediate ?? true) {
				untrack(this.start);
			}

			return this.stop;
		});
	}

	#loop(timestamp: DOMHighResTimeStamp): void {
		if (!this.#running) return;

		if (this.#previousTimestamp === null) {
			this.#previousTimestamp = timestamp;
		}

		const delta = timestamp - this.#previousTimestamp;
		const fps = 1000 / delta;
		if (this.#fpsLimit && fps > this.#fpsLimit) {
			this.#frame = this.#window.requestAnimationFrame(this.#loop);
			return;
		}

		this.#fps = fps;
		this.#previousTimestamp = timestamp;
		this.#callback({ delta, timestamp });
		this.#frame = this.#window.requestAnimationFrame(this.#loop);
	}

	start(): void {
		this.#running = true;
		this.#previousTimestamp = 0;
		this.#frame = this.#window.requestAnimationFrame(this.#loop);
	}

	stop(): void {
		if (!this.#frame) return;
		this.#running = false;
		this.#window.cancelAnimationFrame(this.#frame);
		this.#frame = null;
	}

	toggle(): void {
		this.#running ? this.stop() : this.start();
	}

	get fps(): number {
		return !this.#running ? 0 : this.#fps;
	}

	get running(): boolean {
		return this.#running;
	}
}
