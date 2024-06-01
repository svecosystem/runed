/**
 * Take a media query (or a function that returns one if you want reactivity)
 * as input and you can check if it currently matches doing `instance.match`
 *
 * @see {@link https://runed.dev/docs/utilities/media-query}
 *
 * @example
 * ```ts
 * const screen = new MediaQuery("(min-width: 640px)");
 *
 * $effect(()=>{
 * 	if(screen.match){
 * 		console.log("The screen is less than 640px");
 * 	}
 * });
 * ```
 * 
 * @example
 * ```ts
 * let media = $state("(min-width: 640px)");
 * const screen = new MediaQuery(()=> media);
 *
 * $effect(()=>{
 * 	if(screen.match){
 * 		console.log(`Media query ${media} is ${screen.match}`);
 * 	}
 * });
 * 
 * media = "(min-width: 320px)";
 * ```

 */
export class MediaQuery {
	match = $state<boolean | undefined>(undefined);

	constructor(query: string | (() => string)) {
		$effect(() => {
			const result = window.matchMedia(typeof query === "function" ? query() : query);

			this.match = result.matches;

			const listener = (changed: MediaQueryListEvent) => {
				this.match = changed.matches;
			};

			result.addEventListener("change", listener);
			return () => {
				result.removeEventListener("change", listener);
			};
		});
	}
}
