import { HTMLFactory } from "./types.ts";
import { createElementTemplate } from "./createElementTemplate.ts";

/**
 * Creates a proxy that generates element creators on demand
 * @param createElement The function that creates the element
 * @returns A proxy object that generates element creators for any valid HTML tag
 */
export const createElementsProxy = <Mode extends "client" | "server">(
  createElement: HTMLFactory.CreateElement<Mode>
) => {
  // Cache for created element functions
  const cache = new Map<string, ReturnType<typeof createElementTemplate>>();

  // Create the proxy
  return new Proxy(createElement, {
    get(_target, prop) {
      const tagName = prop.toString();

      // Return from cache if already created
      if (cache.has(tagName)) {
        return cache.get(tagName);
      }

      // Check if it's a valid HTML tag name
      if (typeof tagName === "string" && isValidHTMLTag(tagName)) {
        const elementCreator = createElementTemplate(createElement, tagName);

        // Cache the creator function
        cache.set(tagName, elementCreator);
        return elementCreator;
      }

      return undefined;
    },
  }) as HTMLFactory.CreateElement<Mode> & {
    [K in keyof HTMLElementTagNameMap]: (
      attributes?: HTMLFactory.Attributes<K> | null,
      ...children: HTMLFactory.ValidChild[]
    ) => Mode extends "client" ? HTMLElementTagNameMap[K] : string;
  };
};

// TODO: is this necessary?
const isValidHTMLTag = (
  tagName: string
): tagName is keyof HTMLElementTagNameMap => {
  return typeof document !== "undefined"
    ? document.createElement(tagName) instanceof HTMLElement
    : /^[a-z][a-z0-9-]*$/i.test(tagName);
};
