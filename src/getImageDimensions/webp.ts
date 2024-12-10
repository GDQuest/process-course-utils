import { getUint32, isValidOffsetToRead } from "./utilities.ts";
import type { ImageDimensions } from "./types.ts";

// Specification: https://developers.google.com/speed/webp/docs/riff_container

const isWebp = (bytes: Uint8Array) =>
  // RIFF
  bytes[0] === 0x52 &&
  bytes[1] === 0x49 &&
  bytes[2] === 0x46 &&
  bytes[3] === 0x46 &&
  // WEBP
  bytes[8] === 0x57 &&
  bytes[9] === 0x45 &&
  bytes[10] === 0x42 &&
  bytes[11] === 0x50;

const isVP8Lossy = (bytes: Uint8Array) =>
  // `VP8 ` (note the space)
  bytes[12] === 0x56 &&
  bytes[13] === 0x50 &&
  bytes[14] === 0x38 &&
  bytes[15] === 0x20;

const isVP8Lossless = (bytes: Uint8Array) =>
  // `VP8L`
  bytes[12] === 0x56 &&
  bytes[13] === 0x50 &&
  bytes[14] === 0x38 &&
  bytes[15] === 0x4c;

const isVP8Extended = (bytes: Uint8Array) =>
  // `VP8X`
  bytes[12] === 0x56 &&
  bytes[13] === 0x50 &&
  bytes[14] === 0x38 &&
  bytes[15] === 0x58;

function readUInt24LE(dataView: DataView, offset: number) {
  const byte1 = dataView.getUint8(offset);
  const byte2 = dataView.getUint8(offset + 1);
  const byte3 = dataView.getUint8(offset + 2);

  // Combine the three bytes into a 24-bit integer.
  // eslint-disable-next-line no-bitwise
  return (byte3 << 16) | (byte2 << 8) | byte1;
}

export const webp = (bytes: Uint8Array): ImageDimensions | undefined => {
  if (!isWebp(bytes)) {
    return;
  }

  const dataView = new DataView(bytes.buffer);
  const maxSize = 0x3f_ff;

  if (isVP8Lossy(bytes)) {
    if (!isValidOffsetToRead(dataView, 28, 2)) {
      return;
    }

    return {
      // eslint-disable-next-line no-bitwise
      width: dataView.getUint16(26, true) & maxSize,
      // eslint-disable-next-line no-bitwise
      height: dataView.getUint16(28, true) & maxSize,
    };
  }

  if (isVP8Lossless(bytes)) {
    const bits = getUint32(dataView, 21, true);

    if (bits === undefined) {
      return;
    }

    return {
      // eslint-disable-next-line no-bitwise
      width: (bits & maxSize) + 1,
      // eslint-disable-next-line no-bitwise
      height: ((bits >> 14) & maxSize) + 1,
    };
  }

  if (isVP8Extended(bytes)) {
    if (!isValidOffsetToRead(dataView, 27, 3)) {
      return;
    }

    return {
      width: readUInt24LE(dataView, 24) + 1,
      height: readUInt24LE(dataView, 27) + 1,
    };
  }
};
