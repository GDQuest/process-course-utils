export const getClampedRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;