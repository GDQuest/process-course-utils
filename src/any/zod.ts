import z, { type ZodError } from "https://deno.land/x/zod@v3.23.8/mod.ts";
export type { typeToFlattenedError } from "https://deno.land/x/zod@v3.23.8/mod.ts";


export { z, ZodError };

/**
 * Pretty prints a Zod error
 * @param printError
 * @param error
 */
export function printZodError<K, T extends ZodError<K>>(
  printError: (message: string) => void,
  error: T
) {
  const { _errors, ...fields } = error.format();
  if (_errors.length > 0) {
    printError(`${_errors.join(", ")}`);
  }
  Object.entries(fields as Record<string, { _errors: string[] }>).forEach(
    ([key, { _errors }]) =>
      _errors.length > 0 && printError(`${key}: ${_errors.join(", ")}`)
  );
}

export const dateSchema = z.string().or(z.date()).transform( arg => new Date( arg ) )