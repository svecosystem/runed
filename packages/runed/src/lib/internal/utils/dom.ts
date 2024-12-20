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
