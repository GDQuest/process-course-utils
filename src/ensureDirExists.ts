export async function ensureDirExists(dirPath: string) {
  try {
    await Deno.readDir(dirPath);
  } catch (_error) {
    throw new Error(
      `Directory \`${dirPath}\` does not exist or is not accessible.`
    );
  }
}
