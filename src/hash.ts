import { crypto } from "jsr:@std/crypto/crypto";
import { encodeBase64 } from "jsr:@std/encoding/base64";

/**
 * Quick and easy hashing function that returns a base64-encoded hash of the input message.
 * The hash is truncated to 8 characters. Collisions are possible.
 * This is not a secure hash function, use it to create unique identifiers in HTML.
 * @param source The string to hash.
 * @returns 
 */
export function hash(source: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(source);
  const hashBuffer = crypto.subtle.digestSync("BLAKE3", data).slice(0, 8);
  const hashStr = encodeBase64(hashBuffer).replace(/[=+]/g, "");
  return hashStr;
}
