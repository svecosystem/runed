---
title: useSearchParams
description: Reactive, schema-validated URL search params for Svelte/SvelteKit
category: Reactivity
---

## Requirements

- **@sveltejs/kit** must be installed in your project (peer dependency).
- Uses [Standard Schema](https://standardschema.dev/) for schema validation and type inference.

`useSearchParams` provides a reactive, type-safe, and schema-driven way to manage URL search
parameters in Svelte/SvelteKit apps. It supports validation, default values, compression,
debouncing, and history control.

## Usage

Define schema:

```ts
// schemas.ts
import { z } from "zod";
// Version 3.24.0+

export const productSearchSchema = z.object({
	page: z.coerce.number().default(1),
	filter: z.string().default(""),
	sort: z.enum(["newest", "oldest", "price"]).default("newest")
});
```

In your svelte code:

```svelte
<script lang="ts">
import { productSearchSchema } from './schemas';

const params = useSearchParams(productSearchSchema);
// Access parameters directly
const page = $derived(params.page); // number (defaults to 1)
const sort = $derived(params.sort); // 'newest' | 'oldest' | 'price'

// Update parameters directly
params.page = 2; // Updates URL to include ?page=2
// Updates URL to include ?page=3&sort=oldest
params.update({ page: 3, sort: 'oldest' });
// Resets all parameters to their default values
params.reset();
// Returns URLSearchParams object with all current parameter values
params.toURLSearchParams();
/**
 * You can watch for changes to the URLSearchParams object
 * For example:
 * watch(() => params.toURLSearchParams(), () => {
 *   // Do something whenever the URLSearchParams object changes
 * })
 */
</script>

<-- Great for binding to input fields -->
<input type="text" bind:value={params.filter} />
```

In your load function:

```ts
import { validateSearchParams } from "runed";
import { productSearchSchema } from "./schemas";

export const load = ({ url, fetch }) => {
	// Get validated search params as URLSearchParams object
	// If you use a custom compressedParamName in useSearchParams, provide it here too:
	const searchParams = validateSearchParams(url, productSearchSchema);

	// Use URLSearchParams directly with fetch
	const response = await fetch(`/api/products?${searchParams.toString()}`);
	return {
		products: await response.json()
	};
};
```

## Features

- **Schema Validation**: Define types, defaults, and structure for each param.
- **Default Values**: Missing params are auto-filled with defaults.
- **Type Safety**: All values are parsed and validated to the schema.
- **Compression**: Store all params in a single compressed `_data` param for cleaner URLs.
- **Debounce**: Optionally debounce updates for smoother UX.
- **History Control**: Choose between push/replace state.
- **In-memory Mode**: Params are kept in memory, not in the URL.
- **Invalid Param Handling**: Invalid values are replaced with defaults and removed from the URL.

### `useSearchParams`

Hook to create a reactive search params object with property access

This client-side hook automatically updates the URL when parameters change. It provides type-safe
access to URL search parameters through direct property access.

**Parameters:**

- `schema`: A validation schema compatible with StandardSchemaV1
- `options`: Configuration options that affect URL behavior

**Returns:**

- A reactive object for working with typed search parameters

#### Available options:

- `showDefaults` (boolean): When true, parameters with default values will be shown in the URL. When
  false (default), parameters with default values will be omitted from the URL.
- `debounce` (number): Milliseconds to delay URL updates when parameters change. Useful to avoid
  cluttering browser history when values change rapidly (default: 0, no debounce).
- `pushHistory` (boolean): Controls whether URL updates create new browser history entries. If true
  (default), each update adds a new entry to the browser history. If false, updates replace the
  current URL without creating new history entries.
- `compress` (boolean): When true, all parameters are compressed into a single parameter using
  lz-string compression. This helps reduce URL length and provides basic obfuscation (default:
  false). Use validateSearchParams with the same compressedParamName option when handling compressed
  URLs server-side.
- `compressedParamName` (string): The name of the parameter used to store compressed data when
  compression is enabled. Customize this to avoid conflicts with parameters in your schema. Default
  is `_data`.
- `updateURL` (boolean): When true (default), the URL is updated when parameters change. When false,
  only in-memory parameters are updated.

Example with [Zod](https://zod.dev/):

```ts
import { z } from "zod";

const productSearchSchema = z.object({
	page: z.number().default(1),
	filter: z.string().default(""),
	sort: z.enum(["newest", "oldest", "price"]).default("newest")
});
const params = useSearchParams(productSearchSchema);
// Access parameters directly
const page = $derived(params.page); // number (defaults to 1)
const sort = $derived(params.sort); // 'newest' | 'oldest' | 'price'
```

Example with options:

```ts
// Show default values in URL, debounce updates by 300ms,
// don't create new history entries, and compress params
const params = useSearchParams(schema, {
  showDefaults: true,
  debounce: 300,
  pushHistory: false,
  compress: true,
  compressedParamName: '_compressed' // Custom name to avoid conflicts
});
// Great for binding to input fields (updates URL without cluttering history)
<input type="text" bind:value={params.search} />
// Resulting URL will be something like: /?_compressed=N4IgDgTg9g...
```

Example with [Valibot](https://valibot.dev/):

```ts
import * as v from "valibot";
const productSearchSchema = v.object({
	page: v.optional(v.fallback(v.number(), 1), 1),
	filter: v.optional(v.fallback(v.string(), ""), ""),
	sort: v.optional(v.fallback(v.picklist(["newest", "oldest", "price"]), "newest"), "newest")
});
const params = useSearchParams(productSearchSchema);
```

Example with [Arktype](https://arktype.io/):

```ts
import { type } from "arktype";
const productSearchSchema = type({
	page: "number = 1",
	filter: 'string = ""',
	sort: '"newest" | "oldest" | "price" = "newest"'
});
const params = useSearchParams(productSearchSchema);
```

Or with our built-in schema creator (no additional dependencies)

### `createSearchParamsSchema`

Creates a simple schema compatible with [Standard Schema](https://standardschema.dev/) without
requiring external validation libraries.

This is a lightweight alternative to using full schema validation libraries like Zod, Valibot, or
Arktype. Use this when you need basic type conversion and default values without adding
dependencies.

Limitations:

- For 'array' type: supports basic arrays, but doesn't validate array items
- For 'object' type: supports generic objects, but doesn't validate nested properties
- No custom validation rules or transformations

For complex validation needs (nested validation, refined rules, etc.), use a dedicated validation
library instead.

```ts
const productSearchSchema = createSearchParamsSchema({
	// Basic types with defaults
	page: { type: "number", default: 1 },
	filter: { type: "string", default: "" },
	sort: { type: "string", default: "newest" },

	// Array type with specific element type
	tags: {
		type: "array",
		default: ["new"],
		arrayType: "" // Specify string[] type
	},

	// Object type with specific shape
	config: {
		type: "object",
		default: { theme: "light" },
		objectType: { theme: "" } // Specify { theme: string } type
	}
});
```

URL storage format:

- Arrays are stored as JSON strings: `?tags=["sale","featured"]`
- Objects are stored as JSON strings: `?config={"theme":"dark","fontSize":14}`
- Primitive values are stored directly: `?page=2&filter=red`

### `validateSearchParams`

A utility function to extract, validate and convert URL search parameters to
[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

This function makes it easy to use the same schema validation in both client-side components (via
`useSearchParams`) and server-side load functions. Unlike `useSearchParams, this function doesn't
modify the URL - it only validates parameters and returns them as a new URLSearchParams object.

Handles both standard URL parameters and compressed parameters (when compression is enabled).

**Parameters:**

- `url`: The URL object from SvelteKit load function
- `schema`: A validation schema (createSearchParamsSchema, Zod, Valibot, etc.)
- `options`: Optional configuration (like custom `compressedParamName`)

**Returns:**

- URLSearchParams object with the validated values

Example with SvelteKit page or layout load function:

```ts
import { validateSearchParams } from "runed";
import { productSchema } from "./schemas";

export const load = ({ url, fetch }) => {
	// Get validated search params as URLSearchParams object
	// If you use a custom compressedParamName in useSearchParams, provide it here too:
	const searchParams = validateSearchParams(url, productSchema, {
		compressedParamName: "_compressed"
	});

	// Use URLSearchParams directly with fetch
	const response = await fetch(`/api/products?${searchParams.toString()}`);
	return {
		products: await response.json()
	};
};
```

## Type Definitions

```ts
interface SearchParamsOptions {
	/**
	 * If true, parameters set to their default values will be shown in the URL.
	 * If false, parameters with default values will be omitted from the URL.
	 * @default false
	 */
	showDefaults?: boolean;

	/**
	 * The number of milliseconds to delay URL updates when parameters change.
	 * This helps avoid cluttering browser history when values change rapidly
	 * (like during typing in an input field).
	 * @default 0 (no debounce)
	 */
	debounce?: number;

	/**
	 * Controls whether URL updates create new browser history entries.
	 * If true (default), each update adds a new entry to the browser history.
	 * If false, updates replace the current URL without creating new history entries.
	 * @default true
	 */
	pushHistory?: boolean;

	/**
	 * Enable lz-string compression for all parameters.
	 * When true, all parameters are compressed into a single parameter in the URL.
	 * This helps reduce URL length and provides basic parameter obfuscation.
	 * @default false
	 */
	compress?: boolean;

	/**
	 * The name of the parameter used to store compressed data when compression is enabled.
	 * You can customize this to avoid conflicts with your schema parameters.
	 * For example, if your schema already uses '_data', you might want to use '_compressed' or another unique name.
	 * @default '_data'
	 */
	compressedParamName?: string;

	/**
	 * Controls whether to update the URL when parameters change.
	 * If true (default), changes to parameters will update the URL.
	 * If false, parameters will only be stored in memory without updating the URL.
	 * Note: When false, compress option will be ignored.
	 * @default true
	 */
	updateURL?: boolean;
}

type ReturnUseSearchParams<Schema extends StandardSchemaV1> = {
	[key: string]: any; // Typed, reactive params
	/**
	 * Update multiple parameters at once
	 *
	 * This is more efficient than setting multiple parameters individually
	 * because it only triggers one URL update or one in-memory store update.
	 *
	 * @param values An object containing parameter key-value pairs to update.
	 *  For example: params.update({ page: 1, sort: 'newest' })
	 */
	update(values: Partial<StandardSchemaV1.InferOutput<Schema>>): void;
	/**
	 * Reset all parameters to their default values
	 *
	 * This method removes all current URL parameters or in-memory parameters
	 * and optionally sets parameters with non-default values back to their defaults.
	 *
	 * @param showDefaults Whether to show default values in the URL or in-memory store after reset.
	 * If not provided, uses the instance's showDefaults option.
	 */
	reset(showDefaults?: boolean): void;
	/**
	 * Convert the current schema parameters to a URLSearchParams object
	 * This includes all values defined in the schema, regardless of their presence in the URL
	 * @returns URLSearchParams object containing all current parameter values
	 */
	toURLSearchParams(): URLSearchParams;
};

/**
 * Schema type for createSearchParamsSchema
 * Allows specifying more precise types for arrays and objects
 */
type SchemaTypeConfig<ArrayType = unknown, ObjectType = unknown> =
	| { type: "string"; default?: string }
	| { type: "number"; default?: number }
	| { type: "boolean"; default?: boolean }
	| { type: "array"; default?: ArrayType[]; arrayType?: ArrayType }
	| { type: "object"; default?: ObjectType; objectType?: ObjectType };
```
