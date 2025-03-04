import "../../web/browserTypes.d.ts";
import { createElementString as createElement } from "./createElementString.ts";
import { elementsFactory } from "./elementsFactory.ts";

export const tmpl = {
  createElement,
  ...elementsFactory(
    createElement,
    "h1",
    "h2",
    "h3",
    "a",
    "div",
    "ul",
    "li",
    "span",
    "button",
    "form",
    "img"
  ),
};
