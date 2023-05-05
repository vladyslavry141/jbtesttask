export const buildRange = (start: number, stop: number, step = 1) =>
  Array.from({ length: stop - start + 1 }, (_, i) => start + i * step);
