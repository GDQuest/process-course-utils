export const isHTMLElement = (el: unknown): el is HTMLElement =>
  el != null && typeof el === "object" && ("nodeName" in el) &&
  typeof el.nodeName === "undefined";
