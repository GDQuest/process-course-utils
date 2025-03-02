import { png } from "./png.ts";
import { jpeg } from "./jpeg.ts";
import { gif } from "./gif.ts";
import { webp } from "./webp.ts";
import { avif } from "./avif.ts";
import type { ImageDimensions, ImageDimensionsAugmented } from "./types.ts";

export * from "./types.ts";

const _supportedImageTypes = [
  "png",
  "jpeg",
  "jpg",
  "gif",
  "webp",
  "avif",
] as const;

export type SupportedImageType = (typeof _supportedImageTypes)[number];

export const supportedImageTypes = new Map(
  _supportedImageTypes.map((type) => [type, true as const])
);

export const getImageDimensionsFromData = (bytes: Uint8Array) => {
  // The shortest signature is 3 bytes.
  if (bytes.length < 3) {
    return;
  }

  // Prevent issues with Buffer being passed. Seems to be an issue on Node.js 20 and later.
  bytes = new Uint8Array(bytes);

  // Note: Place types that can be detected fast first.
  return png(bytes) ?? gif(bytes) ?? jpeg(bytes) ?? webp(bytes) ?? avif(bytes);
};

export const getImageDimensionsFromStream = async (
  stream: ReadableStream<Uint8Array>
) => {
  const chunks: number[] = [];

  for await (const chunk of stream) {
    chunks.push(...chunk);

    const dimensions = getImageDimensionsFromData(new Uint8Array(chunks));
    if (dimensions) {
      return dimensions;
    }
  }
};

/**
 * Only reads the first few bytes of the file, just enough to get the necessary information to get its dimensions.
 * @param file
 * @returns
 */
export const getImageDimensionsFromFile = async (file: Deno.FsFile) => {
  const readable = file.readable.getReader();
  const chunks: number[] = [];
  while (true) {
    const { value, done } = await readable.read();
    if (done) {
      break;
    }
    if (value) {
      chunks.push(...value);
      const dimensions = getImageDimensionsFromData(new Uint8Array(chunks));
      if (dimensions) {
        return dimensions;
      }
    }
  }
};

/**
 * Loads a file and returns its dimensions. Only reads the first few bytes of the file, just enough to get the necessary information.
 * @param path
 * @returns
 */
export const getImageDimensionsFromFilePath = async (path: string) => {
  const file = await Deno.open(path, { read: true });
  const dimensions = await getImageDimensionsFromFile(file);
  file.close();
  return dimensions;
};

/**
 * Utility to add additional information to image dimensions.
 * It adds the aspect ratio `ratio` (as a number) and the aspect ratio type `aspectRatio` (as a string)
 * @param dimensions
 * @returns
 */
export function augmentImageDimensions(
  dimensions: ImageDimensions
): ImageDimensionsAugmented {
  const ratio = dimensions.width / dimensions.height;
  const aspectRatio =
    ratio > 1 ? "landscape" : ratio < 1 ? "portrait" : ("square" as const);
  const augmented: ImageDimensionsAugmented = {
    ...dimensions,
    ratio,
    aspectRatio,
  };
  return augmented;
}
