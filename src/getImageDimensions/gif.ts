import { getUint16 } from "./utilities.ts";
import type { ImageDimensions } from "./types.ts";

const isGif = (bytes: Uint8Array) =>
  bytes[0] === 0x47 &&
  bytes[1] === 0x49 &&
  bytes[2] === 0x46 &&
  bytes[3] === 0x38 &&
  (bytes[4] === 0x37 || bytes[4] === 0x39) &&
  bytes[5] === 0x61;

export const gif = (bytes: Uint8Array): ImageDimensions | undefined => {
  if (!isGif(bytes)) {
    return;
  }

  const dataView = new DataView(bytes.buffer);

  const width = getUint16(dataView, 6, true);
  const height = getUint16(dataView, 8, true);

  if (width === undefined || height === undefined) {
    return;
  }

  return {
    width,
    height,
  };
};
