import { splitStringArray } from "./parseStringArray.ts";
import { isPlainObject } from "./isPlainObject.ts";
import { z } from "./zod.ts";

export const isResourceLinkInput = (data: unknown): data is ResourceLinkInput =>
  isPlainObject(data) && "url" in data && typeof data.url === "string";

/**
 * Converts a string, or an incomplete ResourceLinkInput object to a complete ResourceLink object.
 *
 * If passing an object, it is required that the object has a `url` property.
 * If passing a string, it will be used as the label and URL.
 * @param isDefaultExternal if the input is a string or a ResourceLinkInput without `external` set, this value will be used as the `external` property.
 * @param data
 */
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
  platform: z
    .union([
      z.literal("windows"),
      z.literal("mac"),
      z.literal("linux"),
      z.literal("web"),
      z.literal("android"),
      z.literal("ios"),
      z.literal("all"),
      z.literal("other"),
    ])
    .optional(),
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
  platform?:
    | "windows"
    | "mac"
    | "linux"
    | "web"
    | "android"
    | "ios"
    | "all"
    | "other";
};

/**
 * Converts a commas-separated string, an array of strings, or an array of objects to an array of ResourceLink objects.
 *
 * If:
 * - the input is a comma-separated string, it splits the string into an array of strings.
 * - if the input is an array of strings, it assumes that the strings are URLs and converts them to ResourceLink objects.
 * - if the input is an array of objects, it is required that the object has at least a `url` property.
 *
 * @param isDefaultExternal Passed items that do not bear an `external` property (either incomplete ResourceLinks, or strings) will have their `external` property set to this value.
 * @param data The input data to convert to ResourceLink objects.
 */
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
