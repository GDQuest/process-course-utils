import { type Plugin, unified } from "https://esm.sh/unified@11.0.4";
import type {
  Html,
  Node,
  Root,
  RootContent,
  Parent,
  Image,
  InlineCode,
  Text as TextNode,
  Paragraph,
  // Code
} from "npm:@types/mdast";
import {
  type MdxJsxAttribute,
  type MdxJsxExpressionAttribute,
  type MdxJsxFlowElement,
  type MdxJsxTextElement,
} from "https://esm.sh/mdast-util-mdx-jsx@3.1.3";
import remarkParse from "https://esm.sh/remark-parse@11.0.0";
import remarkRehype from "https://esm.sh/remark-rehype@11.1.1";
import rehypeStringify from "https://esm.sh/rehype-stringify@10.0.0";
import remarkGfm from "https://esm.sh/remark-gfm@4.0.0";
import remarkMdx from "https://esm.sh/remark-mdx@3.0.0";
import rehypePrism from "https://esm.sh/rehype-prism-plus@2.0.0";
import { componentsMap as defaultComponentMap } from "../any/transformCustomHTMLTags/componentsMap.ts";
import { VFile } from "https://esm.sh/vfile@6.0.3";
import { AnyResourceInfo } from "./getImageInfoFromMarkdown.ts";

/**
 * Verifies a node is a an html Element
 */
export const isMdxJsxFlowElement = (node: Node): node is MdxJsxFlowElement =>
  "type" in node && node.type === "mdxJsxFlowElement";
/**
 * Verifies a node is a an html Element
 */
export const isMdxJsxTextElement = (node: Node): node is MdxJsxTextElement =>
  "type" in node && node.type === "mdxJsxTextElement";

export const isMdxJsxAttribute = (node: Node): node is MdxJsxAttribute =>
  "type" in node && node.type === "mdxJsxAttribute";

export const isMdxJsxExpressionAttribute = (
  node: Node
): node is MdxJsxExpressionAttribute =>
  "type" in node && node.type === "MdxJsxExpressionAttribute";

interface ProcessedJSXNode extends Node {
  type: string;
  isCustomComponent: boolean;
  data: {
    hName: string;
    hProperties: Record<string, string | true | number>;
  };
  children: Node[];
}

declare module "npm:@types/mdast" {
  interface RootContentMap {
    processedNode: ProcessedJSXNode;
  }
}
export type ComponentMap = Record<
  string,
  <T extends Record<string, unknown>>(
    properties: T,
    node: ProcessedJSXNode
  ) => Promise<Node | string> | Node | string
>;

const isInlinecode = (node: Node): node is InlineCode =>
  node && "type" in node && node.type === "inlineCode";

const isImageType = (node: Node): node is Image =>
  node && "type" in node && node.type === "image";

const isTextType = (node: Node): node is TextNode =>
  node && "type" in node && node.type === "text";

const isParagraphType = (node: Node): node is Paragraph =>
  node && "type" in node && node.type === "paragraph";

// const isCodeBlock = (node: Node): node is Code =>
//   node && "type" in node && node.type === "code";

function remarkCustomComponentExtractor(
  componentsMap: ComponentMap,
  addExternalResource: (file: string, src: string) => Promise<AnyResourceInfo>
) {
  const extractComponents = async <T extends Node>(
    node: T,
    file: VFile,
    index?: number,
    parent?: Parent
  ): Promise<Node | Node[] | false> => {
    const _children =
      "children" in node &&
      Array.isArray(node.children) &&
      node.children.length > 0
        ? node.children
        : [];
    const children = (
      node && _children.length > 0
        ? await Promise.all(
            _children.map((child, index) =>
              extractComponents(child, file, index, node as unknown as Parent)
            )
          )
        : []
    )
      .flat(1)
      .filter((c) => c != false);

    if (index !== undefined && parent && isParagraphType(node)) {
      if (
        children.length === 0 ||
        children.every(
          (child) => isTextType(child) && /^[\s\n]*$/.test(child.value)
        )
      ) {
        return false;
      }
      if (
        "__isComponent" in children[0] &&
        children[0].__isComponent &&
        "__componentType" in children[0] &&
        typeof children[0].__componentType === "string" &&
        children[0].__componentType !== ""
      ) {
        const componentType = children[0].__componentType;
        if (
          componentType === "SectionTitle" ||
          componentType === "Hint" ||
          componentType === "Challenge" ||
          componentType === "VideoFile" ||
          componentType === "VideoEmbed"
        ) {
          return children;
        }
      }
      if (
        children.length === 1 &&
        "type" in children[0] &&
        children[0].type === "image" // image
      ) {
        return children[0];
      }
    }

    if (isInlinecode(node)) {
      const value = node.value;
      const isGodotIcon = /^[A-Z][A-Za-z\d]+$/.test(value);
      const hasRenderer = componentsMap && "IconGodot" in componentsMap;
      if (isGodotIcon && hasRenderer) {
        const result = await componentsMap["IconGodot"](
          { name: value, currentColor: false, asMask: false, content: value },
          node as unknown as ProcessedJSXNode
        );
        return {
          type: "html",
          value: result,
        } as Html;
      } else {
        return {
          type: "html",
          value: `<code class="language-gdscript">${value}</code>`,
        } as Html;
      }
    }

    if (isImageType(node) && node.url != null) {
      const result = await addExternalResource(file.path, node.url);
      if (result != null) {
        node.url = result.newSrc;
      }
      return node;
    }

    /* * /
    if(isCodeBlock(node)) {
      const content = node.value || "";
      const hasRenderer = componentsMap && "CodeBlock" in componentsMap;
      if(content && hasRenderer){
        const diff = node.lang?.startsWith("diff-") ?? false;
        const lang = node.lang ? diff ? node.lang.slice(5) : node.lang : "gdscript";
        const result = await componentsMap["CodeBlock"]({ lang, diff, content}, node as unknown as ProcessedJSXNode);
        return {
          type: "html",
          value: result,
        } as Html;
      }
    }
    /* */

    if (
      !(isMdxJsxFlowElement(node) || isMdxJsxTextElement(node)) ||
      typeof index === "undefined" ||
      typeof parent === "undefined" ||
      node.name == null ||
      node.name === ""
    ) {
      if (children.length > 0) {
        (node as unknown as Parent).children = children as RootContent[];
      }
      return node;
    }

    const props = Object.fromEntries(
      node.attributes.map((data): [string, string | true | number] => {
        if (isMdxJsxExpressionAttribute(data)) {
          throw new Error(
            `Dynamic attributes are not supported (${data.value})`
          );
        }
        const { name, value } = data;
        if (typeof value === "string" || typeof value === "number") {
          return [name, value] as const;
        }
        if (value == null) {
          return [name, true] as const;
        }
        if (
          typeof value === "object" &&
          `type` in value &&
          value.type === "mdxJsxAttributeValueExpression" &&
          `value` in value
        ) {
          return [name, value.value] as const;
        }
        return [name, JSON.stringify(value)] as const;
      })
    );

    const isCustomComponent = /[A-Z]/.test(node.name[0]);
    const hName = isCustomComponent
      ? "section"
      : node.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

    const hProperties = isCustomComponent
      ? { className: `custom-component-${node.name}`, ...props }
      : props;

    const newNode: ProcessedJSXNode = {
      type: node.name,
      isCustomComponent,
      data: {
        hName,
        hProperties,
      },
      children,
    };

    if (
      node.name === "VideoFile" &&
      newNode.data.hProperties.src &&
      typeof newNode.data.hProperties.src === "string" &&
      newNode.data.hProperties.src !== ""
    ) {
      const result = await addExternalResource(
        file.path,
        newNode.data.hProperties.src
      );
      if (result != null) {
        newNode.data.hProperties.src = result.newSrc;
      }
    }

    if (!componentsMap || !(node.name in componentsMap)) {
      return newNode;
    }
    const result = await componentsMap[node.name](
      {
        content: "%children%",
        ...hProperties,
      },
      newNode
    );
    if (typeof result !== "string") {
      return result;
    }
    // poor man's children replacement
    const parts = result.split("%children%");
    if (parts.length < 2) {
      return {
        type: "html",
        __isComponent: true,
        __componentType: node.name,
        value: result,
      } as Html;
    }
    const newNodes = [
      {
        type: "html",
        __isComponent: true,
        __componentType: node.name,
        value: parts[0],
      } as Html,
      ...children,
      {
        type: "html",
        value: parts[1],
      } as Html,
    ];
    return newNodes;
  };

  const plugin: Plugin<[], Root> = () => {
    const processor = async (tree: Root, file: VFile) => {
      await extractComponents(tree, file);
    };
    return processor;
  };

  return plugin;
}

interface RemarkExternalResourcesCollectorOptions {
  /** A function to call for each embedded resource
   * @param filePath the path to the file that contains the resource
   * @param src the src of the resource
   */
  addExternalResource: (file: string, src: string) => Promise<AnyResourceInfo>;
}

function remarkExternalResourcesCollector({
  addExternalResource,
}: RemarkExternalResourcesCollectorOptions) {
  const plugin: Plugin<[], Root> = () => {
    const handlers: Record<
      RootContent["type"][number],
      (node: any, file: VFile) => Promise<void> | void
    > = {
      image: async (node: Image, file) => {
        if (node.url == null) {
          return;
        }
        const result = await addExternalResource(file.path, node.url);
        if (result != null) {
          node.url = result.newSrc;
        }
      },
      VideoFile: async (node: MdxJsxFlowElement, file: VFile) => {
        const src = node.attributes.find((attr) => {
          if (isMdxJsxExpressionAttribute(attr)) {
            throw new Error(
              `Dynamic attributes are not supported (${attr.value})`
            );
          }
          return attr.name === "src";
        })?.value as string;
        if (src == null || typeof src !== "string" || src === "") {
          return;
        }
        const result = await addExternalResource(file.path, src);
        if (result != null) {
          node.attributes = node.attributes.map((attr) => {
            if (isMdxJsxAttribute(attr) && attr.name === "src") {
              return { ...attr, value: result.newSrc };
            }
            return attr;
          });
        }
      },
    };

    const mapToHandlers = async (node: Node, file: VFile) => {
      if (
        "children" in node &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        for (const n of node.children) {
          await mapToHandlers(n, file);
        }
      }
      if (
        "type" in node &&
        typeof node.type === "string" &&
        node.type in handlers
      ) {
        return await handlers[node.type](node, file);
      } else if (
        (isMdxJsxFlowElement(node) || isMdxJsxTextElement(node)) &&
        node.name &&
        node.name in handlers
      ) {
        return await handlers[node.name](node, file);
      }
      return;
    };

    const processor = async (tree: Root, file: VFile) => {
      await mapToHandlers(tree, file);
      return tree;
    };
    return processor;
  };

  return plugin;
}

/**
 * Uses unified to process markdown string. Does not handle frontmatter; split it out before calling this function.
 * @param markdownString
 * @returns
 */
export async function renderMarkdown(
  path: string,
  markdownString: string,
  addExternalResource: (
    filePath: string,
    src: string
  ) => Promise<AnyResourceInfo>,
  componentsMap: ComponentMap = defaultComponentMap as any
) {
  const vfile = new VFile({ path, value: markdownString });

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    //.use(remarkExternalResourcesCollector({ addExternalResource }))
    .use(remarkCustomComponentExtractor(componentsMap, addExternalResource))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism as any)
    //.use(rehypeUnwrapImages)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(vfile);

  return file.toString() as string;
}
