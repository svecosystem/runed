import type { RequestHandler } from "@sveltejs/kit";
import contributors from "./contributors.json" assert { type: "json" };

export const prerender = true;

export const GET: RequestHandler = () => {
	return Response.json(contributors);
};
