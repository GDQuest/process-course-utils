import { join } from "jsr:@std/path";
import { ensureDir } from "jsr:@std/fs";
import { type Logger } from "jsr:@std/log";

const writeOutputFileOptions = {
  log: null as ((message: string) => void) | null,
};

export const setOutputFileWritterLogger = (
  printFn: (message: string) => void
) => {
  writeOutputFileOptions.log = printFn;
};

/**
 * Writes a text file
 * @param destDir destination directory
 * @param filename filename, including extension
 * @param data data to write to the file, either a string or a JSON object
 * @param json if true, the data will be stringified as JSON. The JSON is pretty-printed; if you need to control the formatting, use a string instead
 */
export async function writeOutputFile(
  destDir: string,
  filename: string,
  json: false,
  ...lines: string[]
): Promise<void>;
export async function writeOutputFile(
  destDir: string,
  filename: string,
  json: true,
  data: Record<string, unknown>
): Promise<void>;
export async function writeOutputFile(
  destDir: string,
  filename: string,
  json: boolean,
  data: string | Record<string, unknown>,
  ...lines: string[]
) {
  await ensureDir(destDir);
  const outputPath = join(destDir, filename);
  await Deno.writeTextFile(
    outputPath,
    json ? JSON.stringify(data, null, 2) : [data, ...lines].join("\n")
  );
  writeOutputFileOptions.log
    ? writeOutputFileOptions.log(`Wrote ${outputPath}`)
    : null;
}
