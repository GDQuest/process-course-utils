import { escape } from "jsr:@std/regexp/escape";

/**
 * Extracts strings from files between two custom delimiters.
 * This isn't a very robust solution, but it's good enough for simple use cases.
 * @param sourcePath the path to the file to extract the text from. You probably want to use `import.meta.url` here.
 */
export function extractTextBetweenDelimiters(
  sourcePath: string,
  start: RegExp | string,
  end: RegExp | string
) {
  if (start instanceof RegExp) {
    start = start.source;
  } else {
    start = escape(start);
  }
  if (end instanceof RegExp) {
    end = end.source;
  } else {
    end = escape(end);
  }
  const regex = new RegExp(`${start}([\\s\\S]+?)${end}`, "m");
  const file = Deno.readTextFileSync(new URL(sourcePath));
  const [, extracted] = file.match(regex) || [, ""];
  return extracted;
}
