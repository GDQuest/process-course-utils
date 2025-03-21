import {
  transpile as _transpile,
  bundle as _bundle,
  BundleOptions,
} from "jsr:@deno/emit@0.46.0";

/**
 * Transpiles a typescript file to javascript
 * @param filePath
 * @returns
 */
export const typescriptTranspile = async (filePath: string | URL) => {
  const result = await _transpile(filePath);
  return result.get(filePath instanceof URL ? filePath.href : filePath);
};

/**
 * Bundles a typescript file with its dependencies into a single javascript source string
 * @param filePath
 * @returns
 */
export const typeScriptBundle = async (filePath: string | URL) => {
  return await _bundle(filePath);
};

export const typescriptBundleAndWrite = async (
  filePath: string | URL,
  outFile: string | URL,
  dryRun: boolean,
  options: BundleOptions,
) => {
  const { code } = await _bundle(filePath, options);
  if (dryRun) {
    return;
  }
  await Deno.writeTextFile(outFile, code);
};
