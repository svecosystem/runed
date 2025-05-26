# Runed Kit Utilities

This subpath contains utilities that require SvelteKit to be installed.

## Installation

Make sure you have SvelteKit installed:

```bash
npm install @sveltejs/kit
```

## Usage

```typescript
// Import SvelteKit-dependent utilities from the kit subpath
import { useSearchParams } from "runed/kit";

// Regular utilities are still available from the main export
import { isMounted, useEventListener } from "runed";
```

## Available Utilities

- `useSearchParams` - Reactive URL search parameters management (requires SvelteKit)

## Why a separate subpath?

The main `runed` package is designed to work with Svelte alone, without requiring SvelteKit.
However, some utilities like `useSearchParams` need SvelteKit's routing and navigation features. By
providing these utilities through a separate import path, we ensure:

1. The main package remains lightweight and SvelteKit-free
2. SvelteKit users can access additional utilities when needed
3. Clear separation of dependencies and requirements
