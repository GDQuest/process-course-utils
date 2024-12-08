
export function extractTypescriptTypeDefinitionFromFile(sourcePath: string, typeName: string) {
  const file = Deno.readTextFileSync(new URL(sourcePath));
  const regex = new RegExp((`(?:export\\s)\\s*((?:type\\s+${typeName}\\s*=|interface\\s+${typeName})\\s*{\\s*[\\s\\S]*?\\n\\s*}\\s*;)\\s*\\n`), "m");
  const [, extracted] = file.match(regex) || [, ""];
  return extracted;
}
