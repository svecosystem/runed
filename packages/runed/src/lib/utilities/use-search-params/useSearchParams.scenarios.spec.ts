import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import * as lzString from "lz-string";

const decompress =
	lzString.decompressFromEncodedURIComponent || lzString.default?.decompressFromEncodedURIComponent;

interface Scenario {
	name: string;
	route: string;
	showDefaults?: boolean;
	noHistory?: boolean;
	debounce?: boolean;
	compress?: boolean;
	memory?: boolean;
}

const scenarios: Scenario[] = [
	{ name: "default", route: "/test-search/default" },
	{ name: "show-default", route: "/test-search/show-default", showDefaults: true },
	{
		name: "no-push",
		route: "/test-search/nopush",
		noHistory: true,
	},
	{
		name: "debounce",
		route: "/test-search/debounce",
		debounce: true,
	},
	{
		name: "compress",
		route: "/test-search/compress",
		compress: true,
	},
	{ name: "memory", route: "/test-search/memory", memory: true },
];

// Consistent helper functions using getByTestId
const pageCount = (page: Page) => page.getByTestId("page");
const filterText = (page: Page) => page.getByTestId("filter");

function getExpectedURL(s: Scenario, action: "mount" | "inc" | "reset"): string | RegExp {
	if (action === "mount") {
		return s.showDefaults ? /\?page=1&filter=/ : s.route;
	}
	if (action === "inc") {
		if (s.memory) return s.route;
		if (s.compress) return /_data=/;
		return /page=2/;
	}
	// reset
	if (action === "reset") {
		if (s.memory || s.compress) return s.route;
		return getExpectedURL(s, "mount");
	}
	return s.route;
}

test.describe("useSearchParams scenarios", () => {
	test.describe.configure({ mode: "parallel" });
	for (const s of scenarios) {
		test.describe(s.name, () => {
			test.beforeEach(async ({ page }) => {
				await page.goto(s.route);
				await page.waitForTimeout(300);
			});

			test("mount initial state", async ({ page }) => {
				await expect(page).toHaveURL(getExpectedURL(s, "mount"));
				await expect(pageCount(page)).toHaveText("1");
				if (!s.memory && !s.compress) {
					await expect(filterText(page)).toBeEmpty();
				}
			});

			test("inc & history behavior", async ({ page }) => {
				await page.getByTestId("inc").click();
				await expect(page).toHaveURL(getExpectedURL(s, "inc"));
				await expect(pageCount(page)).toHaveText("2");
				if (!s.memory && !s.compress && !s.noHistory) {
					await page.goBack();
					await expect(page).toHaveURL(getExpectedURL(s, "mount"));
				}
				if (s.noHistory) {
					await page.goBack();
					await expect(page).toHaveURL("about:blank");
				}
			});

			test("reset restores defaults", async ({ page }) => {
				await page.getByTestId("inc").click();
				await page.getByTestId("reset").click();
				await expect(page).toHaveURL(getExpectedURL(s, "reset"));
				await expect(pageCount(page)).toHaveText("1");
			});

			test("batch update sets both", async ({ page }) => {
				await page.getByTestId("setBoth").click();
				if (s.memory) {
					await expect(page).toHaveURL(s.route);
				} else if (s.compress) {
					// Wait for URL to contain compressed data
					await page.waitForFunction(() => window.location.search.includes("_data="), {
						timeout: 5000,
					});
					await expect(page.url()).toMatch(/_data=/);
					const url = new URL(page.url());
					const data = url.searchParams.get("_data")!;
					const decompressed = decompress(data)!;
					const obj = JSON.parse(decompressed!);
					expect(obj.page).toBe(5);
					expect(obj.filter).toBe("bar");
				} else {
					await expect(page).toHaveURL(/page=5&filter=bar/);
				}
				await expect(pageCount(page)).toHaveText("5");
				await expect(filterText(page)).toHaveText("bar");
			});

			test("filter input updates", async ({ page }) => {
				await page.getByTestId("filter-input").fill("foo");
				if (s.debounce) {
					await expect(filterText(page)).toHaveText("");
					await page.waitForTimeout(250);
				}
				if (s.memory) {
					await expect(page).toHaveURL(s.route);
				} else if (s.compress) {
					await page.waitForTimeout(250);
					await expect(page.url()).toMatch(/_data=/);
					const url = new URL(page.url());
					const data = url.searchParams.get("_data")!;
					const decompressed = decompress(data)!;
					const obj = JSON.parse(decompressed);
					expect(obj.filter).toBe("foo");
				} else {
					await expect(page).toHaveURL(/filter=foo/);
				}
				await expect(filterText(page)).toHaveText("foo");
			});

			if (s.debounce) {
				test("debounced inc only updates once", async ({ page }) => {
					await page.getByTestId("inc").click();
					await page.getByTestId("inc").click();
					// should not update immediately due to debounce
					await expect(pageCount(page)).toHaveText("1");
					await page.waitForTimeout(250);
					// after debounce, only one increment
					await expect(pageCount(page)).toHaveText("2");
				});
			}
		});
	}
});
