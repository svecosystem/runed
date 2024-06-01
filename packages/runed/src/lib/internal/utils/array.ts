/**
 * Get nth item of Array. Negative for backward
 */
export function at<T>(array: readonly T[], index: number): T | undefined {
	const len = array.length;
	if (!len) return undefined;

	if (index < 0) index += len;

	return array[index];
}

export function last<T>(array: readonly T[]): T | undefined {
	return array[array.length - 1];
}
