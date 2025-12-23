<script lang="ts">
	import { FileIcon, FolderIcon } from "@lucide/svelte";
	import { DemoContainer } from "@svecodocs/kit";
	import { LazyState } from "runed";

	class FileNode {
		name: string;

		constructor(name: string) {
			this.name = $state.raw(name);
		}
	}

	class FolderNode {
		name: string;
		children: LazyState<TreeNode[]>;
		expanded = $state.raw(false);

		constructor(name: string, children: () => TreeNode[]) {
			this.name = $state.raw(name);
			this.children = new LazyState(children);
		}
	}

	type TreeNode = FileNode | FolderNode;

	const root: TreeNode[] = $state([
		new FolderNode("Pictures", () =>
			Array(100)
				.fill(null)
				.map(
					(_, i) =>
						new FolderNode(`Folder ${i + 1}`, () =>
							Array(100)
								.fill(null)
								.map((_, j) => new FileNode(`File ${j + 1}.png`))
						)
				)
		),
		new FileNode("README.md"),
	]);

	function onToggleExpansion(node: TreeNode) {
		if (node instanceof FolderNode) {
			node.expanded = !node.expanded;
		}
	}
</script>

{#snippet treeitems(nodes: TreeNode[], depth: number)}
	{#each nodes as node (node)}
		<button class="hover:bg-muted w-full px-4 py-2" onclick={() => onToggleExpansion(node)}>
			<div
				class="flex items-center gap-2"
				style:padding-inline-start="calc({depth * 6} * var(--spacing))"
			>
				{#if node instanceof FileNode}
					<FileIcon role="presentation" class="size-4" />
				{:else}
					<FolderIcon role="presentation" class="size-4" />
				{/if}

				{node.name}

				{#if node instanceof FolderNode && node.children.initialized}
					<div class="grow text-end">initialized</div>
				{/if}
			</div>
		</button>

		{#if node instanceof FolderNode && node.expanded}
			{@render treeitems(node.children.current, depth + 1)}
		{/if}
	{/each}
{/snippet}

<DemoContainer class="h-100">
	{@render treeitems(root, 0)}
</DemoContainer>
