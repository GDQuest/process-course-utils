const characters = "abcdefghijklmnopqrstuvwxyz";

/**
 * Quick and easy hashing function that returns a base64-encoded hash of the input message.
 * The hash is truncated to 8 characters. Collisions are possible.
 * This is not a secure hash function, use it to create unique identifiers in HTML.
 * @param input The string to hash.
 * @param length The length of the hash to return. Defaults to 8.
 * @returns
 */
export function hash(input: string, length = 8) {
  let hash = 0;
  // Use only the first 20 chars max for better performance
  const str = input.slice(0, 20);

  // Generate a numeric hash
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert to positive number
  hash = Math.abs(hash);

  // Convert to letters (a-z)
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(hash % characters.length);
    hash = Math.floor(hash / characters.length);

    // If we run out of hash entropy, use a simple counter approach
    if (hash === 0) {
      hash = i + 1;
    }
  }

  return result;
}
