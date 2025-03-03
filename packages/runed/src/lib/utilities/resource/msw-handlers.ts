import { http, delay, HttpResponse } from "msw";

export type ResponseData = {
	id: number;
	name: string;
	email: string;
};

export type SearchResponseData = {
	results: { id: number; title: string }[];
	page: number;
	total: number;
};

export const handlers = [
	// Basic user endpoint
	http.get("https://api.example.com/users/:id", async ({ params }) => {
		await delay(50);
		return HttpResponse.json({
			id: Number(params.id),
			name: `User ${params.id}`,
			email: `user${params.id}@example.com`,
		});
	}),

	// Search endpoint with query params
	http.get("https://api.example.com/search", ({ request }) => {
		const url = new URL(request.url);
		const query = url.searchParams.get("q");
		const page = Number(url.searchParams.get("page")) || 1;

		return HttpResponse.json({
			results: [
				{ id: page * 1, title: `Result 1 for ${query}` },
				{ id: page * 2, title: `Result 2 for ${query}` },
			],
			page,
			total: 10,
		});
	}),

	// Endpoint that can fail
	http.get("https://api.example.com/error-prone", () => {
		return new HttpResponse(null, { status: 500 });
	}),
];
