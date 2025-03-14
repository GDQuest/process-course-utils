import { isHTMLBooleanAttribute } from './htmlBooleanAttributes.ts';
import "../../web/browserTypes.d.ts";
import { HTMLFactory } from "./types.ts";
import { escapeHTML } from "../escapeHTML.ts";
import { isSelfClosingTag } from "./isSelfClosingTag.ts";
import { kebabize } from "../kebabize.ts";

// import { functionRegistry } from "./functionRegistery.ts";

/**
let uniqueIdCounter = 0;
 *
 * Generates ids for HTML elements. Should probably be using a hash from the element's string
function generateUniqueId(prefix: string = 'hydrate'): string {
  return `${prefix}-${uniqueIdCounter++}`;
}
*/

export const createElementString: HTMLFactory.CreateElement<"server"> = <
  K extends keyof HTMLElementTagNameMap
>(
  tagName: K,
  attributes?: HTMLFactory.Attributes<K> | null,
  ...children: HTMLFactory.ValidChild[]
): string => {
  // const elementId = generateUniqueId('el');

  const attributesString = attributes
    ? " " +
      Object.entries(attributes)
        .map(([k, v]) => {
          if (typeof v === "function") {
            throw new Error(
              "Function attributes are not supported in server-side rendering"
            );
            /*
                  if (k.startsWith("on")) {
                      const event = k.slice(2).toLowerCase();
                      const handlerId = generateUniqueId('evt');
                      // Register the function for later hydration
                      if (!functionRegistry.eventHandlers[elementId]) {
                          functionRegistry.eventHandlers[elementId] = {};
                      }
                      functionRegistry.eventHandlers[elementId][event] = v;
                      
                      // Add data attributes for hydration
                      return `data-hydrate-id="${elementId}" data-event-${event}="${handlerId}"`;
                  } else {
                      // For other function attributes (like bind functions)
                      const bindId = generateUniqueId('bind');
                      functionRegistry.bindFunctions[bindId] = v;
                      return `data-bind-fn="${bindId}" data-bind-key="${k}"`;
                  }
                  */
          } else if (k.startsWith("aria")) {
            const property = "aria-" + kebabize(k.slice(4));
            return `${property}="${escapeHTML(v + "")}"`;
          } else if (k.startsWith("data")) {
            const property = "data-" + kebabize(k.slice(4));
            return `${property}="${escapeHTML(v + "")}"`;
          } else if (k === "className" || k === "class") {
            const classValue = v as HTMLFactory.ClassNameValue;
            let classProp = "";
            if (Array.isArray(classValue)) {
              // /@ts-expect-error typescript doesn't deal with infinite recursion
              classProp = classValue.flat(Infinity).filter(Boolean).join(" ");
            } else {
              if (classValue != null && classValue !== false) {
                classProp = classValue + "";
              }
            }
            return classProp ? `class="${escapeHTML(classProp)}"` : "";
          } else if (k === "props") {
            const propsValue = v as HTMLFactory.Props;
            return Object.entries(propsValue)
              .map(
                ([prop, value]) =>
                  `data-prop-${prop}="${escapeHTML(value + "")}"`
              )
              .join(" ");
          } else if( v === false && isHTMLBooleanAttribute(k)){
            return false;
          }
          else {
            return `${k}="${escapeHTML(v + "")}"`;
          }
        })
        .filter(Boolean)
        .join(" ")
    : "";

  if (isSelfClosingTag(tagName, children)) {
    return `<${tagName}${attributesString}/>`;
  }

  const childrenContent = children
    .map((child) => {
      if (child == null || child === false) {
        return "";
      } else if (Array.isArray(child)) {
        return createElementString(...child);
      } else if (typeof child === "string" || typeof child === "number") {
        return child
      } else if (typeof child === "function") {
        throw new Error(
          "Function children are not supported in server-side rendering"
        );
        /*
              const fnId = generateUniqueId('fn');
              functionRegistry.functionChildren[fnId] = child;
              return `<span data-fn-child="${fnId}"></span>`;
              */
      } else if (typeof child === "object") {
        throw new Error(
          "Object children are not supported in server-side rendering"
        );
        /**
         * 
        return `<!-- DOM node placeholder -->`;
         */
      }
      return "";
    })
    .join("");

  return `<${tagName}${attributesString}>${childrenContent}</${tagName}>`;
};
