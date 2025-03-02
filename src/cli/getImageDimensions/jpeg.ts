import { getUint16, isValidOffsetToRead } from "./utilities.ts";
import type { ImageDimensions } from "./types.ts";

const SOF0 = 0xff_c0;
const SOF3 = 0xff_c3;

const jsJpeg = (bytes: Uint8Array) =>
  bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

export const jpeg = (bytes: Uint8Array): ImageDimensions | undefined => {
  if (!jsJpeg(bytes)) {
    return;
  }

  const dataView = new DataView(bytes.buffer);

  let offset = 2; // Start after the SOI marker.

  while (isValidOffsetToRead(dataView, offset, 2)) {
    const marker = dataView.getUint16(offset);
    offset += 2; // Move past the marker.

    if (marker >= SOF0 && marker <= SOF3) {
      const height = getUint16(dataView, offset + 3, false);
      const width = getUint16(dataView, offset + 5, false);

      if (height === undefined || width === undefined) {
        return;
      }

      return {
        height,
        width,
      };
    }

    const segmentLength = getUint16(dataView, offset);

    if (segmentLength === undefined) {
      return; // Unexpected EOF when reading segment length.
    }

    offset += segmentLength; // Skip over the segment.

    if (offset > dataView.byteLength) {
      return; // Segment length exceeds byte range.
    }
  }
};
