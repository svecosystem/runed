import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	let layout = event.cookies.get("WithRunes:layout");
	if (layout) {
		layout = JSON.parse(layout);
	}

	return {
		layout,
	};
};
