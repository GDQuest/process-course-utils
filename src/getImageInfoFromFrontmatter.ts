import { dirname, join } from "jsr:@std/path";
import {
  getImageDimensionsFromFilePath,
  augmentImageDimensions,
} from "./getImageDimensions/mod.ts";

export async function getImageInfoFromFrontmatter(
  imageSrc: string,
  filePath: string
) {
  const imagePath = imageSrc.startsWith("/")
    ? imageSrc
    : join(dirname(filePath), imageSrc);

  const imageInfo = await getImageDimensionsFromFilePath(imagePath);

  if (imageInfo != undefined) {
    return {
      ...augmentImageDimensions(imageInfo),
      filePath: imagePath,
      src: imageSrc,
    };
  }
}
