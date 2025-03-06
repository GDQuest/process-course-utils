import { AnyResourceInfo } from "./getImageInfoFromMarkdown.ts";
import { parse as parseYaml } from "jsr:@std/yaml";
import { isPlainObject } from "../any/isPlainObject.ts";
import { renderMarkdown, type ComponentMap } from "./renderMarkdown.ts";

export interface ProcessFrontMatter<T> {
  (
    frontmatter: Record<string, unknown>,
    defaultSlug: string,
    filePath: string
  ): T;
}

/**
 * Parses the frontmatter and markdown from an MD/MDX file.
 * @param content the full file contents as a string
 * @param fullPath the path to the file, used for debugging only.
 * @param collectTags a set to collect all custom JSX-HTML tags found in the markdown. Used for logging purposes
 */
export async function parseMarkdownFile(
  content: string,
  fullPath: string,
  collectTags: Set<string>,
  addExternalResource: (
    filePath: string,
    src: string
  ) => Promise<AnyResourceInfo>,
  componentsMap?: ComponentMap
) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex) || [];
  const [, rawFrontmatter, rawBody] =
    match != null && match.length > 1 ? match : ["", ""];

  const frontmatter = (() => {
    const parsed = parseYaml(rawFrontmatter);
    if (!isPlainObject(parsed)) {
      throw new Error(
        "Frontmatter is not an object, got " + JSON.stringify(parsed)
      );
    }
    return parsed;
  })();

  const body = await (async () => {
    try {
      return await renderMarkdown(fullPath, rawBody, addExternalResource, componentsMap);
    } catch (error) {
      throw new Error(`Error rendering markdown for ${fullPath}: ${error}`);
    }
  })();

  body.matchAll(/<([A-Z][a-zA-Z]+[^\s\/>])/g).forEach((match) => {
    const [, tag] = match;
    collectTags.add(tag);
  });

  return { rawFrontmatter, frontmatter, body };
}
