import { getDoc } from "$lib/utils/docs.js";

export async function load() {
	return getDoc();
}
