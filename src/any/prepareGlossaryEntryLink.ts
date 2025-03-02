import { isPlainObject } from "./isPlainObject.ts";
import { splitStringArray } from "./parseStringArray.ts";

export type GlossaryEntryLink = {
  url: `/glossary/${string}`;
  label: string;
  term: string;
};

export const isGlossaryEntryLink = (data: unknown): data is GlossaryEntryLink =>
  isPlainObject(data) &&
  "url" in data &&
  typeof data.url === "string" &&
  "label" in data &&
  typeof data.label === "string" &&
  "term" in data &&
  typeof data.term === "string";

/**
 * Prepares a string or an object to be a GlossaryEntryLink object.
 * The `label` and `url` are temporary, since this function cannot cross-reference the passed term with the glossary index.
 *
 * It is expected that the proper values will be set later.
 * @param slug
 * @returns
 */
export function slugToGlossaryEntryLink(
  slug: unknown | string | GlossaryEntryLink
) {
  if (typeof slug !== "string") {
    if (isGlossaryEntryLink(slug)) {
      return slug;
    }
    return;
  }
  return {
    label: "",
    url: `/glossary/${slug}` as const,
    term: slug,
  };
}

/**
 * Takes a string, an array of strings, or an array of GlossaryEntryLink objects and returns an array of GlossaryEntryLink objects.
 *
 * All the glossary entries returned are incomplete and temporary, since this function does not have access to the glossary index to cross-reference the terms.
 * It is expected that the `label` and `url` properties will be set later.
 * @param data
 * @returns
 */
export const listToGlossaryEntryLinks = (
  data: unknown | (string | GlossaryEntryLink)[] | string
) =>
  splitStringArray(data).reduce((acc: GlossaryEntryLink[], element) => {
    const glossaryEntryLink = slugToGlossaryEntryLink(element);
    if (glossaryEntryLink) acc.push(glossaryEntryLink);
    return acc;
  }, []);
