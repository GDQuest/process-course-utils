// as seen on https://www.10xtech.io/blogs/nominal-types
declare const __type: unique symbol;

export type NominalType<Identifier, Type> = Type & {
  readonly [__type]: Identifier;
};


export type Identifier = NominalType<"Identifier", string>;
export type Slug = NominalType<"Slug", string>; 

export const isIdentifier = (word:string): word is Identifier => /^[a-z][a-zA-Z0-9_]+$/.test(word);
export const isSlug = (word:string): word is Slug => /^[a-zA-Z0-9_]+$/.test(word);