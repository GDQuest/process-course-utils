import { dirname, join, relative as getRelative } from "jsr:@std/path";
import {
  getImageDimensionsFromFilePath,
  augmentImageDimensions,
  filePathIsSupportedImageType,
  type ImageDimensionsAugmented,
} from "./getImageDimensions/mod.ts";


export type ResourceInfo = {
  filePath: string;
  relPath: string;
  originalSrc: string;
  newSrc: string;
};
export type ImageResourceInfo = ImageDimensionsAugmented & ResourceInfo

export type AnyResourceInfo = ImageResourceInfo | ResourceInfo;

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
  
  const info = await getFileInfoFromMarkdown(imageHTMLSrc, markdownFilePath, rootDirectoryPath);
  
  if ('ratio' in info) {
    return info
  }
}


export async function getFileInfoFromMarkdown(
  fileHTMLSrc: string,
  markdownFilePath: string,
  rootDirectoryPath: string
):Promise<ImageResourceInfo| ResourceInfo>{
  const filePath = fileHTMLSrc.startsWith("/")
    ? fileHTMLSrc
    : join(dirname(markdownFilePath), fileHTMLSrc);

  const relPath = getRelative(rootDirectoryPath, filePath);
  const newSrc = relPath;

  const info = {
    filePath,
    relPath,
    newSrc,
    originalSrc: fileHTMLSrc,
  } as ResourceInfo;

  if (filePathIsSupportedImageType(filePath)) {
    const imageInfo = await getImageDimensionsFromFilePath(info.filePath);
    if (imageInfo) {
      return {
        ...augmentImageDimensions(imageInfo),
        ...info,
      } as ImageResourceInfo
    }
  }

  return info;

}