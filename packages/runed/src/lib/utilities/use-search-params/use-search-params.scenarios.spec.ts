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
	noScroll?: boolean;
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
	{ name: "no-scroll", route: "/test-search/no-scroll", noScroll: true },
];

// Consistent helper functions using getByTestId
const pageCount = (page: Page) => page.getByTestId("page");
const filterText = (page: Page) => page.getByTestId("filter");
const createdAtText = (page: Page) => page.getByTestId("createdAt");

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
				// local state should update immediately, even with debounce
				await expect(filterText(page)).toHaveText("foo");

				if (s.debounce) {
					// URL should NOT be updated yet (still debouncing)
					if (!s.memory) {
						await expect(page).not.toHaveURL(/filter=foo/);
					}
					await page.waitForTimeout(250);
				}

				// after debounce (or immediately if no debounce), URL should be updated
				if (s.memory) {
					await expect(page).toHaveURL(s.route);
				} else if (s.compress) {
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
				test("debounced URL updates with immediate local state", async ({ page }) => {
					await page.getByTestId("inc").click();
					await page.getByTestId("inc").click();
					// local state should update immediately showing both increments
					await expect(pageCount(page)).toHaveText("3");

					if (!s.memory && !s.compress) {
						// URL should not be updated yet (still debouncing)
						await expect(page).not.toHaveURL(/page=3/);
					}

					await page.waitForTimeout(250);
					// after debounce, URL should reflect both increments
					await expect(pageCount(page)).toHaveText("3");

					if (s.memory) {
						await expect(page).toHaveURL(s.route);
					} else if (s.compress) {
						await expect(page.url()).toMatch(/_data=/);
						const url = new URL(page.url());
						const data = url.searchParams.get("_data")!;
						const decompressed = decompress(data)!;
						const obj = JSON.parse(decompressed);
						expect(obj.page).toBe(3);
					} else {
						await expect(page).toHaveURL(/page=3/);
					}
				});

				test("input binding updates immediately while URL debounces", async ({ page }) => {
					const input = page.getByTestId("filter-input");

					// Type into the input
					await input.fill("test");

					// Input value and display should update immediately
					await expect(filterText(page)).toHaveText("test");
					await expect(input).toHaveValue("test");

					if (!s.memory) {
						// URL should NOT be updated yet (still debouncing)
						await expect(page).not.toHaveURL(/filter=test/);
					}

					// Wait for debounce
					await page.waitForTimeout(250);

					// Display should still show "test"
					await expect(filterText(page)).toHaveText("test");

					if (s.memory) {
						await expect(page).toHaveURL(s.route);
					} else if (s.compress) {
						await expect(page.url()).toMatch(/_data=/);
						const url = new URL(page.url());
						const data = url.searchParams.get("_data")!;
						const decompressed = decompress(data)!;
						const obj = JSON.parse(decompressed);
						expect(obj.filter).toBe("test");
					} else {
						// Now URL should be updated
						await expect(page).toHaveURL(/filter=test/);
					}
				});

				test("rapid typing debounces correctly", async ({ page }) => {
					const input = page.getByTestId("filter-input");

					// Type multiple characters rapidly
					await input.fill("a");
					await expect(filterText(page)).toHaveText("a");

					await input.fill("ab");
					await expect(filterText(page)).toHaveText("ab");

					await input.fill("abc");
					await expect(filterText(page)).toHaveText("abc");

					if (!s.memory) {
						// URL should still not be updated (debounce restarting)
						await expect(page).not.toHaveURL(/filter=abc/);
					}

					// Wait for debounce
					await page.waitForTimeout(250);

					// URL should now reflect the final value
					await expect(filterText(page)).toHaveText("abc");

					if (s.memory) {
						await expect(page).toHaveURL(s.route);
					} else if (s.compress) {
						await expect(page.url()).toMatch(/_data=/);
						const url = new URL(page.url());
						const data = url.searchParams.get("_data")!;
						const decompressed = decompress(data)!;
						const obj = JSON.parse(decompressed);
						expect(obj.filter).toBe("abc");
					} else {
						await expect(page).toHaveURL(/filter=abc/);
					}
				});

				test("preserves other params during debounced updates", async ({ page }) => {
					const input = page.getByTestId("filter-input");

					// Set page to 5 first
					await page.getByTestId("inc").click();
					await page.getByTestId("inc").click();
					await page.getByTestId("inc").click();
					await page.getByTestId("inc").click();

					// Wait for debounce
					await page.waitForTimeout(250);

					// Verify page is 5 in displays
					await expect(pageCount(page)).toHaveText("5");

					if (!s.memory && !s.compress) {
						await expect(page).toHaveURL(/page=5/);
					}

					// Now type in filter input
					await input.fill("hello");

					// Both displays should update immediately
					await expect(pageCount(page)).toHaveText("5");
					await expect(filterText(page)).toHaveText("hello");

					if (!s.memory) {
						// URL should still have page=5 but not filter yet
						if (!s.compress) {
							await expect(page).toHaveURL(/page=5/);
							await expect(page).not.toHaveURL(/filter=hello/);
						}
					}

					// Wait for debounce
					await page.waitForTimeout(250);

					// Displays should still be correct
					await expect(pageCount(page)).toHaveText("5");
					await expect(filterText(page)).toHaveText("hello");

					if (s.memory) {
						await expect(page).toHaveURL(s.route);
					} else if (s.compress) {
						await expect(page.url()).toMatch(/_data=/);
						const url = new URL(page.url());
						const data = url.searchParams.get("_data")!;
						const decompressed = decompress(data)!;
						const obj = JSON.parse(decompressed);
						expect(obj.page).toBe(5);
						expect(obj.filter).toBe("hello");
					} else {
						// URL should have BOTH params
						await expect(page).toHaveURL(/page=5/);
						await expect(page).toHaveURL(/filter=hello/);
					}
				});

				test("multiple rapid updates to different params", async ({ page }) => {
					const input = page.getByTestId("filter-input");

					// Rapidly update both params
					await page.getByTestId("inc").click();
					await expect(pageCount(page)).toHaveText("2");

					await input.fill("test");
					await expect(filterText(page)).toHaveText("test");

					await page.getByTestId("inc").click();
					await expect(pageCount(page)).toHaveText("3");

					if (!s.memory) {
						// Neither should be in URL yet
						if (!s.compress) {
							await expect(page).not.toHaveURL(/page=3/);
							await expect(page).not.toHaveURL(/filter=test/);
						}
					}

					// Wait for debounce
					await page.waitForTimeout(250);

					// Displays should still be correct
					await expect(pageCount(page)).toHaveText("3");
					await expect(filterText(page)).toHaveText("test");

					if (s.memory) {
						await expect(page).toHaveURL(s.route);
					} else if (s.compress) {
						await expect(page.url()).toMatch(/_data=/);
						const url = new URL(page.url());
						const data = url.searchParams.get("_data")!;
						const decompressed = decompress(data)!;
						const obj = JSON.parse(decompressed);
						expect(obj.page).toBe(3);
						expect(obj.filter).toBe("test");
					} else {
						// URL should have both final values
						await expect(page).toHaveURL(/page=3/);
						await expect(page).toHaveURL(/filter=test/);
					}
				});

				test("clearing input debounces correctly", async ({ page }) => {
					const input = page.getByTestId("filter-input");

					// Set a value first
					await input.fill("test");
					await page.waitForTimeout(250);

					if (!s.memory && !s.compress) {
						await expect(page).toHaveURL(/filter=test/);
					}

					// Clear the input
					await input.fill("");

					// Display should update immediately
					await expect(filterText(page)).toHaveText("");
					await expect(input).toHaveValue("");

					if (!s.memory && !s.compress) {
						// URL should still have filter=test (debouncing)
						await expect(page).toHaveURL(/filter=test/);
					}

					// Wait for debounce
					await page.waitForTimeout(250);

					// Display should still be empty
					await expect(filterText(page)).toHaveText("");

					if (s.memory) {
						await expect(page).toHaveURL(s.route);
					} else {
						// URL should no longer have filter param (empty = default, removed from URL)
						await expect(page).not.toHaveURL(/filter=/);
					}
				});
			}

			if (s.noScroll) {
				test("keeping scroll position", async ({ page }) => {
					// Scroll down
					await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
					const scrollY = await page.evaluate(() => window.scrollY);

					// Trigger a parameter change
					await page.getByTestId("inc").click();
					await page.waitForTimeout(100);

					// Check scroll position is maintained
					const newScrollY = await page.evaluate(() => window.scrollY);
					expect(newScrollY).toBe(scrollY);
				});
			}

			// Test for issue #320: number params should parse from URL correctly
			// Skip for memory mode since it doesn't read from URL
			if (!s.memory) {
				test("number params from URL are parsed as numbers", async ({ page }) => {
					// Navigate to URL with number parameter
					await page.goto(`${s.route}?page=42`);
					await page.waitForTimeout(300);

					// Verify the number is parsed correctly
					await expect(pageCount(page)).toHaveText("42");

					// Verify URL contains the number
					// Note: compress mode doesn't compress on navigation, only on set
					if (s.compress) {
						// When navigating to uncompressed params, they stay uncompressed
						await expect(page).toHaveURL(/page=42/);
					} else {
						await expect(page).toHaveURL(/page=42/);
					}
				});

				test("negative numbers are parsed correctly", async ({ page }) => {
					await page.goto(`${s.route}?page=-5`);
					await page.waitForTimeout(300);
					await expect(pageCount(page)).toHaveText("-5");
				});

				test("decimal numbers are parsed correctly", async ({ page }) => {
					await page.goto(`${s.route}?page=3.14`);
					await page.waitForTimeout(300);
					await expect(pageCount(page)).toHaveText("3.14");
				});

				test("zero is parsed as number not string", async ({ page }) => {
					await page.goto(`${s.route}?page=0`);
					await page.waitForTimeout(300);
					await expect(pageCount(page)).toHaveText("0");
				});

				test("date params from URL are parsed as Date objects", async ({ page }) => {
					// Navigate to URL with date parameter
					await page.goto(`${s.route}?createdAt=2023-06-15T10:30:00.000Z`);
					await page.waitForTimeout(300);

					// Verify the date is parsed and displayed correctly
					await expect(createdAtText(page)).toHaveText("2023-06-15T10:30:00.000Z");

					// Verify URL contains the date
					// Note: compress mode doesn't compress on navigation, only on set
					if (s.compress) {
						// When navigating to uncompressed params, they stay uncompressed
						await expect(page).toHaveURL(/createdAt=2023-06-15T10:30:00\.000Z/);
					} else if (s.showDefaults) {
						// Show-defaults encodes the URL and includes default params
						await expect(page).toHaveURL(/createdAt=2023-06-15T10%3A30%3A00\.000Z/);
					} else {
						await expect(page).toHaveURL(/createdAt=2023-06-15T10:30:00\.000Z/);
					}
				});
			}

			test("date parameter updates correctly", async ({ page }) => {
				await page.getByTestId("setDate").click();

				// Display should update immediately
				await expect(createdAtText(page)).toHaveText("2023-06-15T10:30:00.000Z");

				if (s.debounce) {
					await page.waitForTimeout(250);
				}

				// URL should be updated
				if (s.memory) {
					await expect(page).toHaveURL(s.route);
				} else if (s.compress) {
					await expect(page.url()).toMatch(/_data=/);
					const url = new URL(page.url());
					const data = url.searchParams.get("_data")!;
					const decompressed = decompress(data)!;
					const obj = JSON.parse(decompressed);
					expect(obj.createdAt).toBe("2023-06-15T10:30:00.000Z");
				} else {
					await expect(page).toHaveURL(/createdAt=2023-06-15T10%3A30%3A00\.000Z/);
				}
			});
		});
	}
});
