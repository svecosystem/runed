import { SvelteURLSearchParams } from "svelte/reactivity";
import { dequal } from "dequal/lite";
import * as lzString from "lz-string";
import { browser, building } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/state";
import { IsMounted } from "../is-mounted/is-mounted.svelte.js";
import { BROWSER } from "esm-env";

/**
 * Configuration options for useSearchParams
 */
export interface SearchParamsOptions {
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
	 * 
	 * For example, if your schema already uses '_data', you might want to use '_compressed'
	 * or another unique name.
	 * 
	 * @default '_data'
	 */
	compressedParamName?: string;

	/**
	 * Controls whether to update the URL when parameters change.
	 * If `true` (default), changes to parameters will update the URL.
	 * If `false`, parameters will only be stored in memory without updating the URL.
	 * 
	 * Note: When `false`, compress option will be ignored.
	 * @default true
	 */
	updateURL?: boolean;

	/**
	 * If `true`, the scroll position will be preserved when the URL is updated.
	 * 
	 * If `false`, the scroll position will be reset to the top when the URL is updated.
	 * @default false
	 */
	noScroll?: boolean;
}

/**
 * Extract and pre-process values from URLSearchParams
 *
 * This is a shared utility used by both validateSearchParams and the SearchParams class
 * to ensure consistent conversion of URL string values to JavaScript types.
 *
 * @param searchParams The URLSearchParams object to extract values from
 * @returns An object with processed parameter values
 * @internal
 */
function extractParamValues(searchParams: URLSearchParams): Record<string, unknown> {
	const params: Record<string, unknown> = {};

	for (const [key, value] of searchParams.entries()) {
		try {
			// Special handling for empty arrays and objects
			if (value === "[]") {
				params[key] = [];
				continue;
			}

			if (value === "{}") {
				params[key] = {};
				continue;
			}

			// Try to parse as JSON for complex objects/arrays
			// This handles cases like ?obj={"foo":"bar"} or ?arr=[1,2,3]
			if (value.startsWith("{") || value.startsWith("[")) {
				params[key] = JSON.parse(value);
			}
			// Boolean values are stored as strings, convert them
			else if (value === "true" || value === "false") {
				params[key] = value === "true";
			}
			// Handle comma-separated values as arrays (fallback format)
			else if (value.includes(",")) {
				params[key] = value.split(",");
			}
			// Keep everything else as strings
			else {
				params[key] = value;
			}
		} catch {
			// If JSON parsing fails, treat as regular string
			// This ensures we don't throw errors during type conversion
			params[key] = value;
		}
	}

	return params;
}

/**
 * Extract schema keys by validating an empty object and getting the result keys.
 * This works with any StandardSchemaV1-compatible schema (Zod, Valibot, Arktype, etc.)
 *
 * @param schema A StandardSchemaV1-compatible schema
 * @returns Array of parameter keys defined in the schema
 * @internal
 */
function extractSchemaKeys<Schema extends StandardSchemaV1>(schema: Schema): string[] {
	const validationResult = schema["~standard"].validate({});

	if (validationResult && "value" in validationResult) {
		const value = validationResult.value as Record<string, unknown>;
		return Object.keys(value);
	}

	return [];
}

/**
 * Extract and pre-process values from URLSearchParams, but only for keys defined in the schema.
 * This enables SvelteKit's fine-grained reactivity by only accessing specific parameters
 * instead of all parameters via searchParams.entries().
 *
 * @param searchParams The URLSearchParams object to extract values from
 * @param schemaKeys Array of parameter keys that are defined in the schema
 * @returns An object with processed parameter values for schema-defined keys only
 * @internal
 */
function extractSelectiveParamValues(
	searchParams: URLSearchParams,
	schemaKeys: string[]
): Record<string, unknown> {
	const params: Record<string, unknown> = {};

	// Only access parameters that are defined in the schema
	// This maintains SvelteKit's fine-grained reactivity
	for (const key of schemaKeys) {
		const value = searchParams.get(key);
		if (value === null) continue;

		try {
			if (value === "[]") {
				params[key] = [];
				continue;
			}

			if (value === "{}") {
				params[key] = {};
				continue;
			}

			// Try to parse as JSON for complex objects/arrays
			// This handles cases like ?obj={"foo":"bar"} or ?arr=[1,2,3]
			if (value.startsWith("{") || value.startsWith("[")) {
				params[key] = JSON.parse(value);
			}
			// Boolean values are stored as strings, convert them
			else if (value === "true" || value === "false") {
				params[key] = value === "true";
			}

			// Handle comma-separated values as arrays (fallback format)
			else if (value.includes(",")) {
				params[key] = value.split(",");
			}
			// Keep everything else as strings
			else {
				params[key] = value;
			}
		} catch {
			// If JSON parsing fails, treat as regular string
			// This ensures we don't throw errors during type conversion
			params[key] = value;
		}
	}

	return params;
}

/** The Standard Schema interface. */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
	/** The Standard Schema properties. */
	readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace StandardSchemaV1 {
	/** The Standard Schema properties interface. */
	export interface Props<Input = unknown, Output = Input> {
		/** The version number of the standard. */
		readonly version: 1;
		/** The vendor name of the schema library. */
		readonly vendor: string;
		/** Validates unknown input values. */
		readonly validate: (value: unknown) => Result<Output> | Promise<Result<Output>>;
		/** Inferred types associated with the schema. */
		readonly types?: Types<Input, Output> | undefined;
	}

	/** The result interface of the validate function. */
	export type Result<T> = SuccessResult<T> | FailureResult;

	/** The result interface if validation succeeds. */
	export interface SuccessResult<T> {
		/** The typed output value. */
		readonly value: T;
		/** The non-existent issues. */
		readonly issues?: undefined;
	}

	/** The result interface if validation fails. */
	export interface FailureResult {
		/** The issues of failed validation. */
		readonly issues: ReadonlyArray<Issue>;
	}

	/** The issue interface of the failure output. */
	export interface Issue {
		/** The error message of the issue. */
		readonly message: string;
		/** The path of the issue, if any. */
		readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
	}

	/** The path segment interface of the issue. */
	export interface PathSegment {
		/** The key representing a path segment. */
		readonly key: PropertyKey;
	}

	/** The Standard Schema types interface. */
	export interface Types<Input = unknown, Output = Input> {
		/** The input type of the schema. */
		readonly input: Input;
		/** The output type of the schema. */
		readonly output: Output;
	}

	/** Infers the input type of a Standard Schema. */
	export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
		Schema["~standard"]["types"]
	>["input"];

	/** Infers the output type of a Standard Schema. */
	export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
		Schema["~standard"]["types"]
	>["output"];
}

/**
 * Core class that handles URL search parameter operations with schema validation
 *
 * This class provides the foundation for the useSearchParams hook. It:
 * 1. Validates values against a schema
 * 2. Handles type conversion between URL strings and JavaScript types
 * 3. Updates the URL when values change
 * 4. Maintains a cache of valid schema keys for performance
 */
class SearchParams<Schema extends StandardSchemaV1> {
	/** The schema used for validation and type conversion */
	#schema: Schema;

	/**
	 * A lookup object containing all valid keys from the schema
	 * Used for fast property existence checking without re-validating
	 * Format: { propertyName1: true, propertyName2: true, ... }
	 */
	#schemaShape: Record<string, true>;

	/**
	 * Options that configure behavior
	 */
	#options: SearchParamsOptions;

	/**
	 * Default values from the schema, used for comparison when showDefaults is false
	 */
	#defaultValues: Record<string, unknown>;

	/**
	 * Timer ID for debouncing URL updates
	 * @private
	 */
	#debounceTimer: ReturnType<typeof setTimeout> | null = null;

	/**
	 * In-memory search parameters when updateURL is false
	 * @private
	 */
	#inMemorySearchParams = $state(new SvelteURLSearchParams());

	/**
	 * Create a new SearchParams instance with the given schema and options
	 *
	 * @param schema A StandardSchemaV1-compatible schema
	 * @param options Configuration options
	 */
	constructor(schema: Schema, options: SearchParamsOptions = {}) {
		this.#schema = schema;
		this.#options = {
			showDefaults: false,
			debounce: 0,
			pushHistory: true,
			compress: false,
			compressedParamName: "_data",
			updateURL: true,
			noScroll: false,
			...options,
		};

		// Extract schema shape and default values by validating an empty object
		const validationResult = this.validate({});

		if (validationResult && "value" in validationResult) {
			const value = validationResult.value as Record<string, unknown>;

			// Store schema shape for property checking
			this.#schemaShape = Object.keys(value).reduce(
				(acc, key) => {
					acc[key] = true;
					return acc;
				},
				{} as Record<string, true>
			);

			// Store default values for comparing later
			this.#defaultValues = { ...value };
		} else {
			this.#schemaShape = {};
			this.#defaultValues = {};
		}
	}

	/**
	 * Get a typed parameter value by key
	 * Retrieves the current value from the URL, runs it through schema validation,
	 * and returns the validated, typed result
	 *
	 * @param key The parameter key to get
	 * @returns The typed value after schema validation
	 */
	get<K extends keyof StandardSchemaV1.InferOutput<Schema>>(
		key: K & string
	): StandardSchemaV1.InferOutput<Schema>[K] {
		return this.#getTypedValue(key) as StandardSchemaV1.InferOutput<Schema>[K];
	}

	/**
	 * Set a parameter value and update the URL
	 * Validates the value through the schema before updating the URL
	 *
	 * @param key The parameter key to set
	 * @param value The value to set (will be type-converted and validated)
	 */
	set<K extends keyof StandardSchemaV1.InferOutput<Schema>>(
		key: K & string,
		value: StandardSchemaV1.InferOutput<Schema>[K]
	): void {
		this.#setValue(key, value);
	}

	/**
	 * Clean up resources used by this instance
	 *
	 * IMPORTANT: You only need to call this method when using the debounce option.
	 * If you're not using debounce, there's no need to call cleanup.
	 *
	 * Call this when the component unmounts to prevent memory leaks from debounce timers.
	 *
	 * @example
	 * Example in a Svelte component with Svelte 5 runes:
	 * ```svelte
	 * <script>
	 *   import { useSearchParams } from '$lib/hooks/useSearchParams.svelte';
	 *
	 *   // Using debounce, so we need to handle cleanup
	 *   const searchParams = useSearchParams(schema, { debounce: 300 });
	 *
	 *   // Register cleanup in a Svelte 5 effect
	 *   $effect(() => {
	 *     return () => {
	 *       // Prevent memory leaks by cleaning up debounce timer
	 *       searchParams.cleanup();
	 *     };
	 *   });
	 * </script>
	 * ```
	 */
	cleanup(): void {
		// Clear any debounce timer
		if (this.#debounceTimer) {
			clearTimeout(this.#debounceTimer);
			this.#debounceTimer = null;
		}
	}

	/**
	 * Update multiple parameters at once
	 *
	 * This is more efficient than setting multiple parameters individually
	 * because it only triggers one URL update or one in-memory store update.
	 *
	 * @param values An object containing parameter key-value pairs to update
	 */
	update(values: Partial<StandardSchemaV1.InferOutput<Schema>>): void {
		if (!values || typeof values !== "object") {
			return;
		}

		// Quick optimization: Filter out non-schema keys upfront
		const filteredValues: Record<string, unknown> = {};
		let anyValid = false;

		for (const [key, value] of Object.entries(values)) {
			if (this.has(key as string)) {
				filteredValues[key] = value;
				anyValid = true;
			}
		}

		if (!anyValid) {
			return; // No valid keys to update
		}

		// Choose the appropriate search params source based on updateURL option and building state
		const isInMemory = building || !this.#options.updateURL;
		const searchParams = isInMemory ? this.#inMemorySearchParams : page.url.searchParams;
		const paramsObject = this.#extractParamValues(searchParams);

		// Check if there are any actual changes
		let hasChanges = false;
		for (const [key, value] of Object.entries(filteredValues)) {
			const currentValue = paramsObject[key];

			// Optimization: For primitives, use direct comparison; use dequal only for objects
			const isPrimitive =
				typeof currentValue !== "object" &&
				typeof value !== "object" &&
				currentValue !== null &&
				value !== null;

			if (isPrimitive ? currentValue !== value : !dequal(currentValue, value)) {
				hasChanges = true;
				break;
			}
		}

		if (!hasChanges) {
			return; // No changes, skip update
		}

		// Create a new object with the updated values
		const newParamsObject = { ...paramsObject, ...filteredValues };

		// Validate against schema
		const result = this.validate(newParamsObject);

		if (result && "value" in result) {
			const validatedResult = result.value as Record<string, unknown>;

			// Handle in-memory only updates when updateURL is false
			if (isInMemory) {
				// Update the in-memory store using the helper method
				const updatedParams = this.#updateParamsWithValidatedValues(
					searchParams,
					filteredValues,
					validatedResult,
					isInMemory
				);
				this.#inMemorySearchParams = updatedParams as SvelteURLSearchParams;
				return;
			}

			// Handle the compression mode if enabled (only when updateURL is true)
			if (this.#options.compress) {
				this.#handleCompressedUpdate(validatedResult);
				return;
			}

			// Normal mode handling - update the URL using the helper method
			const newSearchParams = this.#updateParamsWithValidatedValues(
				searchParams,
				filteredValues,
				validatedResult,
				isInMemory
			);

			// Update URL
			this.#navigateWithParams(newSearchParams as URLSearchParams);
		}
	}

	/**
	 * Check if a key exists in the schema
	 * This is a critical method used by the Proxy handler to determine
	 * which properties should be treated as URL parameters
	 *
	 * @param key The key to check
	 * @returns True if the key is defined in the schema
	 */
	has(key: string): boolean {
		return key in this.#schemaShape;
	}

	/**
	 * Reset all parameters to their default values
	 *
	 * This method removes all current URL parameters or in-memory parameters
	 * and optionally sets parameters with non-default values back to their defaults.
	 *
	 * @param showDefaults Whether to show default values in the URL or in-memory store after reset.
	 *                     If not provided, uses the instance's showDefaults option.
	 */
	reset(showDefaults?: boolean): void {
		const useShowDefaults = showDefaults !== undefined ? showDefaults : this.#options.showDefaults;
		const isInMemory = building || !this.#options.updateURL;

		if (useShowDefaults) {
			// Reuse the filtered default values for both URL and in-memory updates
			const validDefaultValues: Record<string, unknown> = {};

			// Filter out null/undefined values
			for (const [key, defaultValue] of Object.entries(this.#defaultValues)) {
				if (defaultValue !== null && defaultValue !== undefined) {
					validDefaultValues[key] = defaultValue;
				}
			}

			if (isInMemory) {
				// For in-memory store, create a new SvelteURLSearchParams
				const newSearchParams = this.#createSearchParams(new SvelteURLSearchParams(), true);

				// Set all valid default values
				for (const [key, value] of Object.entries(validDefaultValues)) {
					const stringValue = this.#serializeValue(value);
					newSearchParams.set(key, stringValue);
				}

				// Update in-memory store
				this.#inMemorySearchParams = newSearchParams as SvelteURLSearchParams;
			} else {
				// For URL updates, create a new URLSearchParams
				const newSearchParams = this.#createSearchParams(new URLSearchParams(), false);

				// Set all valid default values
				for (const [key, value] of Object.entries(validDefaultValues)) {
					const stringValue = this.#serializeValue(value);
					newSearchParams.set(key, stringValue);
				}

				// Use the shared navigation function
				this.#navigateWithParams(newSearchParams as URLSearchParams);
			}
		} else {
			// Not showing defaults - just clear everything
			if (isInMemory) {
				// For in-memory store, create an empty SvelteURLSearchParams
				this.#inMemorySearchParams = new SvelteURLSearchParams();
			} else {
				// For URL updates, navigate to empty search
				if (!BROWSER) return;
				goto("?", { replaceState: true, noScroll: this.#options.noScroll });
			}
		}
	}

	/**
	 * Validate a value against the schema
	 * This is the core method that enforces schema validation
	 *
	 * @param value The value to validate
	 * @returns A StandardSchemaV1.Result containing either the validated value or validation errors
	 */
	validate(value: unknown): StandardSchemaV1.Result<StandardSchemaV1.InferOutput<Schema>> {
		return this.#schema["~standard"].validate(value) as StandardSchemaV1.Result<
			StandardSchemaV1.InferOutput<Schema>
		>;
	}

	/**
	 * Helper method to create a new search params object
	 * Works with both URLSearchParams and SvelteURLSearchParams
	 * @private
	 */
	#createSearchParams(
		base: URLSearchParams | SvelteURLSearchParams,
		isInMemory: boolean
	): URLSearchParams | SvelteURLSearchParams {
		if (isInMemory) {
			// For in-memory, always return SvelteURLSearchParams
			return new SvelteURLSearchParams(base.toString());
		} else {
			// For URL updates, always return URLSearchParams
			return new URLSearchParams(base.toString());
		}
	}

	/**
	 * Helper method to update search params with validated values
	 * Works with both URLSearchParams and SvelteURLSearchParams
	 * @private
	 */
	#updateParamsWithValidatedValues(
		searchParams: URLSearchParams | SvelteURLSearchParams,
		updates: Record<string, unknown>,
		validatedValues: Record<string, unknown>,
		isInMemory: boolean
	): URLSearchParams | SvelteURLSearchParams {
		const newSearchParams = this.#createSearchParams(searchParams, isInMemory);

		for (const key of Object.keys(updates)) {
			// Skip keys not in schema
			if (!this.has(key)) continue

			const validatedValue = validatedValues[key];

			// Check if the value should be omitted
			const isDefaultValue =
				!this.#options.showDefaults && dequal(validatedValue, this.#defaultValues[key]);

			if (validatedValue === undefined || validatedValue === null || isDefaultValue) {
				newSearchParams.delete(key);
			} else {
				const stringValue = this.#serializeValue(validatedValue);
				newSearchParams.set(key, stringValue);
			}
		}

		return newSearchParams;
	}

	/**
	 * Helper method to handle updates when compression is enabled
	 * @private
	 */
	#handleCompressedUpdate(fullParamsObject: Record<string, unknown>): void {
		try {
			// Convert the entire parameters object to JSON
			const jsonData = JSON.stringify(fullParamsObject);

			// Compress the JSON string
			const compressed = lzString.compressToEncodedURIComponent(jsonData);

			// Create new params with just the compressed data
			const newSearchParams = new URLSearchParams();
			const compressedParamName = this.#options.compressedParamName || "_data";
			newSearchParams.set(compressedParamName, compressed);

			// Update URL
			this.#navigateWithParams(newSearchParams);
		} catch (e) {
			console.error("Error compressing data, falling back to normal mode", e);

			// Create new params with all values as fallback
			const newSearchParams = new URLSearchParams();

			for (const [key, value] of Object.entries(fullParamsObject)) {
				if (value === undefined || value === null) {
					continue;
				}

				const stringValue = this.#serializeValue(value);
				newSearchParams.set(key, stringValue);
			}

			this.#navigateWithParams(newSearchParams);
		}
	}

	/**
	 * Helper method to navigate with URL parameters
	 * Handles debouncing and history state
	 * @private
	 */
	#navigateWithParams(params: URLSearchParams) {
		const navigateToNewUrl = () => {
			if (!BROWSER) return;
			// When pushHistory is false, use replaceState to avoid creating a browser history entry
			goto("?" + params.toString(), {
				replaceState: !this.#options.pushHistory,
				noScroll: this.#options.noScroll,
				keepFocus: true
			});

		};

		// If debounce is set, delay the URL update
		if (this.#options.debounce && this.#options.debounce > 0) {
			// Clear any existing timer
			if (this.#debounceTimer) {
				clearTimeout(this.#debounceTimer);
			}

			// Set a new timer
			this.#debounceTimer = setTimeout(navigateToNewUrl, this.#options.debounce);
		} else {
			// No debounce, update immediately
			navigateToNewUrl();
		}
	}

	/**
	 * Converts a value to a URL-compatible string representation
	 * Handles arrays, objects, and primitive values
	 * @private
	 */
	#serializeValue(value: unknown): string {
		if (Array.isArray(value)) {
			return JSON.stringify(value);
		} else if (typeof value === "object" && value !== null) {
			return JSON.stringify(value);
		} else {
			return String(value);
		}
	}

	#extractParamValues(searchParams: URLSearchParams): Record<string, unknown> {
		const compressedParamName = this.#options.compressedParamName || "_data";

		// Check if we're using compression mode and have a compressed parameter
		if (this.#options.compress && searchParams.has(compressedParamName)) {
			try {
				const compressedData = searchParams.get(compressedParamName) || "";
				const decompressed = lzString.decompressFromEncodedURIComponent(compressedData);

				if (decompressed) {
					try {
						// Parse the decompressed JSON
						return JSON.parse(decompressed);
					} catch (e) {
						console.error("Failed to parse decompressed data", e);
						return {};
					}
				}
			} catch (e) {
				console.error("Error decompressing data", e);
			}
			return {};
		}

		// If not using compression, use the normal extraction
		return extractParamValues(searchParams);
	}

	/**
	 * Get typed values from the URL params using schema validation
	 *
	 * This method:
	 * 1. Gets the current search parameters (from URL or in-memory store)
	 * 2. Extracts and processes parameter values
	 * 3. Validates them against the schema
	 * 4. Returns the typed value for the requested key
	 *
	 * @param key The parameter key to get
	 * @returns The typed value after validation or undefined if invalid
	 * @private
	 */
	#getTypedValue<K extends keyof StandardSchemaV1.InferOutput<Schema>>(
		key: K & string
	): StandardSchemaV1.InferOutput<Schema>[K] | undefined {
		// Choose the appropriate search params source based on updateURL option and building state
		const searchParams =
			!building && this.#options.updateURL ? page.url.searchParams : this.#inMemorySearchParams;
		const paramsObject = this.#extractParamValues(searchParams);
		const result = this.validate(paramsObject);

		if (result instanceof Promise) {
			throw new Error("Async validation is not supported in validateSearchParams");
		}
		if (result && "value" in result) {
			return (result.value as Record<string, unknown>)[
				key
			] as StandardSchemaV1.InferOutput<Schema>[K];
		} else if (result && "issues" in result) {
			// If validation fails, use defaults
			const emptyResult = this.validate({});
			const defaultValues = emptyResult && "value" in emptyResult ? emptyResult.value : {};
			// find valid params in the paramsObject and use them, do not override all default values
			const validParams = Object.fromEntries(
				Object.entries(paramsObject).filter(
					([key]) => !result.issues?.some((issue) => issue.path?.includes(key))
				)
			);
			return {
				...(typeof defaultValues === "object" && defaultValues !== null ? defaultValues : {}),
				...validParams,
			}[key] as StandardSchemaV1.InferOutput<Schema>[K];
		}

		// If validation failed, return undefined
		return undefined;
	}

	/**
	 * Set a parameter value and update the URL or in-memory store
	 *
	 * This method:
	 * 1. Gets the current search parameters (from URL or in-memory store)
	 * 2. Extracts and processes all current parameters
	 * 3. Updates the parameter with the new value
	 * 4. Validates the complete parameter object against the schema
	 * 5. Serializes the validated value back to the URL or in-memory store
	 * 6. Updates the browser URL if updateURL is true
	 *
	 * @param key The parameter key to set
	 * @param value The value to set
	 * @private
	 */
	#setValue(key: string, value: unknown): void {
		// Optimization: Skip if the key is not in schema
		if (!this.has(key)) return;

		// Choose the appropriate search params source based on updateURL option and building state
		const isInMemory = building || !this.#options.updateURL;
		const searchParams = isInMemory ? this.#inMemorySearchParams : page.url.searchParams;
		const paramsObject = this.#extractParamValues(searchParams);

		// Check if the new value is the same as the current value
		// Optimization: For primitives, use direct comparison; use dequal only for objects
		const currentValue = paramsObject[key];
		const isPrimitive =
			typeof currentValue !== "object" &&
			typeof value !== "object" &&
			currentValue !== null &&
			value !== null;

		if (isPrimitive ? currentValue === value : dequal(currentValue, value)) {
			// Skip the update if values are the same
			return;
		}

		// Create a new object with the updated value
		const newParamsObject = { ...paramsObject, [key]: value };

		// Validate against schema to ensure type correctness
		const result = this.validate(newParamsObject);

		if (result && "value" in result) {
			const validatedResult = result.value as Record<string, unknown>;

			// If updateURL is false, update in-memory store only
			if (isInMemory) {
				// Create a single key-value update object for this key
				const updateObj = { [key]: value };

				// Update the in-memory store using the helper method
				const updatedParams = this.#updateParamsWithValidatedValues(
					searchParams,
					updateObj,
					validatedResult,
					isInMemory
				);
				this.#inMemorySearchParams = updatedParams as SvelteURLSearchParams;
				return;
			}

			// Handle the compression mode if enabled (only when updateURL is true)
			if (this.#options.compress) {
				this.#handleCompressedUpdate(validatedResult);
				return;
			}

			// Normal mode (non-compressed) handling
			// Create a single key-value update object for this key
			const updateObj = { [key]: value };

			// Update the URL using the helper method
			const newSearchParams = this.#updateParamsWithValidatedValues(
				searchParams,
				updateObj,
				validatedResult,
				isInMemory
			);

			// Use the shared navigation function
			this.#navigateWithParams(newSearchParams as URLSearchParams);
		}
	}
}

/**
 * Schema type for createSearchParamsSchema
 * Allows specifying more precise types for arrays and objects
 */
export type SchemaTypeConfig<ArrayType = unknown, ObjectType = unknown> =
	| { type: "string"; default?: string }
	| { type: "number"; default?: number }
	| { type: "boolean"; default?: boolean }
	| { type: "array"; default?: ArrayType[]; arrayType?: ArrayType }
	| { type: "object"; default?: ObjectType; objectType?: ObjectType };

/**
 * Creates a simple schema compatible with useSearchParams without requiring external validation libraries.
 *
 * This is a lightweight alternative to using full schema validation libraries like Zod, Valibot, or Arktype.
 * Use this when you need basic type conversion and default values without adding dependencies.
 *
 * Limitations:
 * - For 'array' type: supports basic arrays, but doesn't validate array items
 * - For 'object' type: supports generic objects, but doesn't validate nested properties
 * - No custom validation rules or transformations
 * - No granular reactivity: nested property changes require whole-value reassignment
 *   (e.g., params.items = [...params.items, newItem] instead of params.items.push(newItem))
 *
 * For complex validation needs (nested validation, refined rules, etc.), use a dedicated
 * validation library instead.
 *
 * Example usage:
 * ```
 * const productSearchSchema = createSearchParamsSchema({
 *   // Basic types with defaults
 *   page: { type: 'number', default: 1 },
 *   filter: { type: 'string', default: '' },
 *   sort: { type: 'string', default: 'newest' },
 *
 *   // Array type with specific element type
 *   tags: {
 *     type: 'array',
 *     default: ['new'],
 *     arrayType: '' // Specify string[] type
 *   },
 *
 *   // Object type with specific shape
 *   config: {
 *     type: 'object',
 *     default: { theme: 'light' },
 *     objectType: { theme: '' } // Specify { theme: string } type
 *   }
 * });
 * ```
 *
 * URL storage format:
 * - Arrays are stored as JSON strings: ?tags=["sale","featured"]
 * - Objects are stored as JSON strings: ?config={"theme":"dark","fontSize":14}
 * - Primitive values are stored directly: ?page=2&filter=red
 */
export function createSearchParamsSchema<T extends Record<string, SchemaTypeConfig>>(
	schema: T
): StandardSchemaV1<
	unknown,
	{
		[K in keyof T]: T[K] extends { type: "number" }
			? number
			: T[K] extends { type: "boolean" }
				? boolean
				: T[K] extends { type: "array"; arrayType?: infer A }
					? unknown extends A
						? unknown[]
						: A[]
					: T[K] extends { type: "object"; objectType?: infer O }
						? unknown extends O
							? Record<string, unknown>
							: O
						: string;
	}
> {
	type Output = {
		[K in keyof T]: T[K] extends { type: "number" }
			? number
			: T[K] extends { type: "boolean" }
				? boolean
				: T[K] extends { type: "array"; arrayType?: infer A }
					? unknown extends A
						? unknown[]
						: A[]
					: T[K] extends { type: "object"; objectType?: infer O }
						? unknown extends O
							? Record<string, unknown>
							: O
						: string;
	};

	return {
		"~standard": {
			version: 1,
			vendor: "",
			validate: (input: unknown): StandardSchemaV1.Result<Output> => {
				const output = {} as Output;
				const issues: StandardSchemaV1.Issue[] = [];

				// Set default values first
				for (const [key, config] of Object.entries(schema)) {
					(output as Record<string, unknown>)[key] =
						config.default !== undefined ? config.default : null;
				}

				if (input && typeof input === "object") {
					for (const [key, config] of Object.entries(schema)) {
						const inputValue = (input as Record<string, unknown>)[key];
						if (inputValue !== undefined) {
							try {
								switch (config.type) {
									case "number": {
										const num = typeof inputValue === "number" ? inputValue : Number(inputValue);
										if (typeof num !== "number" || !Number.isFinite(num)) {
											issues.push({
												message: `Invalid number for "${key}"`,
												path: [key],
											});
										} else {
											(output as Record<string, unknown>)[key] = num;
										}
										break;
									}
									case "boolean": {
										if (
											typeof inputValue === "boolean" ||
											inputValue === "true" ||
											inputValue === "false"
										) {
											(output as Record<string, unknown>)[key] =
												typeof inputValue === "boolean" ? inputValue : inputValue === "true";
										} else {
											issues.push({
												message: `Invalid boolean for "${key}"`,
												path: [key],
											});
										}
										break;
									}
									case "array": {
										if (Array.isArray(inputValue)) {
											(output as Record<string, unknown>)[key] = inputValue;
										} else {
											issues.push({
												message: `Invalid array for "${key}"`,
												path: [key],
											});
										}
										break;
									}
									case "object": {
										if (
											typeof inputValue === "object" &&
											inputValue !== null &&
											!Array.isArray(inputValue)
										) {
											(output as Record<string, unknown>)[key] = inputValue;
										} else {
											issues.push({
												message: `Invalid object for "${key}"`,
												path: [key],
											});
										}
										break;
									}
									case "string":
									default: {
										(output as Record<string, unknown>)[key] = String(inputValue);
									}
								}
							} catch (e) {
								issues.push({
									message: `Error parsing "${key}": ${(e as Error).message}`,
									path: [key],
								});
							}
						}
					}
				}

				if (issues.length > 0) {
					return { issues };
				}
				return { value: output };
			},
			types: {
				input: {} as unknown,
				output: {} as Output,
			},
		},
	};
}

/**
 * A utility function to extract, validate and convert URL search parameters to [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
 *
 * This function makes it easy to use the same schema validation in
 * both client-side components (via useSearchParams) and server-side load functions.
 * Unlike useSearchParams, this function doesn't modify the URL - it only validates
 * parameters and returns them as a new URLSearchParams object.
 *
 * **Important for SvelteKit fine-grained reactivity**: This function only accesses URL parameters
 * that are defined in your schema, ensuring that load functions only re-run when schema-defined
 * parameters change, not when any URL parameter changes.
 *
 * Handles both standard URL parameters and compressed parameters (when compression is enabled).
 *
 * @param url The URL object from SvelteKit load function
 * @param schema A validation schema (createSearchParamsSchema, Zod, Valibot, etc.)
 * @param options Optional configuration (like custom compressedParamName)
 * @returns URLSearchParams object with the validated values
 *
 * Example with SvelteKit page or layout load function:
 * ```ts
 * import { validateSearchParams } from '$lib/hooks/useSearchParams.svelte';
 * import { productSchema } from './schemas';
 *
 * export const load = ({ url }) => {
 *   // Get validated search params as URLSearchParams object
 *   // Only accesses 'page', 'filter', 'sort' parameters from the URL
 *   // Load function will only re-run when these specific parameters change
 *   const searchParams = validateSearchParams(url, productSchema, {
 *     compressedParamName: '_compressed'
 *   });
 *
 *   // Use URLSearchParams directly with fetch
 *   const response = await fetch(`/api/products?${searchParams.toString()}`);
 *   return {
 *     products: await response.json()
 *   };
 * };
 * ```
 */
export function validateSearchParams<Schema extends StandardSchemaV1>(
	url: URL,
	schema: Schema,
	options: { compressedParamName?: string } = {}
): { searchParams: URLSearchParams; data: StandardSchemaV1.InferOutput<Schema> } {
	const compressedParamName = options.compressedParamName || "_data";
	let validatedValue: Record<string, unknown> = {};

	// Check if we're dealing with compressed data and handle appropriately
	if (url.searchParams.has(compressedParamName)) {
		try {
			// Get and decompress the data
			const compressedData = url.searchParams.get(compressedParamName) || "";
			const decompressed = lzString.decompressFromEncodedURIComponent(compressedData);

			if (decompressed) {
				try {
					// Parse the decompressed JSON
					const decompressedObj = JSON.parse(decompressed);
					// Validate against schema
					const result = schema["~standard"].validate(decompressedObj);
					if (result && "value" in result) {
						validatedValue = result.value as Record<string, unknown>;
					} else {
						// Use defaults if validation fails
						const emptyResult = schema["~standard"].validate({});
						validatedValue = (
							emptyResult && "value" in emptyResult ? emptyResult.value : {}
						) as Record<string, unknown>;
					}
				} catch (e) {
					console.error("Failed to parse decompressed data", e);
					// Use defaults if parsing fails
					const emptyResult = schema["~standard"].validate({});
					validatedValue = (
						emptyResult && "value" in emptyResult ? emptyResult.value : {}
					) as Record<string, unknown>;
				}
			} else {
				// Use defaults if decompression fails
				const emptyResult = schema["~standard"].validate({});
				validatedValue = (emptyResult && "value" in emptyResult ? emptyResult.value : {}) as Record<
					string,
					unknown
				>;
			}
		} catch (e) {
			console.error("Error decompressing data", e);
			// Use defaults if decompression errors
			const emptyResult = schema["~standard"].validate({});
			validatedValue = (emptyResult && "value" in emptyResult ? emptyResult.value : {}) as Record<
				string,
				unknown
			>;
		}
	} else {
		// Normal (uncompressed) extraction - use selective extraction for fine-grained reactivity
		const schemaKeys = extractSchemaKeys(schema);
		const paramsObject = extractSelectiveParamValues(url.searchParams, schemaKeys);

		// Validate the parameters against the schema
		let result = schema["~standard"].validate(paramsObject);
		if (result instanceof Promise) {
			throw new Error("Async validation is not supported in validateSearchParams");
		}
		if (result && "value" in result) {
			validatedValue = result.value as Record<string, unknown>;
		} else if (result && "issues" in result) {
			// If validation fails, use defaults
			const emptyResult = schema["~standard"].validate({});
			validatedValue = (emptyResult && "value" in emptyResult ? emptyResult.value : {}) as Record<
				string,
				unknown
			>;
			// find valid params in the paramsObject and use them, do not override all default values
			const validParams = Object.fromEntries(
				Object.entries(paramsObject).filter(
					([key]) => !result.issues?.some((issue) => issue.path?.includes(key))
				)
			);
			validatedValue = { ...validatedValue, ...validParams };
		}
	}

	// Create a new URLSearchParams object with the validated values
	const newSearchParams = new URLSearchParams();

	// Helper function to serialize values
	const serializeValue = (value: unknown): string => {
		if (Array.isArray(value)) {
			return JSON.stringify(value);
		} else if (typeof value === "object" && value !== null) {
			return JSON.stringify(value);
		} else {
			return String(value);
		}
	};

	// Add each validated parameter to the URLSearchParams
	for (const [key, value] of Object.entries(validatedValue)) {
		if (value === undefined || value === null) {
			continue;
		}

		const stringValue = serializeValue(value);
		newSearchParams.set(key, stringValue);
	}

	return {
		searchParams: newSearchParams,
		data: validatedValue as StandardSchemaV1.InferOutput<Schema>,
	};
}

export type ReturnUseSearchParams<T extends StandardSchemaV1> = SearchParams<T> &
	StandardSchemaV1.InferOutput<T> & {
		/**
		 * Convert the current schema parameters to a URLSearchParams object
		 * This includes all values defined in the schema, regardless of their presence in the URL
		 * @returns URLSearchParams object containing all current parameter values
		 */
		toURLSearchParams(): URLSearchParams;
	};

/**
 * Hook to create a reactive search params object with property access
 *
 * This client-side hook automatically updates the URL when parameters change.
 * It provides type-safe access to URL search parameters through direct property access.
 *
 * @param schema A validation schema compatible with StandardSchemaV1
 * @param options Configuration options that affect URL behavior
 * @returns A reactive object for working with typed search parameters
 *
 * Available options:
 * - `showDefaults` (boolean): When true, parameters with default values will be shown in the URL.
 *   When false (default), parameters with default values will be omitted from the URL.
 * - `debounce` (number): Milliseconds to delay URL updates when parameters change.
 *   Useful to avoid cluttering browser history when values change rapidly (default: 0, no debounce).
 * - `pushHistory` (boolean): Controls whether URL updates create new browser history entries.
 *   If true (default), each update adds a new entry to the browser history.
 *   If false, updates replace the current URL without creating new history entries.
 * - `compress` (boolean): When true, all parameters are compressed into a single parameter
 *   using lz-string compression. This helps reduce URL length and provides basic obfuscation (default: false).
 *   Use validateSearchParams with the same compressedParamName option when handling compressed URLs server-side.
 * - `compressedParamName` (string): The name of the parameter used to store compressed data
 *   when compression is enabled. Customize this to avoid conflicts with parameters in your schema.
 *   Default is '_data'.
 * - `updateURL` (boolean): When true (default), the URL is updated when parameters change.
 *   When false, only in-memory parameters are updated.
 *
 * Example with Zod:
 * ```
 * import { z } from 'zod';
 *
 * const productSearchSchema = z.object({
 *   page: z.number().catch(1),
 *   filter: z.string().catch(''),
 *   sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
 * });
 *
 * const params = useSearchParams(productSearchSchema);
 *
 * // Access parameters directly
 * const page = $derived(params.page); // number (defaults to 1)
 * const sort = $derived(params.sort); // 'newest' | 'oldest' | 'price'
 *
 * // Update parameters directly
 * params.page = 2; // Updates URL to include ?page=2
 * params.sort = 'price'; // Updates URL to include &sort=price
 * ```
 *
 * Example with options:
 * ```typescript
 * // Show default values in URL, debounce updates by 300ms,
 * // don't create new history entries, and compress params
 * const params = useSearchParams(schema, {
 *   showDefaults: true,
 *   debounce: 300,
 *   pushHistory: false,
 *   compress: true,
 *   compressedParamName: '_compressed' // Custom name to avoid conflicts
 * });
 *
 * // Great for binding to input fields (updates URL without cluttering history)
 * <input type="text" bind:value={params.search} />
 * // Resulting URL will be something like: /?_compressed=N4IgDgTg9g...
 * ```
 * Example with Valibot:
 * ```
 * import * as v from 'valibot';
 *
 * const productSearchSchema = v.object({
 *   page: v.optional(v.fallback(v.number(), 1), 1),
 *   filter: v.optional(v.fallback(v.string(), ''), ''),
 *   sort: v.optional(v.fallback(v.picklist(['newest', 'oldest', 'price']), 'newest'), 'newest'),
 * });
 *
 * const params = useSearchParams(productSearchSchema);
 * ``` * Example with Arktype:
 * ```
 * import { type } from 'arktype';
 *
 * const productSearchSchema = type({
 *   page: 'number = 1',
 *   filter: 'string = ""',
 *   sort: '"newest" | "oldest" | "price" = "newest"',
 * });
 *
 * const params = useSearchParams(productSearchSchema);
 * ```
 * Or with our built-in schema creator (no additional dependencies):
 *
 * ```
 * const productSearchSchema = createSearchParamsSchema({
 *   page: { type: 'number', default: 1 },
 *   filter: { type: 'string', default: '' },
 *   sort: { type: 'string', default: 'newest' }
 * });
 *
 * const params = useSearchParams(productSearchSchema);
 * ```
 */
export function useSearchParams<Schema extends StandardSchemaV1>(
	schema: Schema,
	options: SearchParamsOptions = {}
): ReturnUseSearchParams<Schema> {
	// Create the SearchParams instance to handle validation and URL updates
	// This is the core class that implements the actual functionality
	const searchParams = new SearchParams(schema, options);

	// Wait for hydration to complete before executing browser-specific initialization
	const isMounted = new IsMounted();

	// Only run initialization logic after hydration is complete
	$effect(() => {
		if (!isMounted.current || !browser || building) return;

		// Remove incorrect params on initialization (only after hydration)
		if (options.updateURL !== false) {
			const currentParams = extractParamValues(page.url.searchParams);
			const validationResult = schema["~standard"].validate(currentParams);
			if (
				validationResult &&
				"issues" in validationResult &&
				Array.isArray(validationResult.issues) &&
				validationResult.issues.length > 0
			) {
				// Find all incorrect param keys
				const invalidKeys = validationResult.issues
					.map((issue) =>
						Array.isArray(issue.path) && issue.path.length > 0 ? issue.path[0] : null
					)
					.filter(Boolean);
				if (invalidKeys.length > 0) {
					const newSearchParams = new URLSearchParams(page.url.searchParams.toString());
					for (const key of invalidKeys) {
						newSearchParams.delete(String(key));
					}
					goto("?" + newSearchParams.toString(), { replaceState: true });
				}
			}
		}

		// If showDefaults is true, we need to initialize the URL with all default values (only after hydration)
		if (options.showDefaults) {
			// Get all the default values (by validating an empty object)
			const validationResult = schema["~standard"].validate({});

			if (validationResult && "value" in validationResult) {
				// If compression is enabled, use SearchParams.update() method which handles compression
				if (options.compress) {
					// Call the update method with the default values to properly handle compression
					searchParams.update(
						validationResult.value as Partial<StandardSchemaV1.InferOutput<Schema>>
					);
				} else {
					// For non-compressed mode, use the original approach
					const defaultValues = validationResult.value as Record<string, unknown>;
					const currentParams = extractParamValues(page.url.searchParams);
					const newSearchParams = new URLSearchParams(page.url.searchParams.toString());
					let needsUpdate = false;

					// For each default value, add it to the URL if not already present
					for (const [key, defaultValue] of Object.entries(defaultValues)) {
						// Skip if the parameter is already in the URL (don't override user values)
						if (key in currentParams) continue;

						needsUpdate = true;

						if (defaultValue === null || defaultValue === undefined) {
							continue;
						}

						let stringValue: string;
						if (Array.isArray(defaultValue)) {
							stringValue = JSON.stringify(defaultValue);
						} else if (typeof defaultValue === "object" && defaultValue !== null) {
							stringValue = JSON.stringify(defaultValue);
						} else {
							stringValue = String(defaultValue);
						}

						newSearchParams.set(key, stringValue);
					}

					// Only update the URL if we added parameters
					if (needsUpdate) {
						// Always use replaceState: true for initialization to avoid creating a new history entry
						// Don't use debouncing for initialization as this is a one-time operation
						goto("?" + newSearchParams.toString(), { replaceState: true });
					}
				}
			}
		}
	});

	// Only run this logic in the browser and if debounce is enabled
	if (browser && !building && options.debounce && options.debounce > 0) {
		$effect(() => {
			// This effect runs once when the hook is initialized within a component.
			// It has no dependencies, so it doesn't re-run.
			return () => {
				searchParams.cleanup();
			};
		});
	}

	// Create a proxy to intercept property access/assignment
	// This enables the direct property syntax: params.page instead of params.get('page')
	// The proxy pattern is what makes the API feel natural and type-safe
	//
	// IMPORTANT LIMITATION: This proxy only provides top-level reactivity
	// - Direct property access works: params.page, params.filter
	// - Nested property changes require whole-object updates: params.fields = {...fields, newProp: value}
	// - Arrays/objects are not granularly reactive: params.items[0].name = 'new' won't trigger URL updates
	//
	// For granular nested reactivity, you would need:
	// 1. Recursive proxy creation for nested objects/arrays
	// 2. Path tracking system (e.g., "fields.0.name")
	// 3. Granular URL serialization instead of JSON
	// 4. Complete rewrite of validation and type systems
	// This would be a breaking change requiring a new major version
	const handler: ProxyHandler<SearchParams<Schema>> = {
		get: (target, prop: string | symbol) => {
			// Special methods we want to expose directly with proper binding
			if (prop === "reset") {
				// We need to handle each method individually to satisfy TypeScript
				return function (showDefaults?: boolean) {
					return target.reset(showDefaults);
				};
			} else if (prop === "update") {
				return function (values: Partial<StandardSchemaV1.InferOutput<Schema>>) {
					return target.update(values);
				};
			} else if (prop === "cleanup") {
				return function () {
					return target.cleanup();
				};
			} else if (prop === "toURLSearchParams") {
				// Implementation of toURLSearchParams
				return function (): URLSearchParams {
					const newSearchParams = new URLSearchParams();

					// Get the schema's default values + current values
					const validationResult = schema["~standard"].validate({});

					if (validationResult && "value" in validationResult) {
						const schemaValues = validationResult.value as Record<string, unknown>;

						// Create an object with all the values from the schema
						// First set the default values
						const allValues: Record<string, unknown> = { ...schemaValues };

						// Then override with the current values from the proxy
						// This ensures we get the most up-to-date values that might not yet be in the URL or in-memory store
						for (const key of Object.keys(schemaValues)) {
							// Get the current value using the proxy's access
							if (typeof key === "string" && target.has(key)) {
								const currentValue = target.get(
									key as keyof StandardSchemaV1.InferOutput<Schema> & string
								);
								if (currentValue !== undefined) {
									allValues[key] = currentValue;
								}
							}
						}

						// Add each parameter to the URLSearchParams
						for (const [key, value] of Object.entries(allValues)) {
							// Skip undefined/null values
							if (value === undefined || value === null) {
								continue;
							}

							// Serialize the value
							let stringValue: string;
							if (Array.isArray(value)) {
								stringValue = JSON.stringify(value);
							} else if (typeof value === "object" && value !== null) {
								stringValue = JSON.stringify(value);
							} else {
								stringValue = String(value);
							}

							// Set the parameter
							newSearchParams.set(key, stringValue);
						}
					}

					return newSearchParams;
				};
			}

			// IMPORTANT: We use the has() method to determine if this is a schema parameter
			// This is why the has() method must be maintained
			if (typeof prop === "string" && target.has(prop)) {
				// Type assertion needed here because TypeScript can't infer that our runtime check
				// with target.has() guarantees that prop is a valid key of our schema output type

				// NOTE: This returns the raw value (object/array/primitive) without nested proxification
				// If the value is an object or array, changes to its nested properties won't trigger
				// URL updates automatically. Users must reassign the entire object/array to trigger updates:
				// ❌ Won't work: params.config.theme = 'dark'
				// ✅ Works: params.config = {...params.config, theme: 'dark'}
				// ❌ Won't work: params.items.push(newItem)
				// ✅ Works: params.items = [...params.items, newItem]
				return target.get(prop as keyof StandardSchemaV1.InferOutput<Schema> & string);
			}
			return Reflect.get(target, prop);
		},
		set: (target, prop: string | symbol, value) => {
			// Similar to get(), we use has() to determine if this is a schema parameter
			if (typeof prop === "string" && target.has(prop)) {
				// Same type assertion needed here to tell TypeScript that we've verified
				// this string is a valid key in our schema through the target.has() check

				// NOTE: This triggers a complete re-serialization of the value to the URL
				// For objects/arrays, the entire structure is JSON-stringified and stored
				// This is why nested property mutations don't work - they don't trigger this setter
				// Only direct assignment to the top-level property triggers URL updates
				target.set(prop as keyof StandardSchemaV1.InferOutput<Schema> & string, value);
				return true;
			}
			return Reflect.set(target, prop, value);
		},
	};

	return new Proxy(searchParams, handler) as ReturnUseSearchParams<Schema>;
}
