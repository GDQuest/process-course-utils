import { HTMLFactory } from "./types.ts";

/**
 * Binds a tagname and optional properties
 * @param createElement the function that creates the element
 * @param tagName the base tagname
 * @param baseAttributes if provided, will be merged with passed properties
 */
export const createElementTemplate = <
  K extends keyof HTMLElementTagNameMap,
  Mode extends "client" | "server"
>(
  createElement: HTMLFactory.CreateElement<Mode>,
  tagName: K,
  baseAttributes?: HTMLFactory.Attributes<K> | null
) => {
  return (
    attributes?: HTMLFactory.Attributes<K> | null,
    ...children: HTMLFactory.ValidChild[]
  ): Mode extends "client" ? HTMLElementTagNameMap[K] : string => {
    return createElement(
      tagName,
      baseAttributes != null
        ? { ...baseAttributes, ...attributes }
        : attributes,
      ...children
    ) as Mode extends "client" ? HTMLElementTagNameMap[K] : string;
  };
};

/** 
 * 
import { createElementDom } from "./createElementDom.web.ts";
import { createElementString } from "./createElementString.ts";

// Client-side usage - no need to specify types explicitly
const createElementTemplateDom = createElementTemplate(createElementDom, "div");
const div = createElementTemplateDom(); // Still correctly typed as HTMLDivElement

// You can also make specific tag templates with inference
const a = createElementTemplate(createElementDom, "a");
// a() will return HTMLAnchorElement

// Server-side usage with inference
const createH1String = createElementTemplate(createElementString, "h1");
const h1 = createH1String()
*/
