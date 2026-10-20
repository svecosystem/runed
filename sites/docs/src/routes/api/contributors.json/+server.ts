import type { RequestHandler } from "@sveltejs/kit";
import contributors from "./contributors.json" with { type: "json" };

export const prerender = true;

export const GET: RequestHandler = () => {
	return Response.json(contributors);
};
