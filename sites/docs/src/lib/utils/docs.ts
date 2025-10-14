import { docs, type Doc } from "$content/index.js";
import { error } from "@sveltejs/kit";
import type { Component } from "svelte";

export function getDocMetadata(slug: string = "index") {
	return docs.find((doc) => doc.slug === slug);
}

export function getAllDocs() {
	return docs;
}

function slugFromPath(path: string) {
	return path.replace("/src/content/", "").replace(".md", "");
}

export type DocResolver = () => Promise<{ default: Component; metadata: Doc }>;

interface Contributor {
	login: string;
	name?: string;
	avatar_url: string;
	contributions: number;
}

export async function getDoc(slug: string = "index", fetch: typeof globalThis.fetch) {
	const modules = import.meta.glob("/src/content/**/*.md");

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}
	const doc = await match?.resolver?.();
	const metadata = getDocMetadata(slug);
	if (!doc || !metadata) {
		error(404, "Could not find the document.");
	}

	let contributors: Contributor[] = [];

	if (slug.includes("utilities/")) {
		const utility = slug.split("/").pop();
		if (utility) {
			const res = await fetch(`/api/contributors.json`);
			const data = await res.json();
			contributors = data[utility] ?? [];
		}
	}

	return {
		component: doc.default,
		metadata,
		contributors,
	};
}
