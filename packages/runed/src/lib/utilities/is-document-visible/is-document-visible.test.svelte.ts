import { describe, expect } from "vitest";
import { flushSync } from "svelte";
import { IsDocumentVisible } from "./is-document-visible.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("IsDocumentVisible", () => {
    testWithEffect("initializes from document.hidden", () => {
    const util = new IsDocumentVisible();
    flushSync();
        expect(typeof util.current).toBe("boolean");
    });

    testWithEffect("updates on visibilitychange", () => {
        class MockDoc extends EventTarget {
            hidden = false;
        }
        const mockDoc = new MockDoc();

        const util = new IsDocumentVisible({ document: mockDoc as unknown as Document });
        flushSync();

        // Simulate hidden
        mockDoc.hidden = true;
        mockDoc.dispatchEvent(new Event("visibilitychange"));
        flushSync();
        expect(util.current).toBe(false);

        // Simulate visible
        mockDoc.hidden = false;
        mockDoc.dispatchEvent(new Event("visibilitychange"));
        flushSync();
        expect(util.current).toBe(true);
    });
});
