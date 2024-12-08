import { type Plugin, unified } from "https://esm.sh/unified@11.0.4";
import type { Html, Node, Root } from "npm:@types/mdast";
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
import { componentsMap } from "./transformCustomHTMLTags/transformCustomHTMLTags.ts";

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

function remarkCustomComponentExtractor(
  componentsMap: Record<
    string,
    (
      properties: Record<string, string | true | number>,
      node: ProcessedJSXNode
    ) => Node | string
  >
) {
  const extractComponents = <T extends Node>(node: T): Node => {
    if (isMdxJsxFlowElement(node) || isMdxJsxTextElement(node)) {
      if (node.name == null) {
        // fragment
        node.children = node.children.map(extractComponents);
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
        ? { className: `custom-component ${node.name}`, ...props }
        : props;

      const children = node.children?.map(extractComponents) ?? [];

      const newNode: ProcessedJSXNode = {
        type: node.name,
        isCustomComponent,
        data: {
          hName,
          hProperties,
        },
        children,
      };

      if (node.name in componentsMap) {
        const result = componentsMap[node.name](
          {
            children: "%children%",
            ...hProperties,
          },
          newNode
        );
        if (typeof result === "string") {
          // poor man's children replacement
          const parts = result.split("%children%");
          if (parts.length === 2) {
            return {
              type: "mdxJsxFlowElement",
              name: null,
              children: [
                {
                  type: "html",
                  value: parts[0],
                },
                ...newNode.children,
                {
                  type: "html",
                  value: parts[1],
                },
              ],
            } as MdxJsxFlowElement;
          }
          return {
            type: "html",
            value: result,
          } as Html;
        }
        return result;
      }

      return newNode;
    }

    if ("children" in node && node.children && Array.isArray(node.children)) {
      node.children = node.children.map(extractComponents);
    }

    return node;
  };

  const plugin: Plugin<[], Root> = () => {
    const processor = (tree: Root) => {
      const processedTree = extractComponents(tree) as Root;
      return processedTree;
    };
    return processor;
  };

  return plugin;
}

export async function renderMarkdown(markdownString: string) {
  // Process the markdown
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    // deno-lint-ignore no-explicit-any
    .use(remarkCustomComponentExtractor(componentsMap as any))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdownString);

  return file.toString() as string;
}
