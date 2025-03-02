import { ensureDir, exists } from "jsr:@std/fs";

/**
 * Makes sure the distribution directory exists. If it already did, the previous directory
 * **will be removed**.
 * @param distDir
 * @param dryRun
 */
export async function ensureDistDir(
  distDir: string,
  dryRun: boolean,
  printFn: (message: string) => void
) {
  if (await exists(distDir)) {
    printFn(`Removing ${distDir}`);
    if (!dryRun) {
      await Deno.remove(distDir, { recursive: true });
    }
  }
  printFn(`Creating ${distDir}`);
  if (!dryRun) {
    await ensureDir(distDir);
  }
}
