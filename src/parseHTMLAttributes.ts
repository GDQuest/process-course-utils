type DataAttributes = Record<string, string | boolean | number>;

type Attributes = {
  data?: DataAttributes;
} & Record<string, string | number>;

const attributeRegex = /(\w+)(?:\s*=\s*)?(?:(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;

const htmlTagRegex = /<.*?\s(.*?)\/?>/;

export const extractAttributesFromHtmlTag = (htmlString: string) => (htmlString.match(htmlTagRegex) ?? [, ""])[1]

/**
 * Quick and dirty HTML attribute parser
 *
 * Test the below with deno test --doc build/parseHTMLAttributes.ts
 * Usage:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const testCases = [
 *   // Basic cases
 *   ['<div class="test-class">', '{"class":"test-class"}'],
 *   ['<img src="image.jpg" alt="description">', '{"src":"image.jpg","alt":"description"}'],
 *   ["<input disabled>", '{"disabled":true}'],
 *   ["<div data-value='123' data-name=test>", '{"data":{"value":"123","name":"test"}}'],
 *   ['<custom-element prop1="value1" prop2=\'value2\' prop3=value3 prop4 data-prop5="prop5">', '{"prop1":"value1","prop2":"value2","prop3":"value3","prop4":true,"data":{"prop5":"prop5"}}'],
 *   ['<tag attr = "value with spaces">', '{"attr":"value with spaces"}'],
 *   ["<tag attr=value-without-quotes>", '{"attr":"value-without-quotes"}'],
 * ];
 *
 * testCases.forEach(([input, expected]) => {
 *   const propertiesStr = extractAttributesFromHtmlTag(input)
 *   const attrs = parseHtmlAttributes(propertiesStr)
 *   assertEquals(JSON.stringify(attrs), expected)
 * });
 * ```
 */
export function parseHtmlAttributes(htmlString: string) {

  const attributes: Attributes = {};
  let match;

  const dataAttributes: DataAttributes = {};
  let hasData = false;

  while ((match = attributeRegex.exec(htmlString)) !== null) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;

    // Determine the actual value (prefer double quotes, then single quotes, then unquoted)
    const value = doubleQuoted || singleQuoted || unquoted || true;

    if (name === "data") {
      Object.entries(parseHtmlAttributes(value as string)).forEach(
        ([key, value]) => {
          dataAttributes[key] = value as string;
          hasData = true;
        },
      );
      continue;
    }
    attributes[name] = value === "true" || value === true ? "" : value;
  }

  if (hasData) {
    attributes["data"] = dataAttributes;
  }
  return attributes;
}
