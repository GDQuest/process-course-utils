import { transformCustomHTMLTags } from "../any/transformCustomHTMLTags/mod.ts";
import { parseMarkdownFile } from "./parseMarkdownFile.ts";
import { AnyResourceInfo } from "./getImageInfoFromMarkdown.ts";
import type { ComponentMap } from "./renderMarkdown.ts";

/**
 * Processes the markdown. If correctMarkdownInPlace is true, it will overwrite the current markdown file with html elements being replaced with custom components.
 * This is a little hack used specifically for Glossary entries. Long-term, we should be replacing that with pure html.
 *
 * @param fullPath the full path to the file.
 * @param relativePath the path to the file, used for debugging only.
 * @param collectTags a set to collect all custom JSX-HTML tags found in the markdown. Used for logging purposes
 * @param correctMarkdownInPlace if true, will use the regex replace
 */
export async function processMarkdownFile(
  fullPath: string,
  collectTags: Set<string>,
  addExternalResource: (
    filePath: string,
    src: string
  ) => Promise<AnyResourceInfo>,
  correctMarkdownInPlace: boolean,
  componentsMap?: ComponentMap,
) {
  const content = await Deno.readTextFile(fullPath);
  if (correctMarkdownInPlace) {
    const transformed = transformCustomHTMLTags(content);
    await Deno.writeTextFile(fullPath, transformed);
  }
  const { frontmatter, body } = await parseMarkdownFile(
    content,
    fullPath,
    collectTags,
    addExternalResource,
    componentsMap
  );

  return { frontmatter, body };
}
