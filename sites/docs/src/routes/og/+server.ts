import { redirect } from "@sveltejs/kit";

export function GET({ url }) {
	const destination = "https://og.runed.dev/og";
	// append the query params to the destination
	const destinationWithParams = new URL(destination);
	destinationWithParams.search = url.search;
	redirect(302, destinationWithParams.toString());
}
