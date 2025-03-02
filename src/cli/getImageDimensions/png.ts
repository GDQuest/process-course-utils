import { getUint32 } from "./utilities.ts";
import type { ImageDimensions } from "./types.ts";

const isPng = (bytes: Uint8Array) =>
  bytes[0] === 0x89 &&
  bytes[1] === 0x50 &&
  bytes[2] === 0x4e &&
  bytes[3] === 0x47 &&
  bytes[4] === 0x0d &&
  bytes[5] === 0x0a &&
  bytes[6] === 0x1a &&
  bytes[7] === 0x0a;

// https://iphonedev.wiki/CgBI_file_format
const isAppleMinifiedPng = (bytes: Uint8Array) =>
  bytes[12] === 0x43 &&
  bytes[13] === 0x67 &&
  bytes[14] === 0x42 &&
  bytes[15] === 0x49;

export const png = (bytes: Uint8Array): ImageDimensions | undefined => {
  if (!isPng(bytes)) {
    return;
  }

  const dataView = new DataView(bytes.buffer);
  const isAppleMinified = isAppleMinifiedPng(bytes);

  const width = getUint32(dataView, isAppleMinified ? 32 : 16, false);
  const height = getUint32(dataView, isAppleMinified ? 36 : 20, false);

  if (width === undefined || height === undefined) {
    return;
  }

  return {
    width,
    height,
  };
};
