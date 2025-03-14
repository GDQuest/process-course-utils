export const htmlBooleanAttributes = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable",
];

const htmlBooleanAttributesSet = new Set(htmlBooleanAttributes);

export type HTMLBooleanAttribute = (typeof htmlBooleanAttributes)[number];

export const isHTMLBooleanAttribute = (
  value: string
): value is HTMLBooleanAttribute =>
  htmlBooleanAttributesSet.has(value as HTMLBooleanAttribute);
