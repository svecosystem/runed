import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	let layout = event.cookies.get("Runed:layout");
	if (layout) {
		layout = JSON.parse(layout);
	}

	return {
		layout,
	};
};
