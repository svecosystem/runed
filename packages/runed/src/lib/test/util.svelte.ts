import { onTestFinished, test } from "vitest";

export function testWithEffect(name: string, fn: () => void) {
	test(name, () => {
		const cleanup = $effect.root(() => {
			fn();
		});
		onTestFinished(cleanup);
	});
}
