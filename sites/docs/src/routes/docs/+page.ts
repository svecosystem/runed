import type { PageLoad } from "./$types.js";
import { getDoc } from "$lib/utils/docs.js";

export const load: PageLoad = async () => {
	const { component, title, metadata } = await getDoc("index");
	return {
		component,
		title,
		metadata,
	};
};
