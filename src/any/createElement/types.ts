import type { BindedFunction } from "../../web/makeNodeSignalBinder.ts";

/**
 * Extends HTML Properties with valid properties to use in the createElement function
 */
export declare namespace HTMLFactory {
  /**
   * All possible values for a `class` property
   */
  export type ClassNameValue = string | undefined | false | (string | undefined | false)[] | ClassNameValue[];

  /**
   * Properties of HTML entities that aren't valid HTML attributes.
   * This can be custom properties on web components, or monkey-patched properties.
   * TODO: type this properly some day
   */
  export type Props = Record<string, unknown>;

  type DOMEventHandler<K extends keyof ElementEventMap> = (
    event: ElementEventMap[K]
  ) => void;

  export type Attributes<
    T extends keyof HTMLElementTagNameMap,
    E extends HTMLElement = HTMLElementTagNameMap[T]
  > = Partial<{
    [K in Exclude<keyof E, "class" | "className">]: E[K]; //| BindedFunction;
  }> & {
    [K in `on${Capitalize<keyof ElementEventMap>}`]?: DOMEventHandler<
      Uncapitalize<K extends `on${infer E}` ? E : never>
    >;
  } & {
    class?: ClassNameValue;
    className?: ClassNameValue;
    classList?: ClassNameValue;
    [key: `data${Capitalize<string>}${string}`]: string | number | boolean | null | undefined;
    [key: `aria${Capitalize<string>}${string}`]: string | number | boolean | null | undefined;
  } & {
    props?: Props;
  };

  export { BindedFunction };
  export type ValidChild =
    | SerializedElement<keyof HTMLElementTagNameMap>
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
    attributes?: Attributes<K> | null,
    ...children: ValidChild[]
  ];

  export type CreateElement<Mode extends "client" | "server"> = <
    K extends keyof HTMLElementTagNameMap
  >(
    tagName: K,
    attributes?: Attributes<K> | null,
    ...children: ValidChild[]
  ) => Mode extends "client" ? HTMLElementTagNameMap[K] : string;

  export type ClientCreateElement = CreateElement<"client">;
  export type ServerCreateElement = CreateElement<"server">;
}
