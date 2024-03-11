import { error } from "@sveltejs/kit";
import type { Doc } from "../../../.contentlayer/generated/index.js";

export type FrontMatter = Pick<Doc, "title" | "description" | "tagline">;

export type DocFile = {
	default: import("svelte").SvelteComponent;
	metadata: FrontMatter;
};

export type DocResolver = () => Promise<DocFile>;

type TDoc = {
	component: DocFile["default"];
	metadata: DocFile["metadata"];
	title: string;
};

export function slugFromPath(path: string) {
	return path.replace("/content/", "").replace(".md", "");
}

type Modules = Record<string, () => Promise<unknown>>;

function findMatch(slug: string, modules: Modules) {
	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path).toLowerCase() === slug.toLowerCase()) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}
	if (!match.path) {
		match = getIndexDocIfExists(slug, modules);
	}

	return match;
}

function getIndexDocIfExists(slug: string, modules: Modules) {
	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (path.includes(`/${slug}/index.md`)) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	return match;
}

export async function getDoc(slug: string): Promise<TDoc> {
	const modules = import.meta.glob(`/content/**/*.md`);
	const match = findMatch(slug, modules);
	const doc = await match?.resolver?.();

	if (!doc || !doc.metadata) {
		error(404);
	}

	return {
		component: doc.default,
		metadata: doc.metadata,
		title: doc.metadata.title,
	};
}

export function slugFromPathname(pathname: string) {
	return pathname.split("/").pop() ?? "";
}

export function isTitleActive(currentSlug: string, title: string) {
	const slugifiedTitle = title.toLowerCase().replaceAll(" ", "-");
	return currentSlug === slugifiedTitle;
}
