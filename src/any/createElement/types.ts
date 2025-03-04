import type { AttributesKeys } from "../../types/htmlAttributesTypes.ts";
import type { BindedFunction } from "../../web/makeNodeSignalBinder.ts";

/**
 * Extends HTML Properties with valid properties to use in the createElement function
 */
export declare namespace HTMLFactory {
  /**
   * All possible values for a `class` property
   */
  export type ClassNameValue = string | undefined | (string | undefined)[];
  
  /**
   * Properties of HTML entities that aren't valid HTML attributes.
   * This can be custom properties on web components, or monkey-patched properties.
   * TODO: type this properly some day
   */
  export type Props = Record<string, unknown>;
  
  /**
   * All possible props key => values correspondances
   */
  export type AttributesValues<T> = T extends "class"
    ? ClassNameValue
    : T extends "className"
    ? ClassNameValue
    : T extends `on${string}`
    ? EventListenerOrEventListenerObject
    : T extends "file"
    ? File
    : T extends "props"
    ? Props
    : T extends string
    ? string
    : never;
  
  export type ComputedAttributesKeys =
    | AttributesKeys
    | "className"
    | `on${string}`
    | "props"
    | "exportparts";
  /**
   * All possible attributes
   */
  export type Attributes = {
    [K in ComputedAttributesKeys]?: AttributesValues<K> | BindedFunction;
  };

  export { BindedFunction }
  export type ValidChild =
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
  export type SerializedElement<K extends keyof HTMLElementTagNameMap> = [
    tagName: K,
    attributes?: Attributes | null,
    ...children: ValidChild[]
  ];

  export type CreateElement<Mode extends "client" | "server"> = <
    K extends keyof HTMLElementTagNameMap
  >(
    tagName: K,
    attributes?: Attributes | null,
    ...children: ValidChild[]
  ) => Mode extends "client" ? HTMLElementTagNameMap[K] : string;

  export type ClientCreateElement = CreateElement<"client">;
  export type ServerCreateElement = CreateElement<"server">;
}
