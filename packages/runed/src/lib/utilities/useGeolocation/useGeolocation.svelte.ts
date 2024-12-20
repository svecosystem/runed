import {
	defaultNavigator,
	type ConfigurableNavigator,
} from "$lib/internal/configurable-globals.js";
import type { WritableProperties } from "$lib/internal/types.js";

export type UseGeolocationOptions = Partial<PositionOptions> & {
	/**
	 * Whether to start the watcher immediately upon creation. If set to `false`, the watcher
	 * will only start tracking the position when `resume()` is called.
	 *
	 * @defaultValue true
	 */
	immediate?: boolean;
} & ConfigurableNavigator;

/**
 * Reactive access to the browser's [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
 *
 * @see https://runed.dev/docs/utilities/use-geolocation
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
	const {
		enableHighAccuracy = true,
		maximumAge = 30000,
		timeout = 27000,
		immediate = true,
		navigator = defaultNavigator,
	} = options;

	const isSupported = Boolean(navigator);

	let locatedAt = $state<number | null>(null);
	let error = $state.raw<GeolocationPositionError | null>(null);
	let coords = $state<WritableProperties<Omit<GeolocationPosition["coords"], "toJSON">>>({
		accuracy: 0,
		latitude: Number.POSITIVE_INFINITY,
		longitude: Number.POSITIVE_INFINITY,
		altitude: null,
		altitudeAccuracy: null,
		heading: null,
		speed: null,
	});
	let isPaused = $state(false);

	function updatePosition(position: GeolocationPosition) {
		locatedAt = position.timestamp;
		coords.accuracy = position.coords.accuracy;
		coords.altitude = position.coords.altitude;
		coords.altitudeAccuracy = position.coords.altitudeAccuracy;
		coords.heading = position.coords.heading;
		coords.latitude = position.coords.latitude;
		coords.longitude = position.coords.longitude;
		coords.speed = position.coords.speed;
	}

	let watcher: number;

	function resume() {
		if (!navigator) return;
		watcher = navigator.geolocation.watchPosition(updatePosition, (err) => (error = err), {
			enableHighAccuracy,
			maximumAge,
			timeout,
		});
		isPaused = false;
	}

	function pause() {
		if (watcher && navigator) {
			navigator.geolocation.clearWatch(watcher);
		}
		isPaused = true;
	}

	$effect(() => {
		if (immediate) resume();
		return () => pause();
	});

	return {
		get isSupported() {
			return isSupported;
		},
		get coords() {
			return coords;
		},
		get locatedAt() {
			return locatedAt;
		},
		get error() {
			return error;
		},
		get isPaused() {
			return isPaused;
		},
		resume,
		pause,
	};
}
