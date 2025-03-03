import { createElementDom } from "./createElementDom.web.ts";
import { createElementString } from "./createElementString.ts";
import { isServer } from "../isServer.ts";
import { HTMLFactory } from "./types.ts";

// Define specific type for the createElement function
type CreateElementFunction = {
  <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes?: HTMLFactory.Attributes | null,
    ...children: HTMLFactory.ValidChild[]
  ): typeof isServer extends true ? string : HTMLElementTagNameMap[K];
};

export const createElement = (isServer ? createElementString : createElementDom) as CreateElementFunction;
