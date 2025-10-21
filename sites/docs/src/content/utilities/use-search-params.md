---
title: useSearchParams
description: Reactive, schema-validated URL search params for Svelte/SvelteKit
category: Reactivity
---

<script>
import Demo from '$lib/components/demos/use-search-params.svelte';
import { Callout } from '@svecodocs/kit';
</script>

`useSearchParams` provides a reactive, type-safe, and schema-driven way to manage URL search
parameters in Svelte/SvelteKit apps. It supports validation, default values, compression,
debouncing, and history control.

## Demo

<Demo />
<Callout>
	You can refresh this page and/or open it in another tab to see the count state being persisted
	and synchronized across sessions and tabs.
</Callout>

## Requirements

- **`@sveltejs/kit`** must be installed in your project.
- Uses [Standard Schema](https://standardschema.dev/) for schema validation and type inference.

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
import { useSearchParams } from "runed/kit";
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
import { validateSearchParams } from "runed/kit";
import { productSearchSchema } from "./schemas";

export const load = ({ url, fetch }) => {
	// Get validated search params as URLSearchParams object
	// If you use a custom compressedParamName in useSearchParams, provide it here too:
	const { searchParams } = validateSearchParams(url, productSearchSchema);

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
- `noScroll` (boolean): When true, the scroll position is preserved when the URL is updated. This
  prevents the page from jumping to the top on URL changes. Default is false.

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
- **No granular reactivity**: Changes to nested properties require reassigning the entire value
  - ❌ `params.config.theme = 'dark'` (won't trigger URL update)
  - ✅ `params.config = {...params.config, theme: 'dark'}` (will trigger URL update)

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
- Dates are stored as ISO8601 strings: `?createdAt=2023-12-01T10:30:00.000Z` (or `YYYY-MM-DD` with
  date-only format)
- Primitive values are stored directly: `?page=2&filter=red`

#### Date Format Support

You can control how Date parameters are serialized in URLs using two approaches:

**Option 1: Using `dateFormat` property in schema**

```ts
const schema = createSearchParamsSchema({
	// Date-only format (YYYY-MM-DD) - great for birth dates, event dates
	birthDate: {
		type: "date",
		default: new Date("1990-01-15"),
		dateFormat: "date"
	},

	// Full datetime format (ISO8601) - great for timestamps
	createdAt: {
		type: "date",
		default: new Date(),
		dateFormat: "datetime"
	},

	// No format specified - defaults to 'datetime'
	updatedAt: {
		type: "date",
		default: new Date()
	}
});

const params = useSearchParams(schema);
// URL: ?birthDate=1990-01-15&createdAt=2023-01-01T10:30:00.000Z&updatedAt=2023-12-25T18:30:00.000Z
```

**Option 2: Using `dateFormats` option (works with any validator)**

```ts
// Works with Zod, Valibot, Arktype, or createSearchParamsSchema
const params = useSearchParams(zodSchema, {
	dateFormats: {
		birthDate: "date", // YYYY-MM-DD
		createdAt: "datetime" // ISO8601
	}
});
```

**Date Format Details:**

- **`'date'` format**: Serializes as `YYYY-MM-DD` (e.g., `2025-10-21`)
  - More readable in URLs
  - Perfect for calendar dates, birth dates, event dates
  - Parsed as Date object with time set to midnight UTC
- **`'datetime'` format** (default): Serializes as full ISO8601 (e.g., `2025-10-21T18:18:14.196Z`)
  - Preserves exact time information
  - Perfect for timestamps, created/updated times
  - Full precision date and time

**Practical Example:**

```svelte
<script lang="ts">
	import { useSearchParams, createSearchParamsSchema } from "runed/kit";

	const schema = createSearchParamsSchema({
		eventDate: {
			type: "date",
			default: new Date("2025-01-01"),
			dateFormat: "date"
		},
		createdAt: {
			type: "date",
			default: new Date(),
			dateFormat: "datetime"
		}
	});

	const params = useSearchParams(schema);
</script>

<label>
	Event Date:
	<input
		type="date"
		value={params.eventDate.toISOString().split("T")[0]}
		oninput={(e) => (params.eventDate = new Date(e.target.value))} />
</label>

<label>
	Created At:
	<input
		type="datetime-local"
		value={params.createdAt.toISOString().slice(0, 16)}
		oninput={(e) => (params.createdAt = new Date(e.target.value))} />
</label>

<!-- URL will be: ?eventDate=2025-01-01&createdAt=2025-10-21T18:18:14.196Z -->
```

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
- `options`: Optional configuration (like custom `compressedParamName` and `dateFormats`)

**Returns:**

- An object with `searchParams` and `data` properties, `searchParams` being the validated
  `URLSearchParams` and `data` being the validated object

**Available options:**

- `compressedParamName` (string): Custom name for compressed parameter (default: `_data`)
- `dateFormats` (object): Map of field names to date formats (`'date'` or `'datetime'`)

Example with SvelteKit page or layout load function:

```ts
import { validateSearchParams } from "runed/kit";
import { productSchema } from "./schemas";

export const load = ({ url, fetch }) => {
	// Get validated search params as URLSearchParams object
	// If you use a custom compressedParamName in useSearchParams, provide it here too:
	const { searchParams } = validateSearchParams(url, productSchema, {
		compressedParamName: "_compressed",
		dateFormats: {
			birthDate: "date", // Serialize as YYYY-MM-DD
			createdAt: "datetime" // Serialize as ISO8601
		}
	});

	// Use URLSearchParams directly with fetch
	const response = await fetch(`/api/products?${searchParams.toString()}`);
	return {
		products: await response.json()
	};
};
```

## Reactivity Limitations

### Understanding Reactivity Scope

`useSearchParams` provides **top-level reactivity only**. This means:

✅ **Works (Direct property assignment)**:

```svelte
<script>
	const params = useSearchParams(schema);

	// These trigger URL updates
	params.page = 2;
	params.filter = "active";
	params.config = { theme: "dark", size: "large" };
	params.items = [...params.items, newItem];
</script>
```

❌ **Doesn't work (Nested property mutations)**:

```svelte
<script>
	const params = useSearchParams(schema);

	// These DON'T trigger URL updates
	params.config.theme = "dark"; // Nested object property
	params.items.push(newItem); // Array method
	params.items[0].name = "updated"; // Array item property
	delete params.config.oldProp; // Property deletion
</script>
```

### Why This Design Choice

`useSearchParams` was designed to prioritize **simplicity, type safety, and ease of use** over deep
reactivity. This design choice offers several benefits:

#### ✅ **What You Get**

- **Simple, predictable API**: `params.page = 2` always works
- **Full TypeScript support**: Perfect autocomplete and type checking
- **Clean URLs**: Objects serialize to readable JSON strings
- **Performance**: No overhead from tracking deep object changes
- **Reliability**: No edge cases with complex nested proxy behaviors

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

	/**
	 * If true, the page will not scroll to the top when the URL is updated.
	 * This is useful if you want to maintain the user's scroll position during parameter changes.
	 * @default false
	 */
	noScroll?: boolean;

	/**
	 * Specifies which date fields should use date-only format (YYYY-MM-DD) instead of full ISO8601 datetime.
	 *
	 * Map field names to their desired format:
	 * - 'date': Serializes as YYYY-MM-DD (e.g., "2025-10-21")
	 * - 'datetime': Serializes as full ISO8601 (e.g., "2025-10-21T18:18:14.196Z")
	 *
	 * Example:
	 * { dateFormats: { birthDate: 'date', createdAt: 'datetime' } }
	 *
	 * @default undefined (all dates use datetime format)
	 */
	dateFormats?: Record<string, "date" | "datetime">;
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
 * Allows specifying more precise types for arrays, objects, and dates
 */
type SchemaTypeConfig<ArrayType = unknown, ObjectType = unknown> =
	| { type: "string"; default?: string }
	| { type: "number"; default?: number }
	| { type: "boolean"; default?: boolean }
	| { type: "array"; default?: ArrayType[]; arrayType?: ArrayType }
	| { type: "object"; default?: ObjectType; objectType?: ObjectType }
	| { type: "date"; default?: Date; dateFormat?: "date" | "datetime" };
```
