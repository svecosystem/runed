import type { ValueOrGetter } from "$lib/internal/types.js";
import { boxed } from "$lib/internal/utils/boxed.svelte.js";

type Options = {
	initialSize?: {
		width: number;
		height: number;
	};
	box?: "content-box" | "border-box";
};

export function withElementSize(
	_node: ValueOrGetter<HTMLElement | undefined>,
	options: Options = {
		box: "border-box",
	}
) {
	const node = boxed(_node);
	const size = $state({
		width: options.initialSize?.width ?? 0,
		height: options.initialSize?.height ?? 0,
	});

	$effect(() => {
		if (!node.value) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const boxSize = options.box === "content-box" ? entry.contentBoxSize : entry.borderBoxSize;
				const boxSizeArr = Array.isArray(boxSize) ? boxSize : [boxSize];
				size.width = boxSizeArr.reduce((acc, size) => Math.max(acc, size.inlineSize), 0);
				size.height = boxSizeArr.reduce((acc, size) => Math.max(acc, size.blockSize), 0);
			}
		});
		observer.observe(node.value);

		return () => {
			observer.disconnect();
		};
	});

	return size;
}
