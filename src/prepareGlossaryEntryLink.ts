import { isPlainObject } from "./isPlainObject.ts";
import { splitStringArray } from "./parseStringArray.ts";

export type GlossaryEntryLink = {
  url: `/glossary/${string}`;
  label: string;
  term: string;
};

export const isGlossaryEntryLink = (data: unknown): data is GlossaryEntryLink =>
  isPlainObject(data) && "url" in data && typeof data.url === "string" &&
  "label" in data && typeof data.label === "string" && "term" in data &&
  typeof data.term === "string";

export function slugToGlossaryEntryLink(
  slug: unknown | string | GlossaryEntryLink,
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

export const listToGlossaryEntryLinks = (
  data: unknown | (string | GlossaryEntryLink)[] | string,
) =>
  splitStringArray(data).reduce((acc: GlossaryEntryLink[], element) => {
    const glossaryEntryLink = slugToGlossaryEntryLink(element);
    if (glossaryEntryLink) acc.push(glossaryEntryLink);
    return acc;
  }, []);
