import { dirname, join, relative } from "jsr:@std/path";
import {
  getImageDimensionsFromFilePath,
  augmentImageDimensions,
} from "./getImageDimensions/mod.ts";

export async function getImageInfoFromMarkdown(
  imageHTMLSrc: string,
  markdownFilePath: string,
  rootDirectoryPath: string
) {
  const filePath = imageHTMLSrc.startsWith("/")
    ? imageHTMLSrc
    : join(dirname(markdownFilePath), imageHTMLSrc);

  const imageInfo = await getImageDimensionsFromFilePath(filePath);

  if (imageInfo != undefined) {
    return {
      ...augmentImageDimensions(imageInfo),
      filePath,
      relPath: relative(rootDirectoryPath, filePath),
      originalSrc: imageHTMLSrc,
    };
  }
}
