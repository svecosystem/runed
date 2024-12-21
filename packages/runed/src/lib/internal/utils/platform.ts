type UserAgentBrand = {
	brand: string;
	version: string;
};

interface NavigatorWithUserAgentData extends Navigator {
	userAgentData?: {
		brands: UserAgentBrand[];
		platform: string;
	};
}

/**
 * Tests if a given RegExp pattern matches the platform identifier
 */
function testPlatform(pattern: RegExp): boolean {
	if (typeof window === "undefined" || !window.navigator) return false;

	const nav = window.navigator as NavigatorWithUserAgentData;
	const platform = nav.userAgentData?.platform || nav.platform;
	return pattern.test(platform);
}

export function getIsMac(): boolean {
	return testPlatform(/^Mac/i);
}

export function getIsIPhone(): boolean {
	return testPlatform(/^iPhone/i);
}

export function getIsIPad(): boolean {
	const isPlatformIPad = testPlatform(/^iPad/i);
	const isTouchCapableMac =
		getIsMac() && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1;

	return isPlatformIPad || isTouchCapableMac;
}

export function getIsIOS(): boolean {
	return getIsIPhone() || getIsIPad();
}

export const isIOS = /* #__PURE__ */ getIsIOS();
