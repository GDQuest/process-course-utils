import type { WalkEntry } from "jsr:@std/fs";
import { transformCustomHTMLTags } from "./transformCustomHTMLTags/transformCustomHTMLTags.ts";
import { parseMarkdownFile } from "./parseMarkdownFile.ts";

/**
 * Processes the markdown. If correctMarkdownInPlace is true, it will overwrite the current markdown file with html elements being replaced with custom components.
 * This is a little hack used specifically for Glossary entries. Long-term, we should be replacing that with pure html.
 * @param entry
 * @param filePath
 * @param collectTags a set to collect all custom JSX-HTML tags found in the markdown. Used for logging purposes
 * @param correctMarkdownInPlace if true, will use the regex replace
 */
export async function processMarkdownFile<T>(
  entry: WalkEntry,
  filePath: string,
  collectTags: Set<string>,
  correctMarkdownInPlace: boolean
) {
  const content = await Deno.readTextFile(entry.path);
  if (correctMarkdownInPlace) {
    const transformed = transformCustomHTMLTags(content);
    await Deno.writeTextFile(entry.path, transformed);
  }
  const { frontmatter, body } = await parseMarkdownFile(
    content,
    filePath,
    collectTags
  );

  return { frontmatter, body };
}
