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

type UseGeolocationPosition = WritableProperties<Omit<GeolocationPosition, "toJSON" | "coords">> & {
	coords: WritableProperties<Omit<GeolocationPosition["coords"], "toJSON">>;
};

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

	let error = $state.raw<GeolocationPositionError | null>(null);
	let position = $state<UseGeolocationPosition>({
		timestamp: 0,
		coords: {
			accuracy: 0,
			latitude: Number.POSITIVE_INFINITY,
			longitude: Number.POSITIVE_INFINITY,
			altitude: null,
			altitudeAccuracy: null,
			heading: null,
			speed: null,
		},
	});
	let isPaused = $state(false);

	function updatePosition(_position: GeolocationPosition) {
		error = null;
		position.timestamp = _position.timestamp;
		position.coords.accuracy = _position.coords.accuracy;
		position.coords.altitude = _position.coords.altitude;
		position.coords.altitudeAccuracy = _position.coords.altitudeAccuracy;
		position.coords.heading = _position.coords.heading;
		position.coords.latitude = _position.coords.latitude;
		position.coords.longitude = _position.coords.longitude;
		position.coords.speed = _position.coords.speed;
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
		get position() {
			return position;
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

export type useGeolocationReturn = ReturnType<typeof useGeolocation>;
