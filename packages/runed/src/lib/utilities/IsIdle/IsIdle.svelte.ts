import { isBrowser } from "$lib/internal/utils/browser.js";

const DEFAULT_EVENTS = [
	"keypress",
	"mousemove",
	"touchmove",
	"click",
	"scroll",
] satisfies (keyof DocumentEventMap)[];


const DEFAULT_OPTIONS = {
	events: DEFAULT_EVENTS,
	initialState: false,
};

// TODO: give this a real description
/**
 * Function that takes a callback, and returns a debounced version of it.
 * When calling the debounced function, it will wait for the specified time
 * before calling the original callback. If the debounced function is called
 * again before the time has passed, the timer will be reset.
 *
 * You can await the debounced function to get the value when it is eventually
 * called.
 *
 * The second parameter is the time to wait before calling the original callback.
 * Alternatively, it can also be a getter function that returns the time to wait.
 *
 */
export class IsIdle {
	#idle = $state(false);
	#timer = $state<number>();
	#events;

	constructor(
		timeout: number = 500,
		options: Partial<typeof DEFAULT_OPTIONS> = DEFAULT_OPTIONS
	) {

    this.#events = options?.events || ["keypress", "mousemove", "touchmove", "click", "scroll"];
    this.#idle = options?.initialState || false;

    $effect(() => {
      const handleEvents = () => {
        this.#idle = false
  
        if (this.#timer) {
          window.clearTimeout(this.#timer);
        }
  
        this.#timer = window.setTimeout(() => {
          this.#idle = true
        }, timeout);
      };
  
      this.#events.forEach((event) => document.addEventListener(event, handleEvents));
  
      // remove event listeners onUnmount
      return () => {
        this.#events.forEach((event) => document.removeEventListener(event, handleEvents));
      };
    });
  }


  get current() {
		return this.#idle;
	}
}



