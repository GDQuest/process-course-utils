import vento, { type Options as VentoOptions } from "jsr:@vento/vento";
import { type Template as VentoTemplate } from "jsr:@vento/vento/src/environment.ts";
import { existsSync } from "jsr:@std/fs@^1.0.5/exists";
import { writeOutputFile } from "./writeOutputFile.ts";


export { VentoTemplate}

interface AugmentedVentoOptions extends Omit<VentoOptions, 'includes'> {
  includes: string,
  siteTitle: string
}

export interface TemplateWriter{
  template: VentoTemplate,
  render: (data: Record<string, unknown>) => Promise<string>,
  renderAndWrite: (destDir: string, data: Record<string, unknown>, filenameWithoutExtension?: string) => Promise<void>
}

export const makeVento = ({siteTitle, ...options}: AugmentedVentoOptions) => {
  if (!existsSync(options.includes)) {
    throw new Error(`Views directory does not exist: ${options.includes}`);
  }
  const env = vento(options)

  const augmentTemplateData = (data: Record<string, unknown>) => {
    if ('pageTitle' in data) {
      return data;
    }
    const { title } = data;
    const pageTitle =
      typeof title === "string" && title.length > 0
        ? `${title} | ${siteTitle}`
        : siteTitle;
    return { pageTitle, ...data };
  }


  const makeTemplateWriter =
    async (templateFileName: string, initialData?: Record<string, unknown>, from?: string): Promise<TemplateWriter> => {
          const template = await env.load(templateFileName, from);
          const render = async (data: Record<string, unknown>) => {
            const _data = initialData ? { ...initialData, ...data } : data;
            const result = await template(augmentTemplateData(_data));
            return result.content;
          }
          const renderAndWrite = async (destDir: string, data: Record<string, unknown>, filenameWithoutExtension: string = "index") => {
            const result = await render(data);
            await writeOutputFile(destDir, filenameWithoutExtension + '.html', false, result);
          }
          return { template, render, renderAndWrite };
    }

  const render = async (templateFilePath: string, data: Record<string, unknown>, from?: string) => {
    const result = await env.run(templateFilePath, augmentTemplateData(data), from);
    return result.content
  };

  const renderString = async (templateFilePath: string, data: Record<string, unknown>) => {
    const result = await env.runString(templateFilePath, data);
    return result.content;
  }

  const prepareTemplate = async (templateFilePath: string, from?: string) => await env.load(templateFilePath, from);

  return { makeTemplateWriter, render, renderString, prepareTemplate };
}
