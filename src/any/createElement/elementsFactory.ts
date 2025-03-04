import { HTMLFactory } from "./types.ts";
import { createElementTemplate } from "./createElementTemplate.ts";

/**
 * Utility to generate multiple element makers at once.
 * @param createElement The function that creates the element
 * @param names the names of the HTML elements
 * @returns
 */
export const elementsFactory = <
  Mode extends "client" | "server",
  K extends keyof HTMLElementTagNameMap,
  Ks extends readonly K[]
>(
  createElement: HTMLFactory.CreateElement<Mode>,
  ...names: Ks
) => {
  type HTMLElementConstructor<T extends keyof HTMLElementTagNameMap> = (
    attributes?: HTMLFactory.Attributes | null,
    ...children: HTMLFactory.ValidChild[]
  ) => Mode extends "client" ? HTMLElementTagNameMap[T] : string;

  type Values = {
    [K in Ks[number]]: HTMLElementConstructor<K>;
  };

  return names.reduce((v, k) => {
    v[k] = createElementTemplate(createElement, k);
    return v;
  }, {} as Values);
};
