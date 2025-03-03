import { createElement } from './createElement.ts';
import { HTMLFactory } from './types.ts';

/**
 * bind a tagname and optional properties
 * @param tagName the base tagname
 * @param baseAttributes if provided, will be merged with passed properties
 * @returns
 */
export const createElementTemplate = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  baseAttributes?: HTMLFactory.Attributes | null
) => (attributes?: HTMLFactory.Attributes | null, ...children: HTMLFactory.ValidChild[]) => createElement(
  tagName,
  baseAttributes != null
    ? { ...baseAttributes, ...attributes }
    : attributes,
  ...children
);
