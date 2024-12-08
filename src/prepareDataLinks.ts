import { splitStringArray } from "./parseStringArray.ts";
import { isPlainObject } from "./isPlainObject.ts";

export const isResourceLinkInput = (data: unknown): data is ResourceLinkInput =>
  isPlainObject(data) && "url" in data && typeof data.url === "string";

export const toResourceLink = (
  isDefaultExternal: boolean,
  data: unknown | ResourceLinkInput | string | number,
) => {
  if (typeof data === "string" || typeof data === "number") {
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

type ResourceLinkInput = {
  url: string;
  label?: string;
  external?: boolean;
};

export type ResourceLink = {
  label: string;
  url: string;
  external: boolean;
};

export const listToResourceLinks = (
  isDefaultExternal: boolean,
  data: unknown | (ResourceLinkInput | string)[] | string,
) =>
  typeof data === "string" || Array.isArray(data) ? 
  splitStringArray(data).reduce((acc: ResourceLink[], element) => {
    const resourceLink = toResourceLink(isDefaultExternal, element);
    if (resourceLink) acc.push(resourceLink);
    return acc;
  }, []) : [];
