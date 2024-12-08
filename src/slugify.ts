export function slugify(str: string, maxChars = 25): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, maxChars)
    .replace(/-+$/, "");
}
