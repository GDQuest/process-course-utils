import type { AttributesKeys } from '../../types/htmlAttributesTypes.ts';
import type { BindedFunction } from '../../web/makeNodeSignalBinder.ts';

export declare namespace HTMLFactory {
  /**
   * All possible values for a `class` property
  */
  type ClassNameValue = string | undefined | (string | undefined)[];
  /**
   * All possible props key => values correspondances
   */
  type AttributesValues<T> = T extends "class" ? ClassNameValue : T extends "className" ? ClassNameValue : T extends `on${string}` ? EventListenerOrEventListenerObject : T extends "file" ? File : T extends "props" ? any : T extends string ? string : never;
  type ComputedAttributesKeys = AttributesKeys |
    "className" |
    `on${string}` |
    "props" |
    "exportparts";
  /**
   * All possible attributes
   */
  export type Attributes = {
    [K in ComputedAttributesKeys]?: AttributesValues<K> | BindedFunction;
  };
  export type ValidChild = SerializedElement<any> |
    HTMLElement |
    Node |
    BindedFunction |
    string |
    number |
    null |
    undefined |
    false;
  /**
   * A serializable format for elements.
   */
  type SerializedElement<K extends keyof HTMLElementTagNameMap> = [
    tagName: K,
    attributes?: Attributes | null,
    ...children: ValidChild[]
  ];
}
