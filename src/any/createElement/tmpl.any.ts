import "../../web/browserTypes.d.ts";
import { createElementsProxy } from "./createElementProxy.ts";
import { createElementString as createElement } from "./createElementString.ts";

export const tmpl = createElementsProxy(createElement);