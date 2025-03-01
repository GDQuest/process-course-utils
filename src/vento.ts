import vento, { type Options } from "jsr:@vento/vento";
import { existsSync } from "jsr:@std/fs@^1.0.5/exists";
import { writeOutputFile } from "./writeOutputFile.ts";


interface AugmentedVentoOptions extends Omit<Options, 'includes'> {
  includes: string,
  siteTitle: string
}

export const makeVento = ({siteTitle, ...options}: AugmentedVentoOptions) => {
  if (!existsSync(options.includes)) {
    throw new Error(`Views directory does not exist: ${options.includes}`);
  }
  const env = vento(options)

  const renderAndWriteFile =
    (template: string) =>
    async (
      directory: string,
      fileNameWithoutExtension: string,
      data: Record<string, unknown>
    ) => {
      writeOutputFile(
        directory,
        fileNameWithoutExtension + ".html",
        false,
        await render(template, data)
      );
    };

  const render = async (template: string, data: Record<string, unknown>, from?: string) => {
    const { title } = data;
    const pageTitle =
      typeof title === "string" && title.length > 0
        ? `${title} | ${siteTitle}`
        : siteTitle;
    const result = await env.run(template, {
      pageTitle,
      ...data,
    }, from);
    return result.content
  };

  const renderString = async (template: string, data: Record<string, unknown>) => {
    const result = await env.runString(template, data);
    return result.content;
  }

  return { renderAndWriteFile, render, renderString };
}
