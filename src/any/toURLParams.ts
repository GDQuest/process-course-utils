export const toURLParams = (values: FormData | Record<string, unknown>) =>
  (values instanceof FormData
    ? Array.from(values.entries())
    : Object.entries(values)
  )
  .map(([k, v]) =>
    Array.isArray(v)
      ? v.map((vv) => `${k}=${encodeURIComponent(vv)}`).join("&")
      : typeof v === "string" || typeof v === "number"
        ? `${k}=${encodeURIComponent(v)}`
        : typeof v === "boolean"
          ? `${k}=${v ? "true" : "false"}`
          : `${k}=${encodeURIComponent(JSON.stringify(v))}`)
          .join("&");