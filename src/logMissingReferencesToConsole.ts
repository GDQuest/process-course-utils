import { sprintf } from "jsr:@std/fmt/printf";

/**
 * Outputs a list of files with missing references to the console.
 * @param missingReferences a record of missing references
 */
export function logMissingReferencesToConsole(
  missingReferences: Record<string, string[]>,
  printFn: (message: string) => void,
  title: string,
  sentence: string
) {
  if (Object.keys(missingReferences).length > 0) {
    printFn(title);
    for (const [ref, files] of Object.entries(missingReferences)) {
      printFn(sprintf(sentence, ref, files.join("', '")));
    }
  }
}
