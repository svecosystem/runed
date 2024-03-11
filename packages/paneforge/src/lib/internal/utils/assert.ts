export function assert(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expectedCondition: any,
	message: string = "Assertion failed!"
): asserts expectedCondition {
	if (!expectedCondition) {
		// eslint-disable-next-line no-console
		console.error(message);
		throw Error(message);
	}
}
