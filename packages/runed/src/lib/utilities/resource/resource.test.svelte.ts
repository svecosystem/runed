import { describe, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { sleep } from "$lib/internal/utils/sleep.js";
import { resource } from "./index.js";
import { handlers, type ResponseData, type SearchResponseData } from "./msw-handlers.js";

const server = setupServer(...handlers);

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("resource", () => {
	describe("core functionality", () => {
		testWithEffect("basic fetching and state management", async () => {
			let userId = $state(1);
			let renderOrder = $state<string[]>([]);
			let previousData = $state<unknown>(undefined);
			let cleanUpMessage = $state("");

			const userResource = resource(
				() => userId,
				async (id, _, { data, signal, onCleanup }): Promise<ResponseData> => {
					renderOrder.push("fetch");
					previousData = data;
					const response = await fetch(`https://api.example.com/users/${id}`, { signal });
					onCleanup(() => {
						cleanUpMessage = "cleanup";
					});
					if (!response.ok) throw new Error("Failed to fetch user");
					return response.json();
				}
			);

			renderOrder.push("render");

			// Initial state
			expect(userResource.current).toBe(undefined);
			expect(userResource.error).toBe(undefined);
			await sleep(25);
			expect(userResource.loading).toBe(true);

			// Resolved state
			await sleep(50);
			expect(userResource.loading).toBe(false);
			expect(userResource.current).toEqual({
				id: 1,
				name: "User 1",
				email: "user1@example.com",
			});
			expect(renderOrder).toEqual(["render", "fetch"]);
			expect(previousData).toBe(undefined);

			// State after update
			userId = 2;
			await sleep(100);
			expect(userResource.current).toEqual({
				id: 2,
				name: "User 2",
				email: "user2@example.com",
			});
			expect(previousData).toEqual({
				id: 1,
				name: "User 1",
				email: "user1@example.com",
			});
			expect(cleanUpMessage).toEqual("cleanup");
		});

		testWithEffect("handles multiple dependencies", async () => {
			let searchQuery = $state("test");
			let page = $state(1);

			const searchResource = resource([() => searchQuery, () => page], async ([query, pageNum]) => {
				const response = await fetch(`https://api.example.com/search?q=${query}&page=${pageNum}`);
				if (!response.ok) throw new Error("Search failed");
				return response.json();
			});

			// Initial state
			await sleep(50);
			expect(searchResource.current).toEqual({
				results: [
					{ id: 1, title: "Result 1 for test" },
					{ id: 2, title: "Result 2 for test" },
				],
				page: 1,
				total: 10,
			});

			// Update dependencies
			page = 2;
			await sleep(50);
			expect(searchResource.current?.results[0].id).toBe(2);
		});
	});

	describe("error handling", () => {
		testWithEffect("handles network errors", async () => {
			const errorResource = resource(
				() => "error",
				async () => {
					const response = await fetch("https://api.example.com/error-prone");
					if (!response.ok) throw new Error("Request failed");
					return response.json();
				}
			);

			await sleep(50);
			expect(errorResource.loading).toBe(false);
			expect(errorResource.error).toBeDefined();
			expect(errorResource.current).toBe(undefined);
		});

		testWithEffect("handles request cancellation", async () => {
			let userId = $state(1);
			let cancelCount = $state(0);

			const userResource = resource(
				() => userId,
				async (id, _, { signal }): Promise<ResponseData> => {
					signal.addEventListener("abort", () => {
						cancelCount++;
					});
					const response = await fetch(`https://api.example.com/users/${id}`, { signal });
					if (!response.ok) throw new Error("Failed to fetch user");
					return response.json();
				}
			);

			// Trigger multiple updates rapidly
			await sleep(0);
			userId = 2;
			await sleep(0);
			userId = 3;
			await sleep(0);
			userId = 4;

			await sleep(100);
			expect(cancelCount).toBeGreaterThan(0);
			expect(userResource.current?.id).toBe(4);
		});
	});

	describe("configuration options", () => {
		testWithEffect("lazy prevents initial fetch regardless of initialValue", async () => {
			let userId = $state(1);
			let fetchCount = $state(0);

			// Case 1: lazy without initialValue
			const lazyResource = resource(
				() => userId,
				async (id, _, { signal }): Promise<ResponseData> => {
					fetchCount++;
					const response = await fetch(`https://api.example.com/users/${id}`, { signal });
					if (!response.ok) throw new Error("Failed to fetch user");
					return response.json();
				},
				{ lazy: true }
			);

			// Case 2: lazy with initialValue
			let lazyWithInitialCount = $state(0);
			const lazyResourceWithInitial = resource(
				() => userId,
				async (id, _, { signal }): Promise<ResponseData> => {
					lazyWithInitialCount++;
					const response = await fetch(`https://api.example.com/users/${id}`, { signal });
					if (!response.ok) throw new Error("Failed to fetch user");
					return response.json();
				},
				{
					lazy: true,
					initialValue: { id: 0, name: "Initial", email: "initial@example.com" },
				}
			);

			await sleep(0);
			// Case 1
			expect(lazyResource.loading).toBe(false);
			expect(fetchCount).toBe(0);
			expect(lazyResource.current).toBe(undefined);
			// Case 2
			expect(lazyResourceWithInitial.loading).toBe(false);
			expect(lazyWithInitialCount).toBe(0);
			expect(lazyResourceWithInitial.current).toEqual({
				id: 0,
				name: "Initial",
				email: "initial@example.com",
			});

			// Both resources should fetch when dependency changes
			userId = 2;
			await sleep(100);
			// Case 1
			expect(lazyResource.current?.id).toBe(2);
			expect(fetchCount).toBe(1);
			// Case 2
			expect(lazyResourceWithInitial.current?.id).toBe(2);
			expect(lazyWithInitialCount).toBe(1);
		});

		testWithEffect("initialValue provides initial state but doesn't prevent fetch", async () => {
			let userId = $state(1);
			let fetchCount = $state(0);

			const resourceWithInitial = resource(
				() => userId,
				async (id) => {
					fetchCount++;
					const response = await fetch(`https://api.example.com/users/${id}`);
					return response.json();
				},
				{
					initialValue: { id: 0, name: "Initial", email: "initial@example.com" },
				}
			);

			// Initially has the initialValue
			expect(resourceWithInitial.current).toEqual({
				id: 0,
				name: "Initial",
				email: "initial@example.com",
			});

			// But still performs the initial fetch
			await sleep(100);
			expect(fetchCount).toBe(1);
			expect(resourceWithInitial.current).toEqual({
				id: 1,
				name: "User 1",
				email: "user1@example.com",
			});
		});

		testWithEffect("supports once option", async () => {
			let userId = $state(1);
			let fetchCount = $state(0);

			const onceResource = resource(
				() => userId,
				async (id): Promise<ResponseData> => {
					fetchCount++;
					const response = await fetch(`https://api.example.com/users/${id}`);
					return response.json();
				},
				{ once: true }
			);

			await sleep(100);
			const firstFetchCount = fetchCount;

			userId = 2;
			userId = 3;
			await sleep(200);

			expect(fetchCount).toBe(firstFetchCount);
			expect(onceResource.current?.id).toBe(1);
		});

		testWithEffect("debounces rapid changes", async () => {
			let searchQuery = $state("test");
			let fetchCount = $state(0);

			const searchResource = resource(
				() => searchQuery,
				async (query): Promise<SearchResponseData> => {
					fetchCount++;
					const response = await fetch(`https://api.example.com/search?q=${query}`);
					return response.json();
				},
				{ debounce: 50 }
			);

			// Make rapid changes
			await sleep(0);
			searchQuery = "a";
			await sleep(10);
			searchQuery = "ab";
			await sleep(10);
			searchQuery = "abc";
			await sleep(10);
			searchQuery = "abcd";

			// Initial state while debouncing
			expect(fetchCount).toBe(0);

			// Wait for debounce to complete
			await sleep(100);
			expect(fetchCount).toBe(1);
			expect(searchResource.loading).toBe(false);
			expect(searchResource.current?.results[0].title).toContain("abcd");

			// Single change after delay should trigger immediately
			searchQuery = "final";
			await sleep(100);
			expect(fetchCount).toBe(2);
		});

		testWithEffect("throttles rapid changes", async () => {
			let id = $state(1);
			let fetchCount = $state(0);
			let fetchTimes: number[] = $state([]);

			resource(
				() => id,
				async (id): Promise<ResponseData> => {
					fetchCount++;
					fetchTimes.push(Date.now());
					const response = await fetch(`https://api.example.com/users/${id}`);
					return response.json();
				},
				{ throttle: 100 }
			);

			// Make rapid changes
			id = 2;
			await sleep(20);
			id = 3;
			await sleep(20);
			id = 4;
			await sleep(20);
			id = 5;

			await sleep(200);

			// Check time between fetches
			const timeDiffs = fetchTimes.slice(1).map((time, i) => time - fetchTimes[i]);
			const allThrottled = timeDiffs.every((diff) => diff >= 95); // Allow small margin of error
			expect(allThrottled).toBe(true);

			// Should have fewer fetches than value changes
			expect(fetchCount).toBeLessThan(5);
		});
	});

	describe("mutation and refetching", () => {
		testWithEffect("supports direct mutation", async () => {
			let userId = $state(1);

			const userResource = resource(
				() => userId,
				async (id): Promise<ResponseData> => {
					const response = await fetch(`https://api.example.com/users/${id}`);
					return response.json();
				}
			);

			await sleep(100);
			const newData = { id: 999, name: "Mutated", email: "mutated@example.com" };
			userResource.mutate(newData);
			expect(userResource.current).toEqual(newData);
		});

		testWithEffect("supports refetching with info", async () => {
			let userId = $state(1);
			let refetchInfo = $state<unknown>(false);

			const userResource = resource(
				() => userId,
				async (id, _, { refetching }): Promise<ResponseData> => {
					refetchInfo = refetching;
					const response = await fetch(`https://api.example.com/users/${id}`);
					return response.json();
				}
			);

			await sleep(100);
			const customInfo = { reason: "test" };
			await userResource.refetch(customInfo);
			expect(refetchInfo).toEqual(customInfo);
		});
	});
});

describe("resource.pre", () => {
	testWithEffect("runs before render with proper cleanup", async () => {
		let renderOrder = $state<string[]>([]);
		let userId = $state(1);
		let cleanupCount = $state(0);

		const preResource = resource.pre(
			() => userId,
			async (id, _, { signal, onCleanup }): Promise<ResponseData> => {
				renderOrder.push("fetch");
				onCleanup(() => {
					cleanupCount++;
				});

				const response = await fetch(`https://api.example.com/users/${id}`, {
					signal,
				});
				return response.json();
			}
		);

		renderOrder.push("render");
		await sleep(100);

		expect(renderOrder).toEqual(["fetch", "render"]);
		expect(preResource.current?.id).toBe(1);

		userId = 2;
		await sleep(100);
		expect(cleanupCount).toBe(1);
		expect(preResource.current?.id).toBe(2);
	});
});
