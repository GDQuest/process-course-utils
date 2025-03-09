import * as sass from "npm:sass@^1.80.6";
import { fromFileUrl } from "jsr:@std/path@^1.0.8";
import { Logger } from "./getLogger.ts";

export const sassOptionsDev: sass.Options<"sync"> = {
  sourceMap: true,
  style: "expanded",
};

export const sassOptionsProd: sass.Options<"sync"> = {
  sourceMap: false,
  style: "compressed",
};

type Options = Omit<sass.Options<"sync">, "logger"> & {
  inputPath: string;
  outputPath: string;
  variables?: Record<string, string>;
  logger: Logger;
};

const parseUrl = function (url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

export async function compileSassFile(
  { inputPath, outputPath, logger, ...options }: Options,
  dryRun: boolean
) {
  const { info, error, warn } = logger;

  const tempFileName = `globals.scss`;
  if (options.variables) {
    const variables = Object.entries(options.variables)
      .map(([k, v]) => `$${k}: ${v};`)
      .join("\n");
    if (variables.length) {
      const tempFileDir = await Deno.makeTempDir({ prefix: "sass_globals" });
      const tempFilePath = `${tempFileDir}/${tempFileName}`;
      await Deno.writeTextFile(tempFilePath, variables);
      options.loadPaths = [...(options.loadPaths || []), tempFileDir];
      info(
        `Compiling Sass with variables at path ${tempFilePath}: \n\`\`\`\n${variables}\`\`\``
      );
      info(`Sass load paths: ${options.loadPaths}`);
    }
  } else {
    error(`No variables provided for Sass compilation`);
  }

  const sassOptions: sass.Options<"sync"> = {
    ...options,
    logger: {
      warn,
      debug: info,
    },
  };

  info(`compiling Sass file ${inputPath} to ${outputPath}`, sassOptions);

  const result = sass.compile(inputPath, sassOptions);

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
