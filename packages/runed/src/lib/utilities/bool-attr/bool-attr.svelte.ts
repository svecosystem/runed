/**
 * Transforms any value into `""` (empty string) or `undefined` for use with HTML attributes where presence indicates truth.
 *
 * Unlike directly assigning a boolean (e.g., `data-active={true}`), which often renders the string "true" as the attribute's value,
 * this utility produces an empty string for truthy inputs (resulting in `<div data-active>`) or `undefined` for falsy inputs
 * (resulting in the attribute being omitted entirely: `<div>`). This pattern is standard for native boolean attributes
 * and essential for custom ones used as flags.
 *
 * This is particularly useful for custom `data-*` attributes that drive conditional styling (e.g., CSS selectors like `[data-state="active"]` or `[data-loading]`)
 * or JavaScript behavior. It simplifies applying conditional states for CSS frameworks like Tailwind CSS, enabling more terse attribute-based variants
 * such as `data-[active]:opacity-100` or `group-data-[loading]:pointer-events-none`, instead of needing to target the attribute's value (`data[active='true']:opacity-100`).
 */
export function boolAttr(value: unknown): "" | undefined {
	return value ? "" : undefined;
}
