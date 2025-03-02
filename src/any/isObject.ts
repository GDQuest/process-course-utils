/**
 * Shortcut for Object.getPrototypeOf
 */
export const protoOf = Object.getPrototypeOf;
/**
 * Object prototype, used it for comparisons
 */
export const objProto = protoOf({});


export const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && protoOf(value) === objProto;