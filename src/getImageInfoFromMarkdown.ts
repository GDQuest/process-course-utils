import { dirname, join, relative } from "jsr:@std/path";
import {
  getImageDimensionsFromFilePath,
  augmentImageDimensions,
} from "./getImageDimensions/mod.ts";

/**
 * Given an image src relative to a file, returns size information about the image.
 * @param imageHTMLSrc
 * @param markdownFilePath
 * @param rootDirectoryPath
 * @returns
 */
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