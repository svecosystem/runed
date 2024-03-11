import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	let layout = event.cookies.get("PaneForge:layout");
	if (layout) {
		layout = JSON.parse(layout);
	}

	return {
		layout,
	};
};
