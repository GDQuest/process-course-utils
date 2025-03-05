import "../../web/browserTypes.d.ts";
import { HTMLFactory } from "./types.ts";
import { kebabize } from "../kebabize.ts";

export const createElementDom: HTMLFactory.CreateElement<"client"> = <
  K extends keyof HTMLElementTagNameMap
>(
  tagName: K,
  attributes?: HTMLFactory.Attributes<K> | null,
  ...children: HTMLFactory.ValidChild[]
) => {
  const element = document.createElement(tagName);
  attributes &&
    (Object.entries(attributes)).forEach(
      ([k, v]) => {
        if (typeof v === "function") {
          const fn = v as
            | HTMLFactory.BindedFunction
            | EventListenerOrEventListenerObject;
          if (k.startsWith("on")) {
            const listener = fn as EventListenerOrEventListenerObject;
            const event = k.slice(2).toLowerCase();
            element.addEventListener(event, listener);
          } else {
            // @ts-expect-error: way too complicated to type properly
            fn(element, k);
          }
        } else if (k.startsWith("aria")) {
          const property = "aria-" + kebabize(k.slice(4));
          element.setAttribute(property, v + "");
        } else if (k.startsWith("data")) {
          const property = "data-" + kebabize(k.slice(4));
          element.setAttribute(property, v + "");
        } else if (k === "className" || k === "class") {
          const classValue = v as HTMLFactory.ClassNameValue;
          if (classValue == null || classValue === false) {
            return;
          }
          if (Array.isArray(classValue)) {
            const classes = classValue.filter(Boolean) as string[];
            element.classList.add(...classes);
          } else {
            if (classValue.includes(" ")) {
              throw new Error("Invalid class name: " + v);
            }
            element.classList.add(v + "");
          }
        } else if (k === "props") {
          const propsValue = v as HTMLFactory.Props;
          Object.entries(propsValue).forEach(([prop, value]) => {
            // TODO: properly type props
            // @ts-expect-error: this is an escape hatch
            element[prop] = value;
          });
        } else {
          element.setAttribute(k, v + "");
        }
      }
    );
  children &&
    children.map(
      (c) =>
        c != null &&
        c !== false &&
        element.append(
          Array.isArray(c)
            ? createElementDom(...c)
            : typeof c === "string" || typeof c === "number"
            ? document.createTextNode(c + "")
            : typeof c === "function"
            ? (c(document.createTextNode(""), "textContent") ?? "")
            : c
        )
    );
  return element;
};
