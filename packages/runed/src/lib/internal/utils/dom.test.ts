/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from "vitest";
import { getActiveElement } from "./dom.js";

describe("getActiveElement", () => {
	class MockShadowRoot implements Partial<ShadowRoot> {
		private _activeElement: Element | null = null;

		get activeElement() {
			return this._activeElement;
		}

		setActiveElement(element: Element | null | MockElement) {
			this._activeElement = element as unknown as Element;
		}
	}

	class MockElement implements Partial<HTMLElement> {
		private _shadowRoot: MockShadowRoot | null = null;

		constructor(public tagName: string = "DIV") {}

		get shadowRoot() {
			return this._shadowRoot as unknown as ShadowRoot;
		}

		attachShadow(_: ShadowRootInit) {
			this._shadowRoot = new MockShadowRoot();
			return this._shadowRoot as unknown as ShadowRoot;
		}
	}

	class MockDocument implements Partial<DocumentOrShadowRoot> {
		private _activeElement: Element | null = null;

		get activeElement() {
			return this._activeElement;
		}

		setActiveElement(element: Element | null | MockElement) {
			this._activeElement = element as unknown as Element;
		}
	}

	let mockDocument: MockDocument;

	beforeEach(() => {
		mockDocument = new MockDocument();
	});

	it("returns null when document has no active element", () => {
		expect(getActiveElement(mockDocument as any)).toBeNull();
	});

	it("returns the active element when it has no shadow root", () => {
		const mockElement = new MockElement();
		mockDocument.setActiveElement(mockElement);

		expect(getActiveElement(mockDocument as any)).toBe(mockElement);
	});

	it("returns the active element within a shadow root", () => {
		const shadowElement = new MockElement("BUTTON");
		const hostElement = new MockElement();

		hostElement.attachShadow({ mode: "open" });
		(hostElement.shadowRoot as unknown as MockShadowRoot).setActiveElement(shadowElement);
		mockDocument.setActiveElement(hostElement);

		expect(getActiveElement(mockDocument as any)).toBe(shadowElement);
	});

	it("returns the deepest active element in nested shadow roots", () => {
		const deepestElement = new MockElement("INPUT");
		const middleElement = new MockElement();
		const topElement = new MockElement();

		middleElement.attachShadow({ mode: "open" });
		topElement.attachShadow({ mode: "open" });

		(middleElement.shadowRoot as unknown as MockShadowRoot).setActiveElement(deepestElement);
		(topElement.shadowRoot as unknown as MockShadowRoot).setActiveElement(middleElement);
		mockDocument.setActiveElement(topElement);

		expect(getActiveElement(mockDocument as any)).toBe(deepestElement);
	});

	it("handles when inner shadow root has no active element", () => {
		const hostElement = new MockElement();
		hostElement.attachShadow({ mode: "open" });
		mockDocument.setActiveElement(hostElement);

		expect(getActiveElement(mockDocument as any)).toBeNull();
	});

	it("works when starting from a shadow root instead of document", () => {
		const innerElement = new MockElement("SPAN");
		const mockShadowRoot = new MockShadowRoot();
		mockShadowRoot.setActiveElement(innerElement);

		expect(getActiveElement(mockShadowRoot as any)).toBe(innerElement);
	});

	it("handles nested shadow roots when starting from middle shadow root", () => {
		const deepestElement = new MockElement("BUTTON");
		const middleElement = new MockElement();

		middleElement.attachShadow({ mode: "open" });
		(middleElement.shadowRoot as unknown as MockShadowRoot).setActiveElement(deepestElement);

		const mockShadowRoot = new MockShadowRoot();
		mockShadowRoot.setActiveElement(middleElement);

		expect(getActiveElement(mockShadowRoot as any)).toBe(deepestElement);
	});

	it("breaks infinite loops if activeElement references itself", () => {
		const element = new MockElement();
		element.attachShadow({ mode: "open" });
		(element.shadowRoot as unknown as MockShadowRoot).setActiveElement(element);
		mockDocument.setActiveElement(element);

		expect(getActiveElement(mockDocument as any)).toBe(element);
	});
});
