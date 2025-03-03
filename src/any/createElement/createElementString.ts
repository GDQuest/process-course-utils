import "../../web/browserTypes";
import { HTMLFactory } from "./types.ts";
import { functionRegistry } from "./functionRegistery.ts";
import { escapeHTML } from "../escapeHTML.ts";

// Generate unique IDs for hydration
let uniqueIdCounter = 0;
function generateUniqueId(prefix: string = 'hydrate'): string {
  return `${prefix}-${uniqueIdCounter++}`;
}

export function createElementString<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes?: HTMLFactory.Attributes | null,
  ...children: HTMLFactory.ValidChild[]
) {
  const elementId = generateUniqueId('el');
  let attributesString = '';
  
  if (attributes) {
      attributesString = Object.entries(attributes)
          .map(([k, v]) => {
              if (typeof v === "function") {
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
              } else if (k.startsWith("aria")) {
                  const property = "aria-" + k.slice(4).toLowerCase();
                  return `${property}="${escapeHTML(v + '')}"`;
              } else if (k.startsWith("data")) {
                  const property = "data-" + k.slice(4).toLowerCase();
                  return `${property}="${escapeHTML(v + '')}"`;
              } else if (k === "className" || k === "class") {
                  let classValue = '';
                  if (Array.isArray(v)) {
                      classValue = v.filter(Boolean).join(' ');
                  } else {
                      classValue = v + '';
                  }
                  return classValue ? `class="${escapeHTML(classValue)}"` : '';
              } else if (k === "props") {
                  // For props, we'll serialize them as data attributes
                  return Object.entries(v)
                      .map(([prop, value]) => `data-prop-${prop}="${escapeHTML(value + '')}"`)
                      .join(' ');
              } else {
                  return `${k}="${escapeHTML(v + '')}"`;
              }
          })
          .filter(Boolean)
          .join(' ');
  }
  
  // Handle self-closing tags
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
  if (selfClosingTags.includes(tagName) && (!children || children.length === 0)) {
      return `<${tagName}${attributesString ? ' ' + attributesString : ''} />`;
  }
  
  // Process children
  const childrenContent = children
      .map(child => {
          if (child == null || child === false) {
              return '';
          } else if (Array.isArray(child)) {
              return createElementString(...child);
          } else if (typeof child === 'string' || typeof child === 'number') {
              return escapeHTML(child + '');
          } else if (typeof child === 'function') {
              // For function children, create a placeholder with an ID
              const fnId = generateUniqueId('fn');
              functionRegistry.functionChildren[fnId] = child;
              return `<span data-fn-child="${fnId}"></span>`;
          } else if (typeof child === 'object') {
              // For DOM nodes, return placeholder
              return `<!-- DOM node placeholder -->`;
          }
          return '';
      })
      .join('');
  
  return `<${tagName}${attributesString ? ' ' + attributesString : ''}>${childrenContent}</${tagName}>`;
}
