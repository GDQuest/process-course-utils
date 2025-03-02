import { z } from "./zod.ts";
import { parseStringArray } from "./parseStringArray.ts";

export const maybeStringArraySchema = z
  .union([z.string(), z.array(z.string())])
  .transform(parseStringArray);
