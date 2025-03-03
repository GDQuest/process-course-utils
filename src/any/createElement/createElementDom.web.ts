import '../../web/browserTypes'
import { HTMLFactory } from './types.ts';

export function createElementDom<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes?: HTMLFactory.Attributes | null,
    ...children: HTMLFactory.ValidChild[]
) {
    const element = document.createElement(tagName);
    attributes &&
        Object.entries(attributes).forEach(([k, v]) => {
            if (typeof v === "function") {
                if (k.startsWith("on")) {
                    const event = k.slice(2).toLowerCase();
                    // @ts-ignore
                    element.addEventListener(event, v);
                } else {
                    v(element, k);
                }
            } else if (k.startsWith("aria")) {
                const property = "aria-" + k.slice(4).toLowerCase();
                element.setAttribute(property, v + "");
            } else if (k.startsWith("data")) {
                const property = "data-" + k.slice(4).toLowerCase();
                element.setAttribute(property, v + "");
            } else if (k === "className" || k === "class") {
                if (Array.isArray(v)) {
                    const classes = v.filter(Boolean) as string[];
                    element.classList.add(...classes);
                } else {
                    if(v.includes(" ")) {
                        throw new Error("Invalid class name: " + v);
                    }
                    element.classList.add(v + "");
                }
            } else if (k === "props") {
                Object.entries(v).forEach(([prop, value]) => {
                    // TODO: properly type props
                    // @ts-ignore
                    element[prop] = value;
                });
            } else {
                element.setAttribute(k, v + "");
            }
        });
    children &&
        children.map(
            (c) =>
                c != null && c !== false &&
                element.appendChild(
                    Array.isArray(c)
                        ? createElementDom(...c)
                        : typeof c === "string" || typeof c === "number"
                        ? document.createTextNode(c + "")
                        : typeof c === "function"
                        ? c(document.createTextNode(""), "textContent")
                        : c,
                ),
        );
    return element;
}


