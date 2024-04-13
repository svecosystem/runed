import { it } from "vitest";

export function testWithEffect(name: string, fn: () => void) {
	it(name, async () => {
		let promise: Promise<void> | void;
		const cleanup = $effect.root(() => (promise = fn()));
		try {
			await promise!;
		} finally {
			cleanup();
		}
	});
}
