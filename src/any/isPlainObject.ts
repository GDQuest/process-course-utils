/**
 * Checks if the given input is a plain object.
 *
 * @param input - The input to check.
 * @returns True if the input is a plain object, false otherwise.
 */
export function isPlainObject(
  input: unknown,
): input is Record<string, unknown> {
  return (
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input) &&
    input.constructor === Object
  );
}
