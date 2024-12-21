import { defaultDocument } from "../configurable-globals.js";

/**
 * Handles getting the active element in a document or shadow root.
 * If the active element is within a shadow root, it will traverse the shadow root
 * to find the active element.
 * If not, it will return the active element in the document.
 *
 * @param document A document or shadow root to get the active element from.
 * @returns The active element in the document or shadow root.
 */
export function getActiveElement(document: DocumentOrShadowRoot): HTMLElement | null {
	let activeElement = document.activeElement as HTMLElement | null;

	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement as HTMLElement | null;
		if (node === activeElement) break;
		else activeElement = node;
	}

	return activeElement;
}

/**
 * Returns the owner document of a given element.
 *
 * @param node The element to get the owner document from.
 * @returns
 */
export function getOwnerDocument(
	node: Element | null | undefined,
	fallback = defaultDocument
): Document | undefined {
	return node?.ownerDocument ?? fallback;
}

/**
 * Checks if an element is or is contained by another element.
 *
 * @param node The element to check if it or its descendants contain the target element.
 * @param target The element to check if it is contained by the node.
 * @returns
 */
export function isOrContainsTarget(node: Element, target: Element) {
	return node === target || node.contains(target);
}
