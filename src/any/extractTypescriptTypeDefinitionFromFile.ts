/**
 * Gets typescript definitions as strings from a file. This function makes some assumptions about the structure of the file:
 * - The type definition is exported
 * - The type definition is either a type or an interface
 * - The type definition is a struct of sorts (type aliases, arrays, unions, are not supported)
 * - The type definition ends with a `}` on its own line (with or without a `;` after it and/or spaces surrounding it)
 * @param sourcePath
 * @param typeName
 * @returns
 */
export function extractTypescriptTypeDefinitionFromFile(
  sourcePath: string,
  typeName: string
) {
  const file = Deno.readTextFileSync(new URL(sourcePath));
  const regex = new RegExp(
    `(?:export\\s)\\s*((?:type\\s+${typeName}\\s*=|interface\\s+${typeName})\\s*{\\s*[\\s\\S]*?\\n\\s*}\\s*;)\\s*\\n`,
    "m"
  );
  const [, extracted] = file.match(regex) || [, ""];
  return extracted;
}
