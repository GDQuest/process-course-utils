import { type ZodError } from "https://deno.land/x/zod@v3.23.8/mod.ts";

export * from "https://deno.land/x/zod@v3.23.8/mod.ts";

export function printZodError<K, T extends ZodError<K>>(
  filePath: string,
  printError: (message: string) => void,
  error: T
) {
  const { _errors, ...fields } = error.format();
  if (_errors.length > 0) {
    printError(`Errors in \`${filePath}\`: ${_errors.join(", ")}`);
  }
  Object.entries(fields as Record<string, { _errors: string[] }>).forEach(
    ([key, { _errors }]) =>
      _errors.length > 0 &&
      printError(`Errors in \`${filePath}\`: ${key}: ${_errors.join(", ")}`)
  );
}
