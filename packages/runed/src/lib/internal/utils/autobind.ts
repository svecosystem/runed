/**
 * Method decorator that automatically binds class methods to their instance.
 * Creates a cached bound version of the method on first access.
 * Support for both synchronous and asynchronous methods.
 */
export function autobind(
	_target: unknown,
	propertyKey: string,
	descriptor: PropertyDescriptor
): PropertyDescriptor {
	const originalMethod = descriptor.value;

	return {
		configurable: true,
		enumerable: false,
		get(this: unknown) {
			if (this === undefined || this === null) return originalMethod;

			const bound = originalMethod.bind(this);

			// we only redefine the property if 'this' is an object
			if (typeof this === "object") {
				Object.defineProperty(this, propertyKey, {
					configurable: true,
					writable: true,
					enumerable: false,
					value: bound,
				});
			}

			return bound;
		},
	};
}
