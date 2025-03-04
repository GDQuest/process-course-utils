export const toURLParams = (values: FormData | Record<string, unknown>) =>
  (values instanceof FormData
    ? Array.from(values.entries())
    : Object.entries(values)
  )
    .map(([k, v]) => `${k}=${encodeURIComponent(v + "")}`)
    .join("&");
