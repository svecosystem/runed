# PaneForge

<!-- automd:badges license name="paneforge" color="green" github="svecosystem/paneforge" -->

[![npm version](https://flat.badgen.net/npm/v/paneforge?color=green)](https://npmjs.com/package/paneforge)
[![npm downloads](https://flat.badgen.net/npm/dm/paneforge?color=green)](https://npmjs.com/package/paneforge)
[![license](https://flat.badgen.net/github/license/svecosystem/paneforge?color=green)](https://github.com/svecosystem/paneforge/blob/main/LICENSE)

<!-- /automd -->

PaneForge provides components that make it easy to create resizable panes in your Svelte apps. It's designed to be simple to use, and to work well with other Svelte components and libraries. This project has taken a lot of inspiration and code from the work done by [Bryan Vaughn](https://github.com/bvaughn) and [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) and seeks to provide a similar experience for Svelte developers.

## Features

-   **Simple API**: PaneForge is designed to be easy to use. It provides a small set of components that can be combined to create complex layouts.
-   **Resizable Panes**: Panes can be resized by dragging the resizer between them.
-   **Nested Groups**: Groups of panes can be nested inside other groups to create complex layouts.
-   **Customizable**: The appearance and behavior of the panes can be customized using CSS and Svelte props.
-   **Persistent Layouts**: PaneForge can be used with LocalStorage or cookies to persist the layout of the panes between page loads.
-   **Accessible**: PaneForge is designed to be accessible to all users, including those who use assistive technologies.
-   **Community-driven**: PaneForge is an open-source project that welcomes contributions from the community. If you have an idea for a new feature or an improvement, we'd love to hear from you!

## Installation

```bash
npm install paneforge
```

## Basic Usage

Here's a simple example of how to use Paneforge to create a horizontal pane group with two panes:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
</script>

<PaneGroup direction="horizontal">
	<Pane defaultSize={50}>Pane 1</Pane>
	<PaneResizer />
	<Pane defaultSize={50}>Pane 2</Pane>
</PaneGroup>
```

The `PaneGroup` component is used to initialize a pane group, and the `Pane` component is used to create a pane. The `PaneResizer` component is used to create a resizer that can be dragged to resize the panes.

The components ship only with the styles necessary to position the panes in the appropriate layout. The rest of the styling is up to you.

For more information, see the [Documentation](https://paneforge.com).

## Sponsors

This project is supported by the following beautiful people/organizations:

<p align="center">
  <a href="https://github.com/sponsors/huntabyte">
    <img src='https://cdn.jsdelivr.net/gh/huntabyte/static/sponsors.svg' alt="Logos from Sponsors" />
  </a>
</p>

## License

<!-- automd:contributors license=MIT author="huntabyte" -->

Published under the [MIT](https://github.com/svecosystem/paneforge/blob/main/LICENSE) license.
Made by [@huntabyte](https://github.com/huntabyte) and [community](https://github.com/svecosystem/paneforge/graphs/contributors) 💛
<br><br>
<a href="https://github.com/svecosystem/paneforge/graphs/contributors">
<img src="https://contrib.rocks/image?repo=svecosystem/paneforge" />
</a>

<!-- /automd -->
