import { addEventListener } from "$lib/internal/utils/event.js";
import { Previous } from "$lib/utilities/index.js";
import { browser } from "$app/environment";

/**
 * @desc The `NetworkInformation` interface of the Network Information API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
type NetworkInformation = {
	readonly downlink: number;
	readonly downlinkMax: number;
	readonly effectiveType: "slow-2g" | "2g" | "3g" | "4g";
	readonly rtt: number;
	readonly saveData: boolean;
	readonly type:
		| "bluetooth"
		| "cellular"
		| "ethernet"
		| "none"
		| "wifi"
		| "wimax"
		| "other"
		| "unknown";
} & EventTarget;

type NavigatorWithConnection = Navigator & { connection: NetworkInformation };

interface NetworkStatus {
	/**
	 * @desc Returns the online status of the browser.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
	 */
	online: boolean;
	/**
	 * @desc The {Date} object pointing to the moment when state update occurred.
	 */
	updatedAt: Date;
	/**
	 * @desc Effective bandwidth estimate in megabits per second, rounded to the
	 * nearest multiple of 25 kilobits per seconds.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlink
	 */
	downlink?: NetworkInformation["downlink"];
	/**
	 * @desc Maximum downlink speed, in megabits per second (Mbps), for the
	 * underlying connection technology
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlinkMax
	 */
	downlinkMax?: NetworkInformation["downlinkMax"];
	/**
	 * @desc Effective type of the connection meaning one of 'slow-2g', '2g', '3g', or '4g'.
	 * This value is determined using a combination of recently observed round-trip time
	 * and downlink values.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType
	 */
	effectiveType?: NetworkInformation["effectiveType"];
	/**
	 * @desc Estimated effective round-trip time of the current connection, rounded
	 * to the nearest multiple of 25 milliseconds
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/rtt
	 */
	rtt?: NetworkInformation["rtt"];
	/**
	 * @desc {true} if the user has set a reduced data usage option on the user agent.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData
	 */
	saveData?: NetworkInformation["saveData"];
	/**
	 * @desc The type of connection a device is using to communicate with the network.
	 * It will be one of the following values:
	 *  - bluetooth
	 *  - cellular
	 *  - ethernet
	 *  - none
	 *  - wifi
	 *  - wimax
	 *  - other
	 *  - unknown
	 *  @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/type
	 */
	type?: NetworkInformation["type"];
}

/**
 * Tracks the state of browser's network connection.
 * @returns null if the function is not run in the browser
 */
export function useNetworkStatus() {
	if (!browser) {
		return {
			get current() {
				return null;
			},
			get previous() {
				return null;
			},
		};
	}
	const navigator = window.navigator;
	const connection =
		"connection" in navigator ? (navigator as NavigatorWithConnection).connection : undefined;
	const getConnectionStatus = (): NetworkStatus => {
		return {
			online: navigator.onLine,
			updatedAt: new Date(),
			downlink: connection?.downlink,
			downlinkMax: connection?.downlinkMax,
			effectiveType: connection?.effectiveType,
			rtt: connection?.rtt,
			saveData: connection?.saveData,
			type: connection?.type,
		};
	};

	let current = $state(getConnectionStatus());
	const previous = new Previous(() => current);
	const handleStatusChange = () => {
		current = getConnectionStatus();
	};

	$effect(() => {
		// The connection event handler also manages online and offline states.
		if (connection) {
			addEventListener(connection, "change", handleStatusChange, { passive: true });
		} else {
			addEventListener(window, "online", handleStatusChange, { passive: true });
			addEventListener(window, "offline", handleStatusChange, { passive: true });
		}

		return () => {
			window.removeEventListener("online", handleStatusChange);
			window.removeEventListener("online", handleStatusChange);
			connection?.removeEventListener("change", handleStatusChange);
		};
	});

	return {
		get current() {
			return current;
		},
		get previous() {
			return previous.current;
		},
	};
}
