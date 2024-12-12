import {
  transpile as _transpile,
  bundle as _bundle,
} from "jsr:@deno/emit@0.46.0";

/**
 * Transpiles a typescript file to javascript
 * @param filePath
 * @returns
 */
export const typescriptTranspile = async (filePath: string | URL) => {
  const url = new URL(filePath);
  const result = await _transpile(url);
  return result.get(url.href);
};

/**
 * Bundles a typescript file with its dependencies into a single javascript file
 * @param filePath
 * @returns
 */
export const typeScriptBundle = async (filePath: string | URL) => {
  const url = new URL(filePath);
  return await _bundle(url);
};
