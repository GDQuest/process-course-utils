import { dirname, join, relative as getRelative } from "jsr:@std/path";
import {
  getImageDimensionsFromFilePath,
  augmentImageDimensions,
  type ImageDimensionsAugmented,
} from "./getImageDimensions/mod.ts";

export type ImageResourceInfo = ImageDimensionsAugmented & {
  filePath: string;
  relPath: string;
  originalSrc: string;
  newSrc: string;
};

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
): Promise<ImageResourceInfo | undefined> {
  const filePath = imageHTMLSrc.startsWith("/")
    ? imageHTMLSrc
    : join(dirname(markdownFilePath), imageHTMLSrc);

  const imageInfo = await getImageDimensionsFromFilePath(filePath);
  const relPath = getRelative(rootDirectoryPath, filePath);
  const newSrc = relPath;

  if (imageInfo != undefined) {
    return {
      ...augmentImageDimensions(imageInfo),
      filePath,
      relPath,
      newSrc,
      originalSrc: imageHTMLSrc,
    };
  }
}
