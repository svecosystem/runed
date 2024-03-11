import { nanoid } from "nanoid/non-secure";

/**
 * If an id is provided return it, otherwise generate a new id and return that.
 */
export function generateId(idFromProps: string | undefined | null = null): string {
	if (idFromProps == null) return nanoid(10);
	return idFromProps;
}
