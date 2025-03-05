import "../../web/browserTypes.d.ts";
import { createElementDom } from "./createElementDom.web.ts";
import { createElementsProxy } from "./createElementProxy.ts";

export const h = createElementsProxy(createElementDom);

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