import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { docs } from "../.velite/index.js";
import { cleanMarkdown } from "../node_modules/@svecodocs/kit/dist/utils.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export function buildDocsSearchIndex() {
	return docs.map((doc) => ({
		title: doc.title,
		href: `/docs/${doc.slug}`,
		description: doc.description,
		content: cleanMarkdown(doc.raw),
	}));
}

const searchData = buildDocsSearchIndex();

writeFileSync(
	resolve(__dirname, "../src/routes/api/search.json/search.json"),
	JSON.stringify(searchData),
	{ flag: "w" }
);
