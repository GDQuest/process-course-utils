import './browserTypes.d.ts'
import { type AttributesKeys } from "../types/htmlAttributesTypes.ts";
import { type BindedFunction } from "./makeNodeSignalBinder.ts";

/**
 * All possible values for a `class` property
 */
type ClassNameValue = string | undefined | (string | undefined)[];

/**
 * All possible props key => values correspondances
 */
type AttributesValues<T> = T extends "class" ? ClassNameValue
    : T extends "className" ? ClassNameValue
    : T extends `on${string}` ? EventListenerOrEventListenerObject
    : T extends "file" ? File
    : T extends "props" ? any
    : T extends string ? string
    : never;

type ComputedAttributesKeys =
    | AttributesKeys
    | "className"
    | `on${string}`
    | "props"
    | "exportparts";

/**
 * All possible attributes
 */
type Attributes = {
    [K in ComputedAttributesKeys]?: AttributesValues<K> | BindedFunction;
};

type ValidChild =
    | SerializedElement<any>
    | HTMLElement
    | Node
    | BindedFunction
    | string
    | number
    | null
    | undefined
    | false;

/**
 * A serializable format for elements.
 */
type SerializedElement<K extends keyof HTMLElementTagNameMap> = [
    tagName: K,
    attributes?: Attributes | null,
    ...children: ValidChild[],
];

export function createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes?: Attributes | null,
    ...children: ValidChild[]
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
                        ? createElement(...c)
                        : typeof c === "string" || typeof c === "number"
                        ? document.createTextNode(c + "")
                        : typeof c === "function"
                        ? c(document.createTextNode(""), "textContent")
                        : c,
                ),
        );
    return element;
}

/**
 * bind a tagname and optional properties
 * @param tagName the base tagname
 * @param baseAttributes if provided, will be merged with passed properties
 * @returns
 */
export const createElementTemplate = <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    baseAttributes?: Attributes | null,
) =>
(attributes?: Attributes | null, ...children: ValidChild[]) =>
    createElement(
        tagName,
        baseAttributes != null
            ? { ...baseAttributes, ...attributes }
            : attributes,
        ...children,
    );

export const elementsFactory = <
    K extends keyof HTMLElementTagNameMap,
    Ks extends readonly K[],
>(
    ...names: Ks
) => {
    type Values = {
        [K in Ks[number]]: ReturnType<typeof createElementTemplate<K>>;
    };
    return names.reduce((v, k) => {
        v[k] = createElementTemplate(k);
        return v;
    }, {} as Values);
};
