import process from "node:process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Contributor } from "@svecodocs/kit";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

interface GitHubCommit {
	author: {
		login: string;
		avatar_url: string;
	} | null;
	commit: {
		author: {
			name: string;
			email: string;
		};
	};
}

async function getContributorsForPaths(
	paths: string[],
	owner: string = "svecosystem",
	repo: string = "runed"
): Promise<Contributor[]> {
	if (!process.env.GITHUB_TOKEN) return [];

	const headers: Record<string, string> = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "runed-contributors-fetcher",
		Authorization: `token ${process.env.GITHUB_TOKEN}`,
	};

	const contributorMap = new Map<string, Contributor>();

	for (const path of paths) {
		try {
			const response = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&per_page=100`,
				{ headers }
			);

			if (!response.ok) {
				console.warn(`Failed to fetch commits for ${path}: ${response.statusText}`);
				continue;
			}

			const commits: GitHubCommit[] = await response.json();

			for (const commit of commits) {
				if (commit.author && commit.author.login) {
					const login = commit.author.login;

					if (contributorMap.has(login)) {
						contributorMap.get(login)!.contributions++;
					} else {
						contributorMap.set(login, {
							login,
							name: commit.commit.author.name,
							avatar_url: commit.author.avatar_url,
							contributions: 1,
						});
					}
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error) {
			console.error(`Error fetching contributors for ${path}:`, error);
		}
		if (path === "packages/runed/src/lib/utilities/context") {
			// manually adding because I renamed files and thus he doesn't get credit for creating
			// this utility
			contributorMap.set("abdel-17", {
				login: "abdel-17",
				name: "Abdelrahman",
				avatar_url: "https://avatars.githubusercontent.com/u/88583085?v=4",
				contributions: 10,
			});
		}
	}

	return Array.from(contributorMap.values()).sort((a, b) => b.contributions - a.contributions);
}

function getPathsForUtility(utility: string) {
	return [
		`packages/runed/src/lib/utilities/${utility}`,
		`sites/docs/src/content/utilities/${utility}.md`,
		`sites/docs/src/lib/components/demos/${utility}.svelte`,
	];
}

async function getAllUtilityNames() {
	const utilities = await fs.readdir(path.join(__dirname, "../src/content/utilities"));
	return utilities.map((util) => util.replace(".md", ""));
}

type UtilityContributors = {
	[key: string]: Contributor[];
};

async function main() {
	console.info("Getting all utility names...");
	const utilityNames = await getAllUtilityNames();
	console.info(`Found ${utilityNames.length} utilities`);

	const utilityContributors: UtilityContributors = {};

	for (const utility of utilityNames) {
		console.info(`Getting contributors for ${utility}...`);
		const contributors = await getContributorsForPaths(getPathsForUtility(utility));
		console.info(`Found ${contributors.length} contributors for ${utility}`);
		utilityContributors[utility] = contributors;
	}

	console.info("Writing contributors to file...");
	await fs.writeFile(
		path.join(__dirname, "../src/routes/api/contributors.json/contributors.json"),
		JSON.stringify(utilityContributors, null, 2)
	);
	console.info("Done!");
}

main();
