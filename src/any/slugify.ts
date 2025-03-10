/**
 * Takes a bit of text and ensures it is a valid identifier.
 * @param str
 * @param maxChars
 * @returns
 */
export function slugify(str: string, maxChars = 25): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, maxChars)
    .replace(/-+$/, "");
}
