import type { RequestHandler } from "@sveltejs/kit";
import search from "./search.json" assert { type: "json" };

export const prerender = true;

export const GET: RequestHandler = () => {
	return Response.json(search);
};
