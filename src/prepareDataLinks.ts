import { splitStringArray } from "./parseStringArray.ts";
import { isPlainObject } from "./isPlainObject.ts";
import { z } from "./zod.ts";

export const isResourceLinkInput = (data: unknown): data is ResourceLinkInput =>
  isPlainObject(data) && "url" in data && typeof data.url === "string";

export const toResourceLink = (
  isDefaultExternal: boolean,
  data: unknown | ResourceLinkInput | string | number
) => {
  if (typeof data === "string") {
    return {
      label: data.toString(),
      url: data.toString(),
      external: isDefaultExternal,
    };
  }
  if (isResourceLinkInput(data)) {
    const external = data.external || isDefaultExternal;
    const label = data.label || data.url;
    return {
      label,
      url: data.url,
      external,
    };
  }
};

export const resourceLinkInputSchema = z.object({
  url: z.string(),
  label: z.string().optional(),
  external: z.boolean().optional(),
});

export const resourceLinkValidInput = z.union([
  z.string().min(1),
  resourceLinkInputSchema,
]);

type ResourceLinkInput = z.infer<typeof resourceLinkInputSchema>;

export type ResourceLink = {
  label: string;
  url: string;
  external: boolean;
};

export const listToResourceLinks = (
  isDefaultExternal: boolean,
  data: unknown | (ResourceLinkInput | string)[] | string
) =>
  typeof data === "string" || Array.isArray(data)
    ? splitStringArray(data).reduce((acc: ResourceLink[], element) => {
        const resourceLink = toResourceLink(isDefaultExternal, element);
        if (resourceLink) acc.push(resourceLink);
        return acc;
      }, [])
    : [];
