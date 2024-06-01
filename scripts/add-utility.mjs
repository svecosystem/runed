/* CLI tool to add a new utility. It asks for the utility name and then creates the respective files. */
import fs from "node:fs";
import readlineSync from "readline-sync";

function toKebabCase(str) {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

const utilsDir = "./packages/runed/src/lib/utilities";
const contentDir = "./sites/docs/content/utilities";
const demosDir = "./sites/docs/src/lib/components/demos";

const utilName = readlineSync.question("What is the name of the utility? ");

const utilDir = `${utilsDir}/${utilName}`;
const utilIndexFile = `${utilDir}/index.ts`;
const utilMainFile = `${utilDir}/${utilName}.svelte.ts`;
const utilsBarrelFile = `${utilsDir}/index.ts`;
const contentFile = `${contentDir}/${toKebabCase(utilName)}.md`;
const demoFile = `${demosDir}/${toKebabCase(utilName)}.svelte`;

fs.mkdirSync(utilDir, { recursive: true });
fs.writeFileSync(utilIndexFile, `export { ${utilName} } from "./${utilName}.svelte.js";`);
fs.writeFileSync(utilMainFile, "");
fs.appendFileSync(utilsBarrelFile, `export { ${utilName} } from "./${utilName}/index.js";`);

fs.writeFileSync(
	contentFile,
	`---
title: ${utilName}
description: N/A
category: New
---

<script>
import Demo from '$lib/components/demos/${toKebabCase(utilName)}.svelte';
</script>

## Demo

<Demo />

## Usage
`
);

fs.writeFileSync(demoFile, "");
