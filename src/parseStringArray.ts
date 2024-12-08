export function splitStringArray(input: string): string[];
export function splitStringArray(input: unknown): unknown[];
export function splitStringArray(
  input: string | unknown,
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
