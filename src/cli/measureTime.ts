export const startMeasuringTime = (markerPrefix: string) => {
  performance.mark(`${markerPrefix}-start`);
  return () => getMeasuredTime(markerPrefix);
};

export const getMeasuredTime = (markerPrefix: string) => {
  performance.mark(`${markerPrefix}-end`);
  const measure = performance.measure(
    `${markerPrefix}-duration`,
    `${markerPrefix}-start`,
    `${markerPrefix}-end`
  );
  return measure.duration
};
