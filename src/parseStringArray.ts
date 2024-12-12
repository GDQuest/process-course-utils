/**
 * Splits a comma-separated string into an array of strings. Items are trimmed on both sides.
 *
 * If the passed input is an array, it returns the array as is.
 * If the passed isn't a string, returns an empty array.
 *
 * In short, this function guarantees that the output is an array.
 *
 * @param input
 */
export function splitStringArray(input: string): string[];
export function splitStringArray<T>(input: T[]): T[];
export function splitStringArray(input: unknown): unknown[];
export function splitStringArray(
  input: string | unknown
): string[] | unknown[] {
  if (typeof input === "string") {
    return input.split(",").map((item) => item.trim());
  }
  if (Array.isArray(input)) {
    return input;
  }
  return [];
}

/**
 *  Ensures that a list is an array of strings. Useful for tags, categories, etc.
 */
export function parseStringArray(input: unknown): string[] {
  if (typeof input === "string") {
    return input.split(",").map((item) => item.trim());
  }
  if (Array.isArray(input)) {
    return input.filter((item) => typeof item === "string");
  }
  return [];
}
