import { getDoc } from "$lib/utils/docs.js";

export const prerender = true;

export async function load({ params, fetch }) {
	return await getDoc(params.slug, fetch);
}
