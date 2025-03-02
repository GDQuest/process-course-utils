export type ImageDimensions = {
  width: number;
  height: number;
};

export type ImageDimensionsAugmented = ImageDimensions & {
  ratio: number;
  aspectRatio: AspectRatio;
};

export type AspectRatio = "landscape" | "portrait" | "square";
