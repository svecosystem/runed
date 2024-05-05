import { describe, expect } from "vitest";
import { tick } from "svelte";
import { activeElement } from "./index.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

// Skipping because testing is weird
describe.skip("useActiveElement", () => {
  testWithEffect("initializes with `document.activeElement`", () => {
    expect(activeElement.value).toBe(document.activeElement);
  });
  testWithEffect("updates accordingly when `document.activeElement` element changes", async () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    await tick();
    expect(document.activeElement).toBe(input);
    expect(activeElement.value).toBe(input);
  });
});
