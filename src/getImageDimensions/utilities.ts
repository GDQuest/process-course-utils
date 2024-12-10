export const isValidOffsetToRead = (
  dataView: DataView,
  offset: number,
  bytesToRead: number,
) => dataView.byteLength >= offset + bytesToRead;

export const getUint32 = (
  dataView: DataView,
  offset: number,
  littleEndian = false,
) =>
  isValidOffsetToRead(dataView, offset, 4)
    ? dataView.getUint32(offset, littleEndian)
    : void 0;

export const getUint16 = (
  dataView: DataView,
  offset: number,
  littleEndian = false,
) =>
  isValidOffsetToRead(dataView, offset, 2)
    ? dataView.getUint16(offset, littleEndian)
    : void 0;
