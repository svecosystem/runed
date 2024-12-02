import { getDoc } from "$lib/utils/docs.js";

export async function load({ params }) {
	return getDoc(params.slug);
}
