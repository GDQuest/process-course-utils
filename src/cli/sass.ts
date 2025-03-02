import * as sass from "npm:sass@^1.80.6";
import { fromFileUrl } from "jsr:@std/path@^1.0.8";

export const sassOptionsDev: sass.Options<"async"> = {
  sourceMap: true,
  style: "expanded",
};

export const sassOptionsProd: sass.Options<"async"> = {
  sourceMap: false,
  style: "expanded",
};

type Options = sass.Options<"async"> & {
  inputPath: string;
  outputPath: string;
};

const parseUrl = function (url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

export async function compileSassFile(
  { inputPath, outputPath, ...options }: Options,
  dryRun: boolean
) {
  const result = await sass.compileAsync(inputPath, options);
  if (!dryRun) {
    if (result.sourceMap) {
      result.sourceMap.sources = result.sourceMap.sources.map(
        (file: string) => {
          return parseUrl(file)?.protocol === "file:"
            ? fromFileUrl(file)
            : file;
        }
      );

      const sourceMapJson = JSON.stringify(result.sourceMap);
      const sourceMapUrl = `data:application/json;base64,${btoa(
        sourceMapJson
      )}`;
      result.css += `\n/*# sourceMappingURL=${sourceMapUrl} */`;
    }
    await Deno.writeTextFile(outputPath, result.css);
  }
}
