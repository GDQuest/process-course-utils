import './browserTypes.d.ts'
import { createElement as h, elementsFactory } from "./createElement.ts";

export const { h1, h2, h3, a, div, ul, li, span, button, form, img } =
    elementsFactory(
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
        "img",
    );

export { h };

type ChildScalar = Node | string | undefined | null | false;
type Child = ChildScalar | ChildScalar[] | Child[];

export const add = (parent: HTMLElement, ...children: Child[]) => {
    (children as ChildScalar[]).flat(Infinity).forEach((child) => {
        if (child == null || child === false) {
            return;
        }
        parent.append(child);
    });
};
